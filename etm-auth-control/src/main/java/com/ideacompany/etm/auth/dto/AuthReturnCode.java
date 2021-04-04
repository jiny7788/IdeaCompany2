package com.ideacompany.etm.auth.dto;

public enum AuthReturnCode {

    ERR_LIMITE_EXCEEDED("ERR_AK_0001", "Cannot exceed quota for AccessKeysPerUser: 2"),         //
    ERR_NOT_FOUND("ERR_AK_0002", "Not found AccessKey"),         //
    ERR_INVALID_SIGNATURE("ERR_AK_0003", "Invalid signature"),   //
    ERR_INVALID_ACCESSDATE("ERR_AK_0004", "Invalid accessDate");   //

    private String code;

    private String msg;

    private AuthReturnCode(String code, String msg) {
        this.code = code;
        this.msg = msg;
    }

    /**
     * @return the code
     */
    public String code() {
        return this.code;
    }

    /**
     * @return the msgCode
     */
    public String msg() {
        return this.msg;
    }

}
