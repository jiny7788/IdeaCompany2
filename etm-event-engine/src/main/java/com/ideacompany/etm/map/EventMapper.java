package com.ideacompany.etm.map;

import com.ideacompany.etm.dto.AlarmEvent;
import com.ideacompany.etm.dto.BaseEvent;

public interface EventMapper {

	int insertRawEvent(BaseEvent baseEvent);
	int insertAlarm(AlarmEvent alarmEvent);
}
