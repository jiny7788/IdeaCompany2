package com.ideacompany.etm.auth.ctl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ideacompany.etm.auth.dto.CommonResponse;
import com.ideacompany.etm.auth.dto.LoginFormDto;
import com.ideacompany.etm.auth.svc.UserService;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@CrossOrigin(allowCredentials = "true")
@Api(tags = "Authentication API")
@RestController
public class UserController {

	private static final Logger logger = LoggerFactory.getLogger(UserController.class);
	
	@Autowired
	UserService userService;
	
	@ApiOperation("사용자 LOGIN(토큰발급)")
    @PostMapping("/log_in")
    public @ResponseBody CommonResponse loginUsr(@RequestBody LoginFormDto dto) { // throws DspCheckedException {
        return userService.loginUsr(dto, false);
    }

}
