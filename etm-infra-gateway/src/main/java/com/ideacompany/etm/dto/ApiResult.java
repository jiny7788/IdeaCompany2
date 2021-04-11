package com.ideacompany.etm.dto;

import java.io.Serializable;

import org.apache.commons.lang3.builder.EqualsBuilder;
import org.apache.commons.lang3.builder.HashCodeBuilder;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;

import com.ideacompany.etm.Exception.ApiException;

import io.swagger.annotations.ApiModelProperty;

public class ApiResult<T> implements Serializable  {

	private static final long serialVersionUID = 1908871197483609531L;
	
	@ApiModelProperty(value = "성공 여부")
    private boolean           success;

    @ApiModelProperty(value = "API 요청 결과 데이터")
    private T                 result;

    @ApiModelProperty(value = "오류 메시지")
    private String            message;
    
    public ApiResult() {
    }
    
    public ApiResult(T result, ApiException ae) {
        this.success = (ae == null);
        this.setResult(result);
        if (ae != null) {
            this.message = ae.getMessage();
        }
    }
	
	@Override
    public String toString() {
        return ToStringBuilder.reflectionToString(this, ToStringStyle.JSON_STYLE);
    }

    public String toString(ToStringStyle toStringStyle) {
        return ToStringBuilder.reflectionToString(this, toStringStyle);
    }

    @Override
    public boolean equals(Object obj) {
        return EqualsBuilder.reflectionEquals(this, 0);
    }

    @Override
    public int hashCode() {
        return HashCodeBuilder.reflectionHashCode(this);
    }
    
    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public T getResult() {
        return result;
    }

    public void setResult(T result) {
        this.result = result;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }    
}
