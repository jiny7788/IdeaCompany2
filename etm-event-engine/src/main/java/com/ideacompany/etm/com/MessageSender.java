package com.ideacompany.etm.com;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

import com.ideacompany.etm.dto.AlarmEvent;

@Component
public class MessageSender {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	@Qualifier("alarmEventKafkaTemplate")
	private KafkaTemplate<String, AlarmEvent> alarmEvent;

	// 외부 연동 topic
	@Value(value = "${kafka.produce.topic:alarm-event}")
	private String sendTopic;

	public void sendExtAlarmEvent(AlarmEvent ae) {
		alarmEvent.send(sendTopic, ae);
	}
	
}
