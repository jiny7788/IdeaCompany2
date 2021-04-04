package com.ideacompany.etm.auth.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class LoginFormDto {

	@ApiModelProperty(value = "로그인ID", required = true)
    @NotEmpty
    @Email
    private String userId;

    @ApiModelProperty(value = "비밀번호", required = true)
    @NotEmpty
    private String pwd;

    @ApiModelProperty(value = "시간대")
    private String dspDefaultTZ = "Asia/Seoul";
    
}
