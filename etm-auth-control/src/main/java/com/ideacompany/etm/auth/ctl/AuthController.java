package com.ideacompany.etm.auth.ctl;

import javax.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;

import com.ideacompany.etm.auth.dto.AuthkeyDto;
import com.ideacompany.etm.auth.dto.CommonResponse;
import com.ideacompany.etm.auth.exception.AuthException;
import com.ideacompany.etm.auth.svc.AuthService;

import io.swagger.annotations.ApiOperation;

@CrossOrigin()
@RequestMapping("/authkeys")
@RestController
public class AuthController {
	
	private static final Logger logger = LoggerFactory.getLogger(AuthController.class);
	
	@Autowired
    private AuthService authService;
	
	@ApiOperation("Validate Signature")
	@PostMapping(value = "/valid", produces = MediaType.APPLICATION_JSON_UTF8_VALUE, consumes = MediaType.APPLICATION_JSON_UTF8_VALUE)
	public @ResponseBody CommonResponse validDspSignature(@Valid @RequestBody AuthkeyDto dto) throws AuthException {
		
		CommonResponse result = new CommonResponse();
		result.setCode("success");
		result.setMessage("Authentication success");
		result.setResponse(authService.validAuthkey(dto));
		result.setResponseTime(Long.toString(System.currentTimeMillis()));
		
//		logger.info(result.getResponse().toString());

        return result;
		
	}

}
