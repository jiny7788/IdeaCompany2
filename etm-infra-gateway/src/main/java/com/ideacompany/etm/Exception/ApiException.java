package com.ideacompany.etm.Exception;

import org.springframework.http.HttpStatus;

public class ApiException extends RuntimeException {

	private static final long serialVersionUID = -6646640773535822355L;
	
	private HttpStatus httpStatus;
	
	public ApiException(HttpStatus status, String message) {
        super(message);
        setResultStatus(status);
    }

	public HttpStatus getResultStatus() {
        return httpStatus;
    }	
    
    public void setResultStatus(HttpStatus httpStatus) {
        this.httpStatus = httpStatus;
    }
}
