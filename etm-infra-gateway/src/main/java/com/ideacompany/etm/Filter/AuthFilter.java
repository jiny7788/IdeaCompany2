package com.ideacompany.etm.Filter;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

public class AuthFilter extends ZuulFilter {
	
	private String APPLICATION_JSON = "application/json";

    private static final Logger logger = LoggerFactory.getLogger(AuthFilter.class);

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Override
    public int filterOrder() {
        return 6;
    }

    @Override
    public String filterType() {
        return "pre";
    }

    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();
        HttpServletRequest request = ctx.getRequest();

        String accessToken = request.getParameter("accessToken");
        String refreshToken = request.getParameter("refreshToken");

        logger.info("in zuul filter " + ctx.getRequest().getRequestURI());
        logger.info("**** [ Token Authorization ] ***********************");
        logger.info("---  accessToken : " + accessToken);
        logger.info("---  refreshToken : " + refreshToken);

        if (accessToken == null || accessToken.equals("") || accessToken.isEmpty()) {
            return sendUnauthorizedResponse(ctx, request, "Required AccessToken");
        }
        return null;
    }

    private Object sendUnauthorizedResponse(RequestContext ctx, HttpServletRequest request, String responseMessage) {
        ctx.setSendZuulResponse(false);
        ctx.setResponseStatusCode(HttpStatus.UNAUTHORIZED.value());

        String contentType = request.getContentType();
        if (contentType == null) {
            contentType = APPLICATION_JSON;
        }

        // To handle Json contentType
        if (contentType.equalsIgnoreCase(APPLICATION_JSON)) {
            ObjectMapper mapper = new ObjectMapper();
            try {
                String responseBody = "ERROR";
                ctx.setResponseBody(responseBody);
                ctx.getResponse().setContentType(APPLICATION_JSON);
            } catch (Exception e) {
                logger.error(e.getMessage(), e);
            }
        }

        /* // To handle XML contentType
        if (contentType.equalsIgnoreCase(MediaType.APPLICATION_XML)) {
            String responseBody = XmlUtil.marshal(validationResponse);
            ctx.setResponseBody(responseBody);
            ctx.getResponse().setContentType(MediaType.APPLICATION_XML);
        }*/

        return ctx;
    }
}
