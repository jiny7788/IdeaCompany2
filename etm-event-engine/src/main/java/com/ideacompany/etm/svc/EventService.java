package com.ideacompany.etm.svc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.com.MessageSender;
import com.ideacompany.etm.dto.BaseEvent;

@Service
public class EventService {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	MessageSender messageSender;	// alarm-event topic write
	
	public boolean executeEventProcess(BaseEvent baseEvent) throws Exception {
		/*
		 * TODO:
		 * 1. base-event를 DB에 저장한다.
		 * 2. base-event중에서 Alarm을 발생시켜야 할 경우 alarm-event topic에 write한다. 
		 *    => topic에 write하지 말고 여기서 다 처리한다. 나중에 성능상 이슈가 생길만 하면 alarm-event topic에 write하고 alarm engine이 처리하도록 한다.
		 * 3. ...
		 */
		
		
		return true;
	}

}
