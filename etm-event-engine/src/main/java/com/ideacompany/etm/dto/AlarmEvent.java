package com.ideacompany.etm.dto;

import com.google.gson.annotations.SerializedName;

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
