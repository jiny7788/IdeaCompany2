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
		// tb_raw_event테이블에 insert시 sequence로 생성된 값
		logger.info("baseEvent inserted - seq: {}", baseEvent.getEventSeq());			
		
		// 2단계 : 특정 조건을 만족할 때 tb_alarm_event 테이블에 기록한다.
		if( baseEvent.getEventRiskLevel() < 2 ) {		
			AlarmEvent alarmEvent = new AlarmEvent(baseEvent);
			
			alarmEvent.setAlarmRuleId(1L);
			alarmEvent.setAlarmRuleName("default Alarm");
			alarmEvent.setAlarmTime(System.currentTimeMillis());	// 현재시간 설정
			
			eventMapper.insertAlarm(alarmEvent);			
			// tb_alarm_event테이블에 insert시 sequence로 생성된 값
			logger.info("alarmEvent inserted - seq: {}", alarmEvent.getAlarmId());	
		}

		return true;
	}

}
