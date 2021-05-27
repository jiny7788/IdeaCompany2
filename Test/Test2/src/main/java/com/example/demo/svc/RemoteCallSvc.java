package com.example.demo.svc;

import java.io.UnsupportedEncodingException;
import java.net.URL;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestTemplate;

import com.example.demo.dto.AlarmDetail;
import com.example.demo.dto.AlarmSearchVO;

@Service
public class RemoteCallSvc {
	private static final Logger logger = LoggerFactory.getLogger(RemoteCallSvc.class);

	@Autowired
	RestTemplate restTemplate;
	
    private final String UTF8_CHARSET          = "UTF-8";
    private final String HMAC_SHA256_ALGORITHM = "HmacSHA256";

    public String getDspHmacSha256(String accessKey, String secretKey, String method, String uri, String xDspDate) throws InvalidKeyException, UnsupportedEncodingException, NoSuchAlgorithmException {
        String stringToSign = method.toUpperCase() + "\n" // 대문자(공백없이)
                + "credential:" + accessKey + "\n" // accessKey (공백없이)
                + uri; // URI (공백없이)

        System.out.println(stringToSign);
        
        return "ETM-HMAC-SHA256 Credential=" + accessKey + ",Signature=" + getHmac(getHmac(secretKey, xDspDate), stringToSign);
    }

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
    
    public AlarmDetail sendTest(AlarmSearchVO vo) {
    	try {
            // HMAC
            //URL url = new URL("http://localhost:8080/etm-svc-control/test/getAlarmDetail");
    		URL url = new URL("http://localhost:8090/test/getAlarmDetail");
            String path = url.getPath();
            String xDspDate = Long.toString(System.currentTimeMillis());
            String dspHmacSha256 = getDspHmacSha256("5367035EE5F04593", "c4163c040af84f46828322564704204e", "POST", path, xDspDate);

            // headers
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON_UTF8);
            headers.set("Authorization", dspHmacSha256);
            headers.set("x-access-date", xDspDate);

            // request
//            HttpEntity<?> requestEntity = new HttpEntity<>(vo, headers);
            
            //JSONObject param = new JSONObject();
            //param.put("alarmSeq", "12222");
            //logger.info("Param JSON:{}", param.toString());
            
            //HttpEntity<?> requestEntity = new HttpEntity<>(vo, headers);   
            
            //ResponseEntity<AlarmDetail> resultEntity = restTemplate.exchange(url.toString(), HttpMethod.POST, requestEntity, AlarmDetail.class);
            //logger.info("http response: [{}/{}]", resultEntity.getStatusCode(), resultEntity.getBody());
            //AlarmDetail result = resultEntity.getBody();

            //AlarmDetail result = restTemplate.postForObject(url.toString(), requestEntity, AlarmDetail.class);
            
//            logger.info("request: [{}]", requestEntity);
//            AlarmDetail result = restTemplate.postForObject(url.toString(), requestEntity, AlarmDetail.class);
//            logger.info("http response: [{}]", result.toString());

//            MultiValueMap<String, String> param = new LinkedMultiValueMap<String, String>();
//            param.add("alarmSeq", "12222");            
//            ResponseEntity resultEntity = restTemplate.postForEntity(url.toString(), param, AlarmDetail.class);
          
            
//            HttpEntity<?> requestEntity = new HttpEntity<>(param, headers);
//            ResponseEntity resultEntity = restTemplate.postForEntity(url.toString(), requestEntity, AlarmDetail.class);
//            ResponseEntity resultEntity = restTemplate.exchange(url.toString(), HttpMethod.POST, requestEntity, AlarmDetail.class);
            
            HttpEntity<?> requestEntity = new HttpEntity<>(vo, headers);
            ResponseEntity<AlarmDetail> resultEntity = restTemplate.exchange(url.toString(), HttpMethod.POST, requestEntity, AlarmDetail.class);          
            
            // return HttpStatus.OK.equals(resultEntity.getStatusCode());
            return (AlarmDetail) resultEntity.getBody();
            
        } catch (Exception e) {
        	logger.error(e.getMessage(), e);
            return null;
        }
    }
}
