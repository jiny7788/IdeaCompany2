package com.ideacompany.etm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.gson.annotations.SerializedName;

import lombok.Data;

@JsonInclude(Include.NON_NULL)
@Data
public class BaseEvent {
	
	@SerializedName(value="e01", alternate={"eventId"})
	private String eventId;

}
