package com.ideacompany.test;

import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.apache.http.HttpRequest;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.ResponseHandler;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.BasicResponseHandler;
import org.apache.http.impl.client.HttpClientBuilder;
import org.json.simple.JSONObject;

import com.fasterxml.jackson.databind.ObjectMapper;

public class Test1 {
	public static void main(String args[]) {
		
//		long generatedLong = new Random().nextLong();
//		System.out.println(generatedLong);
		
		Auth auth = new Auth();
		
        String path = args[0];
        String accessKey = args[1];
        String secrectKey = args[2];
        
        String xDspDate = Long.toString(System.currentTimeMillis());
        System.out.println(xDspDate);
        
        try {
        	String dspHmacSha256 = auth.getDspHmacSha256(accessKey, secrectKey, "POST", path, xDspDate);
        	System.out.println(dspHmacSha256);
        	
        	auth.validateSignature(dspHmacSha256, Long.parseLong( xDspDate ), "POST", path);
        	
        } catch (Exception e) {
        	System.out.println(e.getMessage());
        }
		
		
	}
}

class Auth {

	public String getDspHmacSha256(String accessKey, String secretKey, String method, String uri, String xDspDate) throws InvalidKeyException, UnsupportedEncodingException, NoSuchAlgorithmException {
        String stringToSign = method.toUpperCase() + "\n" // 대문자(공백없이)
                + "credential:" + accessKey + "\n" // accessKey (공백없이)
                + uri; // URI (공백없이)

        System.out.println(stringToSign);
        
        return "ETM-HMAC-SHA256 Credential=" + accessKey + ",Signature=" + getHmac(getHmac(secretKey, xDspDate), stringToSign);
    }

    private final String UTF8_CHARSET          = "UTF-8";

    private final String HMAC_SHA256_ALGORITHM = "HmacSHA256";

    private String getHmac(String signingKey, String stringToSign) throws UnsupportedEncodingException, NoSuchAlgorithmException, InvalidKeyException {
        byte[] signingKeyBytes = signingKey.getBytes(UTF8_CHARSET);
        SecretKeySpec signingKeySpec = new SecretKeySpec(signingKeyBytes, HMAC_SHA256_ALGORITHM);
        Mac mac = Mac.getInstance(HMAC_SHA256_ALGORITHM);
        mac.init(signingKeySpec);

        String signature = null;
        byte[] data = stringToSign.getBytes(UTF8_CHARSET);
        byte[] rawHmac = mac.doFinal(data);
        signature = encodeHex(rawHmac, DIGITS_LOWER);

        return signature;
    }

    private final char[] DIGITS_LOWER = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' };

    private String encodeHex(final byte[] data, final char[] toDigits) {
        final int l = data.length;
        final char[] out = new char[l << 1];
        // two characters form the hex value.
        for (int i = 0, j = 0; i < l; i++) {
            out[j++] = toDigits[(0xF0 & data[i]) >>> 4];
            out[j++] = toDigits[0x0F & data[i]];
        }
        return new String(out);
    }
    
    public String validateSignature(String authorization, long accessDate, String method, String uri) throws Exception {

        String url = "http://desktop-cuhi6n7:8091/authkeys/valid";

        String[] split = authorization.split(" ");
        String type = split[0];
        if(!"ETM-HMAC-SHA256".equals(type)) {
            throw new Exception("Unsupported Authorization Type");
        }
        
        String[] credentials = split[1].split(",");
        Map<String, String> credentialMap = new HashMap<String, String>();

        for (String credential : credentials) {
            String[] tmp = credential.split("=");
            credentialMap.put(tmp[0].toUpperCase(), tmp[1]);
        }

        String accesskey = credentialMap.get("CREDENTIAL");
        String signature = credentialMap.get("SIGNATURE");

        String stringToSign = method.toUpperCase() + "\n"
                + "credential:" + accesskey + "\n"
                + uri;

        Map<String, Object> params = new HashMap<String, Object>();
        params.put("accessDate", accessDate);
        params.put("accessKey", accesskey);
        params.put("stringToSign", stringToSign);
        params.put("signature", signature);
        
        try {
	        HttpClient client = HttpClientBuilder.create().build();
	        HttpPost postRequest = new HttpPost(url);
	        postRequest.setHeader("Accept", "application/json");
	        postRequest.setHeader("Connection", "keep-alive");
	        postRequest.setHeader("Content-Type", "application/json");
	        
//	        AuthkeyDto authKey = new AuthkeyDto();
//	        authKey.setAccessDate(accessDate);
//	        authKey.setAccessKey(accesskey);
//	        authKey.setSignature(signature);
//	        authKey.setStringToSign(stringToSign);
	        
	        ObjectMapper objMapper = new ObjectMapper();
	        String jsonValue = objMapper.writeValueAsString(params);
//	        String jsonValue = objMapper.writeValueAsString(authKey);
	        
	        System.out.println(jsonValue);
	        
	        postRequest.setEntity(new StringEntity(jsonValue, "utf-8"));
	        
	        HttpResponse response = client.execute(postRequest);
	        
	        if (response.getStatusLine().getStatusCode() == 200) {
				ResponseHandler<String> handler = new BasicResponseHandler();
				String body = handler.handleResponse(response);
				System.out.println(body);
				return body;
			} else {
				System.out.println("response is error : " + response.getStatusLine().getStatusCode());
			}
        } catch (Exception e) {
        	System.err.println(e.toString());
        	return "";
        }
        
        return "";
    }	
}