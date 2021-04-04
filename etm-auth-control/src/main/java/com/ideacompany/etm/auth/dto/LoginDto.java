package com.ideacompany.etm.auth.dto;

import com.fasterxml.jackson.annotation.JsonIgnore;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@ApiModel(description = "로그인 DTO")
@Data
public class LoginDto {
	@ApiModelProperty(value = "사용자 serial no")
    private long    userNo;

    @ApiModelProperty(value = "로그인ID")
    private String  userId;

    @ApiModelProperty(value = "사용자 email")
    private String  userEmail;

    @ApiModelProperty(value = "사용자성명")
    private String  userName;

    @ApiModelProperty(value = "비밀번호 - json에서는 제외됨")
    @JsonIgnore
    private String  pwd;

    @ApiModelProperty(value = "비밀번호 오류 횟수")
    private int     pwdErrCnt;

    @ApiModelProperty(value = "Access Token")
    private String  accessToken;

    @ApiModelProperty(value = "Reflesh Token")
    private String  refreshToken;

    @ApiModelProperty(value = "사용자 상태 구분 코드")
    private String  userStatusCode;

    @ApiModelProperty(value = "사용자 구분 코드")
    private String  userDstnctCode;

    @ApiModelProperty(value = "사용여부")
    private String  useYn;

    @ApiModelProperty(value = "부서")
    private String  deptName;

    @ApiModelProperty(value = "직위")
    private String  positName;

    @ApiModelProperty(value = "직책")
    private String  dutiName;

    @ApiModelProperty(value = "잠김 여부")
    private String  lockYn;

    @ApiModelProperty(value = "잠김 사유")
    private String  lockText;
    
    @ApiModelProperty(value = "비밀번호 수정날짜")
    private String  pwdModDate;

    @ApiModelProperty(value = "서비스 만료 여부")
    private boolean serviceExpireYn;
    
    @ApiModelProperty(value ="사용자 권한 프로파일 ")
    private String userProfileName;
}
