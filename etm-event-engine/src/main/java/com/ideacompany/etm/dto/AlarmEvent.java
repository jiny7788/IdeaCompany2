package com.ideacompany.etm.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;
import com.google.gson.annotations.SerializedName;

import lombok.Data;

@JsonInclude(Include.NON_NULL)
@Data
public class AlarmEvent extends BaseEvent {

	@SerializedName(value="a01", alternate={"alarmId"})
	private long alarmId;
	@SerializedName(value="a02", alternate={"alarmRuleId"})
	private long alarmRuleId;
	@SerializedName(value="a03", alternate={"alarmRuleName"})
	private String alarmRuleName;
	@SerializedName(value="a04", alternate={"alarmTime"})
	private long alarmTime; 	
	
}
