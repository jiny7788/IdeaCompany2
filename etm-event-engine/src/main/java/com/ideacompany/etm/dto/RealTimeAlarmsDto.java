package com.ideacompany.etm.dto;

import com.google.gson.annotations.SerializedName;

import lombok.Data;

@Data
public class RealTimeAlarmsDto {

	// 알람 정보
	private String alarmId;			// 알람 ID
	private String alarmRuleId;		// 알람룰  ID
	private String alarmRuleName;	// 알람룰 이름
	private String alarmTime; 		// 알람 발샏 시간
	
	// 이벤트 정보
	private String eventId;			// Event ID
	private String eventStartTime;	// Event 발생시간
	private String eventEndTime;	// Event 종료시간
	private String eventCategory;	// Event 분류
	private String eventName;		// Event 이름
	private String eventRiskLevel;	// 위험레벨
	
	// 수집장치 정보
	private String collectorAddress;	// 수집장치 주소
	private String collectorId;			// 수집장치 ID
	
	// 장비정보
	private String deviceId;			// 장치 ID
	private String deviceProduct;		// 장치 제품명
	private String deviceVendor;		// 장치 벤더
	private String deviceSerial;		// 장치 Serial
	
	// 인적정보
	private String hrEmployeeNumber;	// 사용자 번호
	private String hrDepartment;		// 사용자 부서
	private String hrEmployeeName;		// 사용자 이름

}
