package com.ideacompany.etm.auth.dto;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.Data;

@Data
public class CommonResponse {
    private String code;

    private String message;

    private String responseTime;

    private Object response;

    public static CommonResponse ok(Object response) {
        CommonResponse res = new CommonResponse();
        res.code = "SUC_PROC_0000";
        res.message = "success";
        res.response = response;
        res.responseTime = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss").format(new Date());

        return res;
    }   
}
