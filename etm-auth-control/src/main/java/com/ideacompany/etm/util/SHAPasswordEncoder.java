package com.ideacompany.etm.util;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import org.springframework.security.crypto.codec.Hex;
import org.springframework.security.crypto.codec.Utf8;
import org.springframework.security.crypto.password.PasswordEncoder;

public class SHAPasswordEncoder implements PasswordEncoder {

	private Object  salt               = null;
    private boolean encodeHashAsBase64 = true;
    private String  algorithm          = "SHA-512";
    
	public Object getSalt() {
		return salt;
	}
	public void setSalt(Object salt) {
		this.salt = salt;
	}
	public boolean isEncodeHashAsBase64() {
		return encodeHashAsBase64;
	}
	public void setEncodeHashAsBase64(boolean encodeHashAsBase64) {
		this.encodeHashAsBase64 = encodeHashAsBase64;
	}
	public String getAlgorithm() {
		return algorithm;
	}
	public void setAlgorithm(String algorithm) {
		this.algorithm = algorithm;
	}
	
	@Override
	public String encode(CharSequence rawPassword) {
		return encodePassword(rawPassword.toString(), salt);
	}
	
	@Override
	public boolean matches(CharSequence rawPassword, String encodedPassword) {
		return isPasswordValid(encodedPassword, rawPassword.toString(), salt);
	}
	
	private boolean isPasswordValid(String encPass, String rawPass, Object salt) {
        String pass1 = "" + encPass;
        String pass2 = encodePassword(rawPass, salt);

        return equals(pass1, pass2);
    }
	
	private byte[] bytesUtf8(String s) {
        if (s == null) {
            return null;
        }
        return Utf8.encode(s);
    }

    private boolean equals(String expected, String actual) {
        byte[] expectedBytes = bytesUtf8(expected);
        byte[] actualBytes = bytesUtf8(actual);
        int expectedLength = expectedBytes == null ? -1 : expectedBytes.length;
        int actualLength = actualBytes == null ? -1 : actualBytes.length;

        int result = expectedLength == actualLength ? 0 : 1;
        for (int i = 0; i < actualLength; i++) {
            byte expectedByte = expectedLength <= 0 ? 0 : expectedBytes[i % expectedLength];
            byte actualByte = actualBytes[i % actualLength];
            result |= expectedByte ^ actualByte;
        }
        return result == 0;
    }
    
    private String encodePassword(String rawPass, Object salt) {
        try {
            String saltedPass = mergePasswordAndSalt(rawPass, salt, false);

            MessageDigest messageDigest = MessageDigest.getInstance(algorithm);

            byte[] digest = messageDigest.digest(Utf8.encode(saltedPass));

            digest = messageDigest.digest(digest);

            if (encodeHashAsBase64) {
                return Utf8.decode(java.util.Base64.getEncoder().encode(digest));
            } else {
                return new String(Hex.encode(digest));
            }
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalArgumentException("No such algorithm [" + algorithm + "]");
        }

    }
    
    private String mergePasswordAndSalt(String password, Object salt, boolean strict) {
        if (password == null) {
            password = "";
        }

        if (strict && (salt != null)) {
            if ((salt.toString().lastIndexOf("{") != -1) || (salt.toString().lastIndexOf("}") != -1)) {
                throw new IllegalArgumentException("Cannot use { or } in salt.toString()");
            }
        }

        if ((salt == null) || "".equals(salt)) {
            return password;
        } else {
            return password + "{" + salt.toString() + "}";
        }
    }
}
