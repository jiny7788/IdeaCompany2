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
	@SerializedName(value="e02", alternate={"eventStartTime"})
	private Long eventStartTime;
	@SerializedName(value="e03", alternate={"eventEndTime"})
	private Long eventEndTime;
	@SerializedName(value="e04", alternate={"eventCategory"})
	private String eventCategory;
	@SerializedName(value="e05", alternate={"eventName"})
	private String eventName;
	@SerializedName(value="e06", alternate={"eventCount"})
	private Integer eventCount;
	@SerializedName(value="e07", alternate={"eventRiskLevel"})
	private Integer eventRiskLevel;
	@SerializedName(value="e08", alternate={"rawEvent"})
	private String rawEvent;
	@SerializedName(value="e09", alternate={"rawEventLength"})
	private Integer rawEventLength;
	@SerializedName(value="e10", alternate={"applicationProtocol"})
	private String applicationProtocol;
	
	@SerializedName(value="c01", alternate={"collectorAddress"})
	private String collectorAddress;
	@SerializedName(value="c02", alternate={"collectorType"})
	private String collectorType;
	@SerializedName(value="c03", alternate={"collectorTimeZone"})
	private String collectorTimeZone;
	@SerializedName(value="c04", alternate={"collectorReceiptTime"})
	private Long collectorReceiptTime;
	@SerializedName(value="c05", alternate={"collectorVersion"})
	private String collectorVersion;
	@SerializedName(value="c06", alternate={"collectorId"})
	private String collectorId;
	
	@SerializedName(value="d01", alternate={"deviceId"})
	private Long assetsId;
	@SerializedName(value="d02", alternate={"deviceAddress"})
	private String deviceAddress;
	@SerializedName(value="d03", alternate={"deviceHostName"})
	private String deviceHostName;
	@SerializedName(value="d04", alternate={"deviceProduct"})
	private String deviceProduct;
	@SerializedName(value="d05", alternate={"deviceReceiptTime"})
	private Long deviceReceiptTime;
	@SerializedName(value="d06", alternate={"deviceTimeZone"})
	private String deviceTimeZone;
	@SerializedName(value="d07", alternate={"deviceVendor"})
	private String deviceVendor;
	@SerializedName(value="d08", alternate={"deviceVersion"})
	private String deviceVersion;
	@SerializedName(value="d09", alternate={"deviceSerial"})
	private Long deviceSerial;
	
	@SerializedName(value="h01", alternate={"hrEmployeeNumber"})
	private String hrEmployeeNumber;
	@SerializedName(value="h02", alternate={"hrDepartment"})
	private String hrDepartment;
	@SerializedName(value="h03", alternate={"hrEmployeeName"})
	private String hrEmployeeName;
	
}
