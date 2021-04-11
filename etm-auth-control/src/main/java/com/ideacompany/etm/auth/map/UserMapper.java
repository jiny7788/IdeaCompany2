package com.ideacompany.etm.auth.map;

import com.ideacompany.etm.auth.dto.LoginDto;
import com.ideacompany.etm.auth.dto.LoginFormDto;
import com.ideacompany.etm.auth.dto.SaveRefreshTokenDto;
import com.ideacompany.etm.auth.exception.AuthException;

public interface UserMapper {

	public LoginDto loginUser(LoginFormDto dto) throws AuthException;
	public void saveRefreshToken(SaveRefreshTokenDto dto);

}
