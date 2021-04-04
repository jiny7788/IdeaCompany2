package com.ideacompany.etm.Filter;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.Charset;
import java.text.SimpleDateFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.Enumeration;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.client.discovery.DiscoveryClient;
import org.springframework.cloud.netflix.zuul.filters.support.FilterConstants;
import org.springframework.stereotype.Component;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.util.WebUtils;

import com.google.common.io.CharStreams;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import com.netflix.zuul.ZuulFilter;
import com.netflix.zuul.context.RequestContext;

@CrossOrigin
@Component
public class PostFilter extends ZuulFilter {

    private static Logger logger = LoggerFactory.getLogger(PostFilter.class);

    @Override
    public String filterType() {
        return FilterConstants.POST_TYPE;
    }

    @Override
    public int filterOrder() {
        return 1;
    }

    @Override
    public boolean shouldFilter() {
        return true;
    }

    @Value("${info.app.domain}")
    private String profileDomain;

    @Value("${spring.http.cookie.secure:true}")
    private boolean cookieSecure;

    @Autowired
    private DiscoveryClient discoveryClient;

    @SuppressWarnings({ "rawtypes", "unused" })
    @Override
    public Object run() {
        RequestContext ctx = RequestContext.getCurrentContext();

        HttpServletRequest request = ctx.getRequest();
        HttpServletResponse response = RequestContext.getCurrentContext().getResponse();
        String responseBody = ctx.getResponseBody();

        HttpServletResponse res = ctx.getResponse();

        Cookie[] cookies = (Cookie[]) request.getCookies();

        if (request.getRequestURI().contains("log_out") && ctx.getResponseStatusCode() == 200) {
            this.removeCookies(request, response);
        }

        if (request.getRequestURI().contains("Excel") && ctx.getResponseStatusCode() == 200) {

            try {
                Cookie expiration_timestamp_cookie = new Cookie("fileDownload", URLEncoder.encode("true", "UTF-8"));
                expiration_timestamp_cookie.setPath("/");
                expiration_timestamp_cookie.setDomain(profileDomain);
                response.addCookie(expiration_timestamp_cookie);
            } catch (UnsupportedEncodingException e) {
                logger.error(e.getMessage(), e);
            }
        }

        if (request.getRequestURI().contains("log_in") && ctx.getResponseStatusCode() == 200) {

            String timestamp = null;
            if (WebUtils.getSessionAttribute(request, "TIME_STAMP") != null) {
                timestamp = (String) WebUtils.getSessionAttribute(request, "TIME_STAMP");
            }

            InputStream stream = ctx.getResponseDataStream();
            try {
                String resBody = StreamUtils.copyToString(stream, Charset.forName("UTF-8"));

                if (resBody != null) {
                    JSONParser parser = new JSONParser();
                    Object obj = parser.parse(resBody);
                    JSONObject jsonObj = (JSONObject) obj;

                    String response_code = (String) jsonObj.get("code");
                    if ("success".equals(response_code)) {
                        this.createSessionAddCookie(request, response, timestamp, jsonObj);
                    }
                }

                ctx.setResponseDataStream(new ByteArrayInputStream(resBody.getBytes("UTF-8")));
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            } catch (ParseException e) {
                logger.error(e.getMessage(), e);
            }

            if (logger.isDebugEnabled()) {
                logger.debug("[Log In Process End]");
            }

        }
        if (logger.isDebugEnabled()) {
            Enumeration params = request.getParameterNames();
            long startMillis = (long) request.getAttribute("REQ_TIME_MILLIS");

            SimpleDateFormat dayTime = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

            long endMillis = System.currentTimeMillis();

            String strStart = (String) request.getAttribute("REQ_TIME");
            long term = (endMillis - startMillis) / 1000;
            String strEnd = dayTime.format(new Date(endMillis));

            logger.debug("▶ [ URL ] : {}", String.format("%s request to %s", request.getMethod(), request.getRequestURL().toString()));
            logger.debug("▶ [ Request Time ] : {}", strStart);
            logger.debug("▶ [ Response Time ] : {}", strEnd);
            logger.debug("▶ [ The time required ] : {} seconds", term);
        }

        logger.info("[PostFilter] in zuul PostFilter End **************************************************");

        return null;
    }
    
    private void removeCookies(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = (Cookie[]) request.getCookies();

        if (cookies != null) {
            for (Cookie cookie : cookies) {
                cookie.setDomain(profileDomain);
                cookie.setPath("/");
                cookie.setMaxAge(0);
                response.addCookie(cookie);
            }
        }
        try {
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }
    
    private Cookie createCookies(String _key, String _value) throws UnsupportedEncodingException {
        Cookie cookie = new Cookie(_key, URLEncoder.encode(_value, "UTF-8"));
        cookie.setMaxAge(60 * 60 * 24);     // 쿠키 유지 기간(1일)
        cookie.setPath("/");                // 모든 경로에서 접근 가능하도록
        cookie.setDomain(profileDomain);	// 이부분을 적용하면 서브 도메인간 공유 가능
        cookie.setHttpOnly(true);
        cookie.setSecure(cookieSecure);

        return cookie;
    }
    
    private String getTimestamp(String timestamp) {
        if (timestamp == null || timestamp.trim().isEmpty()) {
            timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + "00";
        }
        return timestamp;
    }
    
    private void createSessionAddCookie(HttpServletRequest request, HttpServletResponse response, String timestamp, JSONObject jsonObj) throws UnsupportedEncodingException {
        JSONObject response_jsonObj = (JSONObject) jsonObj.get("response");
        JSONObject member_info = (JSONObject) response_jsonObj.get("member_info");

        String accessToken = (String) member_info.get("accessToken");
        String refreshToken = (String) member_info.get("refreshToken");
        String userName = (String) member_info.get("userName");
        String userEmail = (String) member_info.get("userEmail");
        long userNo = (long) member_info.get("userNo");
        String userId = (String) member_info.get("userId");
        String userDstnctCode = (String) member_info.get("userDstnctCode");

        response.addCookie(this.createCookies("access_token", accessToken));
        response.addCookie(this.createCookies("refresh_token", refreshToken));
        response.addCookie(this.createCookies("user_id", userId));
        response.addCookie(this.createCookies("user_no", userNo + ""));
        response.addCookie(this.createCookies("user_email", userEmail));
        response.addCookie(this.createCookies("user_name", userName));
        response.addCookie(this.createCookies("user_dstnct_code", userDstnctCode));

        Cookie expiration_timestamp_cookie = new Cookie("expiration_timestamp", URLEncoder.encode("exist", "UTF-8"));
        expiration_timestamp_cookie.setPath("/");
        expiration_timestamp_cookie.setDomain(profileDomain);
        response.addCookie(expiration_timestamp_cookie);

        // session 생성
        WebUtils.setSessionAttribute(request, "loginResponseData", response_jsonObj);
        WebUtils.setSessionAttribute(request, "userNo", userNo);
        WebUtils.setSessionAttribute(request, "loginUserNo", userNo);
        WebUtils.setSessionAttribute(request, "TIME_STAMP", getTimestamp(timestamp));
        if (request.getContentLength() > 0) {
            String etmDefaultTZ = null;
            try {
                String requestData = CharStreams.toString(request.getReader());
                JsonObject jsonObject = new JsonParser().parse(requestData).getAsJsonObject();
                if (jsonObject != null && jsonObject.get("etmDefaultTZ") != null) {
                	etmDefaultTZ = jsonObject.get("etmDefaultTZ").getAsString();
                }
            } catch (IOException e) {
                logger.error(e.getMessage(), e);
            }
            WebUtils.setSessionAttribute(request, "etmDefaultTZ", etmDefaultTZ);
        }
    }
}
