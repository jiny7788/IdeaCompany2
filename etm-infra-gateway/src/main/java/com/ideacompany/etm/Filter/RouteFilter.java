package com.ideacompany.etm.Filter;

import java.io.InputStream;
import java.util.Enumeration;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.netflix.zuul.filters.ProxyRequestHelper;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;

import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;
import com.netflix.zuul.exception.ZuulException;

import okhttp3.Headers;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import okhttp3.internal.http.HttpMethod;

@CrossOrigin
@Component
public class RouteFilter extends ZuulFilter {
	private static Logger logger = LoggerFactory.getLogger(RouteFilter.class);
	
	@Autowired
    private ProxyRequestHelper helper;

	@Override
	public String filterType() {
		return FilterConstants.ROUTE_TYPE;
	}

	@Override
	public int filterOrder() {
		return FilterConstants.SIMPLE_HOST_ROUTING_FILTER_ORDER - 1;
	}

	@Override
	public boolean shouldFilter() {
		// Filter를 적용할지 여부를 결정한다. true면 필터 적용
		RequestContext requestContext = RequestContext.getCurrentContext();
		HttpServletRequest request = requestContext.getRequest();
		logger.info("[Route Filter] uri: {}, URL: {}", request.getRequestURI(), request.getRequestURL());
			
		return true;
	}

	@Override
	public Object run() throws ZuulException {
		OkHttpClient httpClient = new OkHttpClient.Builder()
                // customize
                .build();

        RequestContext context = RequestContext.getCurrentContext();
        HttpServletRequest request = context.getRequest();

        String method = request.getMethod();

        //String uri = this.helper.buildZuulRequestURI(request);
        String uri = request.getRequestURI();
        logger.info("[Route Filter] ZuulURI: {}, URI: {}, URL: {}", this.helper.buildZuulRequestURI(request), request.getRequestURI(), request.getRequestURL());
        
        if(uri.contains("/etm-svc-control/test/greeting")) 
        {
        	logger.info("[Route Filter] Enter Route Filter: Org URI: {}, Zuul URI: {}", request.getRequestURI(), this.helper.buildZuulRequestURI(request));        	
	        String url = "http://localhost:8090/test/";
	
	        Headers.Builder headers = new Headers.Builder();
	        Enumeration<String> headerNames = request.getHeaderNames();
	        while (headerNames.hasMoreElements()) {
	            String name = headerNames.nextElement();
	            Enumeration<String> values = request.getHeaders(name);
	
	            while (values.hasMoreElements()) {
	                String value = values.nextElement();
	                headers.add(name, value);
	            }
	        }
	        
	        String queryString = request.getQueryString();
	        logger.info("[Route Filter] queryString: {}", queryString);
	        if(queryString != null && !queryString.isEmpty()) {	// query string을 url에 합쳐준다.
	        	url = url + "?" + queryString;
	        }
	
	        try {
		        InputStream inputStream = request.getInputStream();
		
		        RequestBody requestBody = null;
		        if (inputStream != null && HttpMethod.permitsRequestBody(method)) {
		            MediaType mediaType = null;
		            if (headers.get("Content-Type") != null) {
		                mediaType = MediaType.parse(headers.get("Content-Type"));
		            }
		            requestBody = RequestBody.create(mediaType, StreamUtils.copyToByteArray(inputStream));
		        }
		
		        Request.Builder builder = new Request.Builder()
		                .headers(headers.build())
		                .url(url)
		                .method(method, requestBody);
		        
		        logger.info("[Route Filter] Before call {}, method {}", builder.build(), method);	
		        Response response = httpClient.newCall(builder.build()).execute();
		        logger.info("[Route Filter] After {}", response);
		
		        LinkedMultiValueMap<String, String> responseHeaders = new LinkedMultiValueMap<>();
		
		        for (Map.Entry<String, List<String>> entry : response.headers().toMultimap().entrySet()) {
		            responseHeaders.put(entry.getKey(), entry.getValue());
		        }
		
		        this.helper.setResponse(response.code(), response.body().byteStream(), responseHeaders);

	        } catch(Exception e) {
	        	logger.info("[Route Filter] Error {}", e.getMessage());
	        }
        }
        
        context.setRouteHost(null); // prevent SimpleHostRoutingFilter from running

        return null;
	}

}
