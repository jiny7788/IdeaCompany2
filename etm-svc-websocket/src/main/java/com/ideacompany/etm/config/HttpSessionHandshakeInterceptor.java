package com.ideacompany.etm.config;

import java.util.Map;

import javax.servlet.http.HttpSession;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.http.server.ServletServerHttpRequest;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

public class HttpSessionHandshakeInterceptor implements HandshakeInterceptor {

	private static final Logger logger = LoggerFactory.getLogger(HttpSessionHandshakeInterceptor.class);
	
	private static final String SESSION_ATTR = "httpSession.id";

    private String              API_KEY;
    
    public HttpSessionHandshakeInterceptor(String apiKey) {    	
    	this.API_KEY = apiKey;
    }
    
	@Override
	public boolean beforeHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Map<String, Object> attributes) throws Exception {
        if (request instanceof ServletServerHttpRequest) {
            ServletServerHttpRequest servletRequest = (ServletServerHttpRequest) request;
            HttpSession session = servletRequest.getServletRequest().getSession(false);
            HttpHeaders httpHeaders = servletRequest.getHeaders();

            if (logger.isDebugEnabled()) {
                logger.debug("x-api-key : {}", httpHeaders.get("x-api-key"));
                if (session != null) {
                    logger.debug("session.getId() : {}", session.getId());
                    logger.debug("session.getAttribute(\"userNo\") : {}", session.getAttribute("userNo"));
                } else {
                    logger.debug("session : {}", session);
                }
            }

            if (session != null && !org.springframework.util.StringUtils.isEmpty(session.getAttribute("userNo"))) {
                attributes.put(SESSION_ATTR, session.getId());
                return true;
            } else if (httpHeaders.get("x-api-key") != null && !httpHeaders.get("x-api-key").isEmpty() && API_KEY.equals(httpHeaders.get("x-api-key").get(0))) {
                return true;
            }
        }
        return false;
	}

	@Override
	public void afterHandshake(ServerHttpRequest request, ServerHttpResponse response, WebSocketHandler wsHandler, Exception exception) {
		// TODO Auto-generated method stub
	}

}
