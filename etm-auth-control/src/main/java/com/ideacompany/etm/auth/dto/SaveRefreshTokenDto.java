package com.ideacompany.etm.auth.dto;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Builder;
import lombok.Getter;

@Builder
@Getter
@ApiModel(description = "사용자 RefreshToken 저장 DTO")
public class SaveRefreshTokenDto {

	@ApiModelProperty(value = "사용자 No.")
    private long   userNo;

    @ApiModelProperty(value = "사용자 RefreshToken")
    private String lockText;
}
