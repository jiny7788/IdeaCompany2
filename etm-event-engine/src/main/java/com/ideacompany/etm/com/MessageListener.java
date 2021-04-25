package com.ideacompany.etm.com;

import java.util.List;
import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.listener.ConsumerSeekAware;
import org.springframework.stereotype.Component;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.ideacompany.etm.dto.BaseEvent;
import com.ideacompany.etm.svc.EventService;

@Component
public class MessageListener implements ConsumerSeekAware {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EventService eventService;
	
	@KafkaListener(topics = "${kafka.consumer.topic}", containerFactory = "baseEventKafkaListenerContainerFactory")
	public void listenEvent(List<BaseEvent> events, ConsumerRecord<?,?> record) throws Exception {

		logger.info("### EventEngine Kafka Data Received = {}건", events.size());
		try {
			for( int i=0; i<events.size(); i++ ) {
				if( !eventService.executeEventProcess(events.get(i)) )
					logger.info("### Data Processing is skip = {}", jsonToString(events.get(i)) );
			}
		} catch (Exception ex) {
			logger.error("Exception {}, partition:{}, offset:{}, {}", record.timestamp(), record.partition(), record.offset(), jsonToString(events));
			logger.error(ex.toString());
		}
	}
	
	public String jsonToString(Object _jsonObj) {
		String jsonString;
		Gson gson = new Gson();
		GsonBuilder builder = new GsonBuilder();
		gson = builder.serializeNulls().create();
		jsonString = gson.toJson(_jsonObj);
		return jsonString;
	}
	
}
