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
	
	public AlarmEvent(BaseEvent baseEvent) {
		this.setEventSeq(baseEvent.getEventSeq());
		
		this.setEventId(baseEvent.getEventId());
		this.setEventStartTime(baseEvent.getEventStartTime());
		this.setEventEndTime(baseEvent.getEventEndTime());
		this.setEventCategory(baseEvent.getEventCategory());
		this.setEventName(baseEvent.getEventName());
		this.setEventCount(baseEvent.getEventCount());
		this.setEventRiskLevel(baseEvent.getEventRiskLevel());
		this.setRawEvent(baseEvent.getRawEvent());
		this.setRawEventLength(baseEvent.getRawEventLength());
		
		this.setCollectorAddress(baseEvent.getCollectorAddress());
		this.setCollectorType(baseEvent.getCollectorType());
		this.setCollectorTimeZone(baseEvent.getCollectorTimeZone());
		this.setCollectorReceiptTime(baseEvent.getCollectorReceiptTime());
		this.setCollectorVersion(baseEvent.getCollectorVersion());
		this.setCollectorId(baseEvent.getCollectorId());
		
		this.setDeviceId(baseEvent.getDeviceId());
		this.setDeviceAddress(baseEvent.getDeviceAddress());
		this.setDeviceHostName(baseEvent.getDeviceHostName());
		this.setDeviceProduct(baseEvent.getDeviceProduct());
		this.setDeviceReceiptTime(baseEvent.getDeviceReceiptTime());
		this.setDeviceTimeZone(baseEvent.getDeviceTimeZone());
		this.setDeviceVendor(baseEvent.getDeviceVendor());
		this.setDeviceVersion(baseEvent.getDeviceVersion());
		this.setDeviceSerial(baseEvent.getDeviceSerial());

		this.setHrEmployeeNumber(baseEvent.getHrEmployeeNumber());
		this.setHrEmployeeName(baseEvent.getHrEmployeeName());
		this.setHrEmployeeName(baseEvent.getHrEmployeeName());
	}
	
}
