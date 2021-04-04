package com.ideacompany.etm.auth.svc;

import java.util.Map;

import org.apache.commons.codec.digest.HmacAlgorithms;
import org.apache.commons.codec.digest.HmacUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.auth.dto.AuthReturnCode;
import com.ideacompany.etm.auth.dto.AuthkeyDto;
import com.ideacompany.etm.auth.exception.AuthException;
import com.ideacompany.etm.config.RedisConfig;

@Service
public class AuthService {
	
	private static final Logger          logger = LoggerFactory.getLogger(AuthService.class);
	
	@Autowired
	Environment env;

	@Autowired
	public RedisTemplate<String, String> authAccessKeyRedisTemplate;
	
	public boolean validAuthkey(AuthkeyDto dto) throws AuthException {
		@SuppressWarnings("rawtypes")
		
		// Redis에서 accessKey를 가져온다.
		Map accessKeyData = authAccessKeyRedisTemplate.opsForHash().entries(RedisConfig.PREFIX_AUTH_ACCESS_KEY + dto.getAccessKey());
		if( accessKeyData==null || accessKeyData.isEmpty() || accessKeyData.get("secretkey")==null || ((String)accessKeyData.get("secretkey")).isEmpty() ) {
			logger.warn("Not found accessKey or Empty secrect : {}", accessKeyData);
			throw new AuthException(AuthReturnCode.ERR_NOT_FOUND.code(), AuthReturnCode.ERR_NOT_FOUND.msg());
		}
		
		// Redis에 Hash값 저장 sample code
		// HashOperations<String, Object, Object> hashOp = authAccessKeyRedisTemplate.opsForHash();
		// hashOp.put(RedisConfig.PREFIX_AUTH_ACCESS_KEY+"5367035EE5F04593", "secretkey", "c4163c040af84f46828322564704204e");
		
        String secret = (String) accessKeyData.get("secretkey");
        String accessDate = Long.toString(dto.getAccessDate());
        String signingKey = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, secret).hmacHex(accessDate);
        String checkSignature = new HmacUtils(HmacAlgorithms.HMAC_SHA_256, signingKey).hmacHex(dto.getStringToSign());
//        if (logger.isDebugEnabled()) 
        {
            logger.debug("dto.getSignature() : {}", dto.getSignature());
            logger.debug("checkSignature     : {}", checkSignature);
        }

        long validInterval = Long.parseLong( env.getProperty("etm.accesskey.valid-interval") );
        
        // 유효시간 확인 (0 미만이면 설정이 비적용됨)
        if ( validInterval > 0 && Math.abs(System.currentTimeMillis() - dto.getAccessDate()) > validInterval ) {
            throw new AuthException(AuthReturnCode.ERR_INVALID_ACCESSDATE.code(), AuthReturnCode.ERR_INVALID_ACCESSDATE.msg() +" : " + (System.currentTimeMillis() - dto.getAccessDate()) + " ms");
        }

        boolean isValidDspSingatrue = dto.getSignature().equals(checkSignature);
        if (!isValidDspSingatrue) {
            throw new AuthException(AuthReturnCode.ERR_INVALID_SIGNATURE.code(), AuthReturnCode.ERR_INVALID_SIGNATURE.msg());
        }
        
        // 마지막 사용일 Update
        // dspAccesskeyMapper.updateDspAccesskeyLastActiveDate(dto.getAccesskey());
        return isValidDspSingatrue;
	}
}
