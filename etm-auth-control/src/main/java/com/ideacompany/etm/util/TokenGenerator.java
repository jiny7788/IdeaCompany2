package com.ideacompany.etm.util;

import java.io.UnsupportedEncodingException;
import java.security.GeneralSecurityException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class TokenGenerator {
	
	private static final Logger logger = LoggerFactory.getLogger(TokenGenerator.class);
	private String token = null;
	
	public TokenGenerator() {
	}

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}

	public void createAccessToken(long user_no, String encryptionKey) throws UnsupportedEncodingException {
		this.token = setHeader(user_no, encryptionKey) + "." + setPayload(user_no, 30, encryptionKey) + "." + setSignature(user_no);
	}

	public void createRefreshToken(long user_no, String encryptionKey) throws UnsupportedEncodingException {
		this.token = setHeader(user_no, encryptionKey) + "." + setPayload(user_no, 60*24, encryptionKey) + "." + setSignature(user_no);
	}

	private String setHeader(long user_no, String encryptionKey) throws UnsupportedEncodingException {

        logger.debug("setHeader start");
        AES256Util encoder = new AES256Util(encryptionKey);
        logger.debug("setHeader end");
        String rtnValue = "";
        try {
            rtnValue = encoder.encrypt("{\"alg\":\"AES256\", \"typ\":\"JWT\"}");
        } catch (GeneralSecurityException e) {
            logger.error(e.getMessage(), e);
        }

        return rtnValue;
    }
	
	private String setSignature(long user_no) {
		SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder();
        return shaPasswordEncoder.encode(Long.toString(user_no));
	}
	
	private String setPayload(long user_no, int setExpireDate, String encryptionKey) throws UnsupportedEncodingException {

        Calendar today = Calendar.getInstance();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
        today.setTime(new Date());

        today.add(Calendar.MINUTE, setExpireDate);

        String payLoad = "{\"iss\":\"ideacompany.com\",\"exp\":\"" + sdf.format(new Date(today.getTimeInMillis())) + "\",\"user_no\":\""
                + Long.toString(user_no) + "\"}";

        AES256Util encoder = new AES256Util(encryptionKey);
        String rtnValue = "";

        try {
            rtnValue = encoder.encrypt(payLoad);
        } catch (GeneralSecurityException e) {
            logger.error(e.getMessage(), e);
        }
        return rtnValue;
    }
}
