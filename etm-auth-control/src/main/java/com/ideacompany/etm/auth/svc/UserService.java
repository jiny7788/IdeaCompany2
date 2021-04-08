package com.ideacompany.etm.auth.svc;

import java.util.HashMap;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.auth.ctl.UserController;
import com.ideacompany.etm.auth.dto.CommonResponse;
import com.ideacompany.etm.auth.dto.LoginDto;
import com.ideacompany.etm.auth.dto.LoginFormDto;
import com.ideacompany.etm.auth.map.UserMapper;

@Service
public class UserService {
	
	private static final Logger logger = LoggerFactory.getLogger(UserService.class);
	
	@Autowired
	private UserMapper userMapper;

	public CommonResponse loginUser(LoginFormDto dto, boolean isLoginToken) throws Exception {

        Map<String, Object> rtn = new HashMap<String, Object>();

        boolean isPasswordMatch = false;
        if (isLoginToken) {
            isPasswordMatch = true;
        } else {
            //isPasswordMatch = checkPasswordMatch(dto.getUserId(), dto.getPwd(), true);
        }
        
        logger.info(userMapper.getUser());

//        LoginDto succObj = loginUser(dto, isPasswordMatch);
        LoginDto succObj = new LoginDto(); 

//        int _value = adminYn(succObj.getUserNo());
        String admin_yn = "N";
//        if (_value > 0) {
//            admin_yn = "Y";
//        }

//        succObj.setDspDefaultTZ(dto.getDspDefaultTZ());
//        rtn.put("menu_info", selectMenuInfo(succObj.getUserNo()));
        rtn.put("member_info", succObj);
        rtn.put("admin_yn", admin_yn);
//        rtn.put("loginDt", selectLastLoginTime(succObj));
//        rtn.put("fncBtnInfo", selectUserFuncBtn(succObj.getUserNo()));

        CommonResponse commonResponse = new CommonResponse();
        commonResponse.setCode("success");
        commonResponse.setMessage("로그인 되었습니다.");
        commonResponse.setResponse(rtn);

        //  RefreshToken 저장

        return commonResponse;
    }
}
