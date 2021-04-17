package com.ideacompany.test;

import lombok.Data;

@Data
public class AuthkeyDto {

	private String accessKey;
    private String stringToSign;
    private String signature;
    private Long   accessDate;

}
