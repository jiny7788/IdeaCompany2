package com.ideacompany.etm.auth.dto;

import javax.validation.constraints.NotEmpty;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@ApiModel(description = "Signature DTO")
@Data
public class AuthkeyDto {

    @NotEmpty
    @ApiModelProperty(value = "accessKey")
    private String accessKey;

    @NotEmpty
    @ApiModelProperty(value = "서명 할 문자열")
    private String stringToSign;
    
    @NotEmpty
    @ApiModelProperty(value = "서명된 정보")
    private String signature;

    @ApiModelProperty(value = "시간정보")
    private Long   accessDate;

}
