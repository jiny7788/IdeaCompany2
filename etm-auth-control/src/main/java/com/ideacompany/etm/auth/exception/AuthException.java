package com.ideacompany.etm.auth.exception;

public class AuthException extends Exception {

	private static final long serialVersionUID = 8005838925560499239L;
	
    private String            code;
    private String            message;
    private String            status;
    
	public AuthException() {
    }

    public AuthException(String code) {
    	super(code);
        this.code = code;
    }

    public AuthException(String code, String message) {
    	super(code);
    	this.code = code;
        this.message = message;
    }

    public AuthException(String code, String message, String status) {
    	super(code);
    	this.code = code;
        this.message = message;
        this.status = status;
    }
    
    public AuthException(String message, Throwable cause) {
    	super(message, cause);
    }

    public AuthException(Throwable cause) {
    	super(cause);
    }

    public AuthException(String message, Throwable cause, boolean enableSuppression, boolean writableStackTrace) {
    	super(message, cause, enableSuppression, writableStackTrace);
    }

    public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
}
