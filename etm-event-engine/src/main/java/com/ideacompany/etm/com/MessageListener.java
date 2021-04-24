package com.ideacompany.etm.com;

import java.util.Map;

import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.TopicPartition;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.listener.ConsumerSeekAware;
import org.springframework.stereotype.Component;

import com.ideacompany.etm.dto.BaseEvent;
import com.ideacompany.etm.svc.EventService;
import com.ideacompany.etm.svc.ZkService;

@Component
public class MessageListener implements ConsumerSeekAware {
	
	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private EventService eventService;
	
	@Autowired
	private ZkService zkService;
	
	@KafkaListener(topics = "${kafka.comsume.topic}", containerFactory = "baseEventKafkaListenerContainerFactory")
	public void listenEvent(BaseEvent e, ConsumerRecord<?,?> record) throws Exception {

		try {
			logger.info(e.toString());
			boolean reponse = eventService.executeEventProcess(e);
			zkService.saveOffset(record.topic(), record.partition(), String.valueOf(record.offset() + 1)); // set next offset
			if(!reponse) {
				logger.info("### Data Processing is skip. ");
			}
		} catch (Exception ex) {
			logger.error("Exception {}, partition:{}, offset:{}, {}",record.timestamp(), record.partition(),record.offset(),e.toString());
			logger.error(ex.toString());
		}
	}
	
	@Override
	public void registerSeekCallback(ConsumerSeekCallback callback) {
		// TODO Auto-generated method stub
		
	}

	// triggers when partitions assigned to the application. It also triggers on the application startup
	@Override
	public void onPartitionsAssigned(Map<TopicPartition, Long> assignments, ConsumerSeekCallback callback) {
		for(TopicPartition t : assignments.keySet()){
			long zkOffset = -1;
			long kafkaOffset = assignments.get(t);
			try {
				zkOffset = zkService.getOffset(t.topic(), t.partition()); // OK: zkOffset >=0, None: zkOffset = -1, access error: zkOffset = -2
			} catch (Exception e) {
				logger.warn("### {} ==> no zk offsets!!!", t.toString());
			}
			logger.info("### {} offset ==> zk[{}], kafka[{}]", t.toString(), zkOffset, kafkaOffset);
			
			if(zkOffset >= 0) {
				callback.seek(t.topic(), t.partition(), zkOffset);
			} else if(zkOffset == -1) {
				// offset znode 또는 data가 없을 경우 kafka의 마지막 currentOffset으로 consume. (최초 zookeeper 적용)
				callback.seek(t.topic(), t.partition(), kafkaOffset); 
			} else {
				// no seek
				logger.warn("getOffset fail: {} {}", t.toString(), zkOffset);
			}
		}
		
	}

	@Override
	public void onIdleContainer(Map<TopicPartition, Long> assignments, ConsumerSeekCallback callback) {
		// TODO Auto-generated method stub
		
	}
	
}
