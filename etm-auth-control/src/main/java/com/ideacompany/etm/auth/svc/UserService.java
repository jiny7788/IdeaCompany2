package com.ideacompany.etm.auth.svc;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.util.HashMap;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;

import com.ideacompany.etm.auth.ctl.UserController;
import com.ideacompany.etm.auth.dto.CommonResponse;
import com.ideacompany.etm.auth.dto.LoginDto;
import com.ideacompany.etm.auth.dto.LoginFormDto;
import com.ideacompany.etm.auth.dto.SaveRefreshTokenDto;
import com.ideacompany.etm.auth.exception.AuthException;
import com.ideacompany.etm.auth.map.UserMapper;
import com.ideacompany.etm.util.SHAPasswordEncoder;
import com.ideacompany.etm.util.TokenGenerator;

@Service
public class UserService {
	
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	
	@Value("#{'${etm.encryption.key}'.split(',')}")
    private String[]	encryptionKey;

	
	@Autowired
	private UserMapper userMapper;

	public CommonResponse loginUser(LoginFormDto dto, boolean isLoginToken) throws AuthException {

        LoginDto loginDto = userMapper.loginUser(dto);
        boolean bPasswordCheck = false;
        
        if (loginDto != null) {	// 사용자를 찾았으니 패스워드 검증 수행
            // 비밀번호 오류 exception 처리
            SHAPasswordEncoder shaPasswordEncoder = new SHAPasswordEncoder();
            String formPwd1 = dto.getPwd();
            String formPwd2 = dto.getPwd();

            try {
                formPwd1 = shaPasswordEncoder.encode(formPwd1);
                formPwd2 = shaPasswordEncoder.encode(formPwd1.concat(Long.toString(loginDto.getUserNo()))); // 패스워드 암호화 (userNo salt)

            } catch (Exception e) {
                logger.warn("Password decryption Fail {}", e.getMessage());
            }
            logger.info("formDto.getPwd   : {}", dto.getPwd());
            logger.info("formPwd1         : {}", formPwd1);
            logger.info("formPwd2         : {}", formPwd2);
            logger.info("loginDto.getPwd  : {}", loginDto.getPwd());
            logger.info("passwordEncoding.matches(formDto.getPwd(), loginDto.getPwd())  : {}", shaPasswordEncoder.matches(dto.getPwd(), loginDto.getPwd()));
            logger.info("loginDto.getPwd().equals(formPwd1)                             : {}", loginDto.getPwd().equals(formPwd1));
            logger.info("loginDto.getPwd().equals(formPwd2)                             : {}", loginDto.getPwd().equals(formPwd2));

            if (!shaPasswordEncoder.matches(dto.getPwd(), loginDto.getPwd()) && !loginDto.getPwd().equals(formPwd1) && !loginDto.getPwd().equals(formPwd2)) {
            	bPasswordCheck = false;
                // TODO : 비밀번호 오류 횟수 체크 및 계정 잠금 처리 필요 
            	
            	throw new AuthException("ERR_AUTH_0005", "아이디 혹은 비밀번호가 일치하지 않습니다. 다시 입력하세요");
            }
            else {
            	bPasswordCheck = true;
            }
        }
        else {	// 사용자를 못 찾았다.
        	throw new AuthException("ERR_AUTH_0005", "아이디 혹은 비밀번호가 일치하지 않습니다. 다시 입력하세요");
        }
        
        if(!"02".equals(loginDto.getUserStatusCode()))
        	throw new AuthException("ERR_AUTH_0010", "Login Not available.. Please contact the administrator.");
        if("Y".equals(loginDto.getLockYn())) 
        	throw new AuthException("ERR_AUTH_0009", loginDto.getLockText() + " Please contact the administrator.");
        
        // TODO : 비밀번호 오류 횟수 초기화

        TokenGenerator generator = new TokenGenerator();
        try {
            generator.createAccessToken(loginDto.getUserNo(), this.getEncryptionKey(loginDto.getUserNo()));
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage(), e);
            throw new AuthException("ERR_AUTH_0005", "로그인 인증 실패");
        }

        loginDto.setAccessToken(generator.getToken());
        try {
            generator.createRefreshToken(loginDto.getUserNo(), this.getEncryptionKey(loginDto.getUserNo()));
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage(), e);
            throw new AuthException("ERR_AUTH_0005", "로그인 인증 실패");
        }

        loginDto.setRefreshToken(generator.getToken());
        
        // TODO : 로그인 기록을 남긴다.
        
        // refresh token을 기록한다.
        this.saveRefreshToken(loginDto);        
        
        Map<String, Object> rtn = new HashMap<String, Object>();
        rtn.put("member_info", loginDto);
        
        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setCode("success");
        commonResponse.setMessage("로그인 되었습니다.");
        commonResponse.setResponse(rtn);

        return commonResponse;
    }
	
	private String getEncryptionKey(long user_no) {
        return this.encryptionKey[(int) (user_no % 50)];
    }
	
	private void saveRefreshToken(LoginDto dto) {
		try {
			userMapper.saveRefreshToken(SaveRefreshTokenDto.builder().userNo(dto.getUserNo()).lockText(URLDecoder.decode(dto.getRefreshToken(), "UTF-8").replaceAll(" ", "+")).build());
        } catch (UnsupportedEncodingException e) {
            logger.error(e.getMessage(), e);
        }
	}
}
