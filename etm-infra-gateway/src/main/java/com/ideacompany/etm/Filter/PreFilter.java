package com.ideacompany.etm.Filter;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.StringUtils;
import org.json.simple.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cloud.client.ServiceInstance;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.WebUtils;

import com.ideacompany.etm.Config.RedisConfig;
import com.ideacompany.etm.Exception.ApiException;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@CrossOrigin
@Component
public class PreFilter extends ZuulFilter {
	private static Logger logger = LoggerFactory.getLogger(PreFilter.class);

    @Autowired
    private DiscoveryClient discoveryClient;	
    
    @Autowired
    public RedisTemplate<String, String> authAccessKeyRedisTemplate;        
    
    @Override
    public String filterType() {
        return FilterConstants.PRE_TYPE;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }    
    
    @Override
    public Object run() {
    	RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        logger.info("getRequestURI() :: {} ", ctx.getRequest().getRequestURI());
        
        long startMillis = System.currentTimeMillis();
        SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
        String strStart = dayTime.format(new Date(startMillis));
        
        request.setAttribute("REQ_TIME", strStart);
        request.setAttribute("REQ_TIME_MILLIS", startMillis);
        
        HttpSession session = request.getSession(false);
        if (session != null) {
            // Session ID 설정
            ctx.addZuulRequestHeader("x-auth-token", session.getId());
            logger.info("Session ID: {}", session.getId());
        }
        
        // 1단계 : 로그인 호출 등 인증을 예외시켜야 할 path인지 확인한다.
        boolean byPass = bypassCheck( request.getRequestURL().toString() );
        
    	// 2단계 : Session 인증을 거쳐야하는 경우 체크 한다.
        if( byPass!=true && !"OPTIONS".equals(request.getMethod()) ) {

        	Map dspAuthSignature = null;
        	String authorization = request.getHeader("Authorization");
        	String userNo = "";
        	boolean isUsedSession = false;
        	
        	if( authorization!=null && !authorization.isEmpty() )
        	{	// Header에 Authorization key를 달고 온 경우 (token 인증)
        		
        		// 먼저 etm-auth-control한테 token이 맞는지 확인한다.
        		String accessKey = validateSignature(ctx, request);
        		
        		// Redis에 세션정보를 확인한다.
        		dspAuthSignature = authAccessKeyRedisTemplate.opsForHash().entries(RedisConfig.PREFIX_AUTH_ACCESS_KEY + accessKey);
        	
        		if( dspAuthSignature !=null && !dspAuthSignature.isEmpty() )
        			userNo = (String) dspAuthSignature.get("userNo");
        		
        	} else {	// 세션정보를 확인해야 한다.
        		
        		isUsedSession = true;
        		
        		if( session==null || session.getAttribute("userNo")==null ) {
        			throw new ApiException(HttpStatus.UNAUTHORIZED, "Not Exist session");
        		}
        		
        		if( request.getSession(false)!=null )
        			userNo = Long.toString((Long) request.getSession(false).getAttribute("userNo"));
        	}
        	
        	// Todo : 필요하면 사용자 권한체를 통해 특정 URL에 접근 불가능하도록 처리 가능함
            
            // Session에 Timezone, Language 설정
        	String etmDefaultTZ = getDefaultTZ(request);
            String langauge = getLangauge(request);
            logger.info("DefaultTZ: {}, language: {}", etmDefaultTZ, langauge);
            
            if(isUsedSession)
            {
	            if( session.getAttribute("langauge") == null || !langauge.equals(session.getAttribute("langauge")) )
	            	session.setAttribute("langauge", langauge);
	            if (session.getAttribute("etmDefaultTZ") == null || !etmDefaultTZ.equals(session.getAttribute("etmDefaultTZ"))) 
	            	session.setAttribute("etmDefaultTZ", etmDefaultTZ);
            }
            
            // Zuul Request Header에 설정
            ctx.addZuulRequestHeader("langauge", langauge);
            ctx.addZuulRequestHeader("etmDefaultTZ", etmDefaultTZ);
            ctx.addZuulRequestHeader("loginUserNo", userNo);
        }
        
        if( "/auth/log_out".equals(request.getRequestURI())) {	// log out 처리
        	if( request.getSession(false)!=null )
        	{
        		String userNo = Long.toString((Long) request.getSession(false).getAttribute("userNo"));
        		ctx.addZuulRequestHeader("loginUserNo", userNo);
        	}        	
        }
        
        String timeStamp = request.getHeader("x-access-date");
        if (StringUtils.trimToNull(timeStamp) != null) {
            ctx.addZuulRequestHeader("timeStamp", timeStamp);
        } else if (session != null) {
            timeStamp = (String) session.getAttribute("TIME_STAMP");
            ctx.addZuulRequestHeader("timeStamp", timeStamp);
        }
        
        return null;
    }
    
    private boolean bypassCheck(String url)	{
        String firstDepth = "";
        String secondDepth = "";
        String thirdDepth= "";
        
        if (url != null) {
            String[] arrUrl = url.split("/");
            
            if (arrUrl != null && arrUrl.length > 0) {
            	firstDepth = arrUrl[arrUrl.length - 1];		// url 마지막
//            	secondDepth = arrUrl[arrUrl.length - 2];	// url 마지막 -1
//            	thirdDepth = arrUrl[arrUrl.length - 3];		// url 마지막 -2
            }      
            
            if(firstDepth != null) {
            	switch(firstDepth) {
            	case "log_in" :
            	case "log_out" :
            		return true;
            	}            	
            }            	
        }
        
        return false;
	}
    
    private String validateSignature(RequestContext ctx, HttpServletRequest request) throws ApiException {
        // --- [ 2.2 Auth Service 검색 : eureka 통해서 ]
        List<ServiceInstance> instances = this.discoveryClient.getInstances("ETM-AUTH-CONTROL");
        if (instances == null || instances.isEmpty()) {
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Not Found AUTH server");
        }

        ServiceInstance securityService = instances.get(0);

        String url = securityService.getUri().toString().concat("/authkeys/valid");

        String authorization = request.getHeader("Authorization");
        String[] split = authorization.split(" ");
        String type = split[0];
        if(!"ETM-HMAC-SHA256".equals(type)) {
            throw new ApiException(HttpStatus.UNAUTHORIZED, "Unsupported Authorization Type");
        }
        
        String[] credentials = split[1].split(",");
        Map<String, String> credentialMap = new HashMap<String, String>();

        for (String credential : credentials) {
            String[] tmp = credential.split("=");
            credentialMap.put(tmp[0].toUpperCase(), tmp[1]);
        }

        String accessKey = credentialMap.get("CREDENTIAL");
        String signature = credentialMap.get("SIGNATURE");
        Long accessDate = Long.parseLong(request.getHeader("x-access-date"));

        String stringToSign = request.getMethod().toUpperCase() + "\n" // 대문자
                + "credential:" + accessKey + "\n" // 공백없이
                + request.getRequestURI(); //

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("accessDate", accessDate);
        params.put("accessKey", accessKey);
        params.put("stringToSign", stringToSign);
        params.put("signature", signature);

        try {
        	JSONObject resultValidDspSignature = new RestTemplate().postForObject(url, params, JSONObject.class);
            logger.debug("resultValidDspSignature :{}", resultValidDspSignature);

            if (resultValidDspSignature == null || !"success".equals(resultValidDspSignature.get("code"))) {
                throw new ApiException(HttpStatus.UNAUTHORIZED, "invalid DSP Signature");
            }

            return accessKey;

        } catch (RestClientException ex) {
            logger.error(ex.getMessage(), ex);

            String errStr = "";
            if (ex instanceof HttpClientErrorException) {
                HttpClientErrorException hex = (HttpClientErrorException) ex;
                errStr = hex.getResponseBodyAsString();
            } else {
                errStr = ex.getMessage();
            }
            throw new ApiException(HttpStatus.UNAUTHORIZED, errStr);
        }
    }
    
    private String getDefaultTZ(HttpServletRequest request) {

    	// Find Header
        String etmDefaultTZ = request.getHeader("etm-default-tz");

        if (!StringUtils.isEmpty(etmDefaultTZ)) {
            return etmDefaultTZ;
        }

        // Find Cookie
        if (WebUtils.getCookie(request, "etmDefaultTZ") != null) {
            try {
            	etmDefaultTZ = URLDecoder.decode(WebUtils.getCookie(request, "etmDefaultTZ").getValue(), "UTF-8");
            } catch (UnsupportedEncodingException e1) {
                logger.warn(e1.getMessage());
                etmDefaultTZ = URLDecoder.decode(WebUtils.getCookie(request, "etmDefaultTZ").getValue());
            }
        }

        if (!StringUtils.isEmpty(etmDefaultTZ)) {
            return etmDefaultTZ;
        }

        // Find Session
        if (StringUtils.trimToNull(etmDefaultTZ) == null && request.getSession(false) != null) {
        	etmDefaultTZ = (String) request.getSession(false).getAttribute("etmDefaultTZ");
        }

        return (StringUtils.trimToNull(etmDefaultTZ) == null) ? "Asia/Seoul" : etmDefaultTZ;
    }

    private String getLangauge(HttpServletRequest request) {

    	// Find Header
        String langauge = request.getHeader("etm-langauge");
        
        // Find Cookie
        if (StringUtils.trimToNull(langauge) == null) {
            langauge = (WebUtils.getCookie(request, "langauge") == null) ? "KO" : WebUtils.getCookie(request, "langauge").getValue();
        }
        
        return langauge;
    }
    
    
}
