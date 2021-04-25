package com.ideacompany.etm.svc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.com.MessageSender;
import com.ideacompany.etm.dto.AlarmEvent;
import com.ideacompany.etm.dto.BaseEvent;
import com.ideacompany.etm.map.EventMapper;

@Service
public class EventService {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	MessageSender messageSender;	// alarm-event topic write
	
	@Autowired
	EventMapper eventMapper;
	
	public boolean executeEventProcess(BaseEvent baseEvent) throws Exception {
		/*
		 * TODO:
		 * 1. base-event를 DB에 저장한다.
		 * 2. base-event중에서 Alarm을 발생시켜야 할 경우 alarm-event topic에 write한다. 
		 *    => topic에 write하지 말고 여기서 다 처리한다. 나중에 성능상 이슈가 생길만 하면 alarm-event topic에 write하고 alarm engine이 처리하도록 한다.
		 * 3. ...
		 */
		logger.info(baseEvent.toString());
		
		// 1단계 : tb_raw_event 테이블에 기록한다.
		eventMapper.insertRawEvent(baseEvent);	
		
		// 2단계 : 특정 조건을 만족할 때 tb_alarm_event 테이블에 기록한다.
		if( baseEvent.getEventRiskLevel() < 2 ) {				
			AlarmEvent alarmEvent = new AlarmEvent();
			
			alarmEvent.setEventId(baseEvent.getEventId());
			alarmEvent.setEventStartTime(baseEvent.getEventStartTime());
			alarmEvent.setEventEndTime(baseEvent.getEventEndTime());
			alarmEvent.setEventCategory(baseEvent.getEventCategory());
			alarmEvent.setEventName(baseEvent.getEventName());
			alarmEvent.setEventCount(baseEvent.getEventCount());
			alarmEvent.setEventRiskLevel(baseEvent.getEventRiskLevel());
			alarmEvent.setRawEvent(baseEvent.getRawEvent());
			alarmEvent.setRawEventLength(baseEvent.getRawEventLength());
			
			alarmEvent.setCollectorAddress(baseEvent.getCollectorAddress());
			alarmEvent.setCollectorType(baseEvent.getCollectorType());
			alarmEvent.setCollectorTimeZone(baseEvent.getCollectorTimeZone());
			alarmEvent.setCollectorReceiptTime(baseEvent.getCollectorReceiptTime());
			alarmEvent.setCollectorVersion(baseEvent.getCollectorVersion());
			alarmEvent.setCollectorId(baseEvent.getCollectorId());
			
			alarmEvent.setDeviceId(baseEvent.getDeviceId());
			alarmEvent.setDeviceAddress(baseEvent.getDeviceAddress());
			alarmEvent.setDeviceHostName(baseEvent.getDeviceHostName());
			alarmEvent.setDeviceProduct(baseEvent.getDeviceProduct());
			alarmEvent.setDeviceReceiptTime(baseEvent.getDeviceReceiptTime());
			alarmEvent.setDeviceTimeZone(baseEvent.getDeviceTimeZone());
			alarmEvent.setDeviceVendor(baseEvent.getDeviceVendor());
			alarmEvent.setDeviceVersion(baseEvent.getDeviceVersion());
			alarmEvent.setDeviceSerial(baseEvent.getDeviceSerial());
	
			alarmEvent.setHrEmployeeNumber(baseEvent.getHrEmployeeNumber());
			alarmEvent.setHrEmployeeName(baseEvent.getHrEmployeeName());
			alarmEvent.setHrEmployeeName(baseEvent.getHrEmployeeName());
			
//			alarmEvent.setAlarmId(alarmId);
//			alarmEvent.setAlarmRuleId(alarmRuleId);
//			alarmEvent.setAlarmRuleName(alarmRuleName);
//			alarmEvent.setAlarmTime(alarmTime);
//			
//			eventMapper.insertAlarm(alarmEvent);
		}

		return true;
	}

}
