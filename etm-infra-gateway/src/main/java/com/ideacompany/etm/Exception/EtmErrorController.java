package com.ideacompany.etm.Exception;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.servlet.error.ErrorController;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import com.netflix.zuul.context.RequestContext;

import springfox.documentation.annotations.ApiIgnore;

import com.ideacompany.etm.dto.ApiResult;

@ApiIgnore
@Controller
public class EtmErrorController implements ErrorController {

	private static Logger logger = LoggerFactory.getLogger(EtmErrorController.class);
	
	@Value("${error.path:/error}")
	private String errorPath;
	
	@Value("${info.app.domain}")
    private String profileDomain;
	
	@Override
	public String getErrorPath() {
		return errorPath;
	}

	@CrossOrigin(allowCredentials = "true", allowedHeaders = "*", origins = "*")
    @RequestMapping(value = "${error.path:/error}")
    public @ResponseBody ResponseEntity<ApiResult<String>> error(HttpServletRequest request, HttpServletResponse response) {
        Integer status = (Integer) request.getAttribute("javax.servlet.error.status_code");
        String message = null;

        Throwable throwable = (Throwable) request.getAttribute("javax.servlet.error.exception");
        if (throwable != null) {
            Throwable causeThrowable = throwable.getCause();
            message = causeThrowable.getMessage();
            // 유효하지 않은 인증은 경우 cookie를 삭제한다.
            if (causeThrowable instanceof ApiException && status == HttpStatus.UNAUTHORIZED.value() ) {
                status = HttpStatus.UNAUTHORIZED.value();
                removeAllCookie(request);
            }
        } else if (status == HttpStatus.NOT_FOUND.value()) {
            message = "Not found resource";
        } else if (status == HttpStatus.INTERNAL_SERVER_ERROR.value()) {
            message = HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase();
        }

        if (status == null || status == 0) {
            status = HttpStatus.INTERNAL_SERVER_ERROR.value();
            message = HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase();
        }

        if (message==null || message.isEmpty()) {
            message = "Unknown error";
        }

        ApiResult<String> result = new ApiResult<String>();
        result.setMessage(message);
        result.setSuccess(false);
        return ResponseEntity.status(status).body(result);
    }

    private void removeAllCookie(HttpServletRequest request) {
        HttpServletResponse response = RequestContext.getCurrentContext().getResponse();
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
            if (request.getSession() != null) {
                request.getSession().invalidate();
            }
        } catch (Exception e) {
            logger.error(e.getMessage(), e);
        }
    }
}
