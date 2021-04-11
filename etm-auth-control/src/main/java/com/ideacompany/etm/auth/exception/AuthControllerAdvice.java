package com.ideacompany.etm.auth.exception;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ideacompany.etm.auth.dto.CommonResponse;

@ControllerAdvice
@RequestMapping(produces = "application/vnd.error+json")
public class AuthControllerAdvice {

	private static final Logger logger = LoggerFactory.getLogger(AuthControllerAdvice.class);
	
    @ExceptionHandler(AuthException.class)
    public ResponseEntity<CommonResponse> dspCheckedException(AuthException e) {

        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setCode(e.getCode());
        commonResponse.setMessage(e.getMessage());
        commonResponse.setResponseTime(new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date()));

        return new ResponseEntity<>(commonResponse, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<CommonResponse> runtimeException(RuntimeException e) {

        return error(e, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    private <E extends Exception> ResponseEntity<CommonResponse> error(final E exception, final HttpStatus httpStatus) {
        logger.error(exception.getMessage(), exception);
        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setCode(httpStatus.toString());
        commonResponse.setMessage("error occurred");
        commonResponse.setResponseTime(new SimpleDateFormat("yyyy-MM-ddHH:mm:ss").format(new Date()));
        return new ResponseEntity<>(commonResponse, httpStatus);
    }
}
