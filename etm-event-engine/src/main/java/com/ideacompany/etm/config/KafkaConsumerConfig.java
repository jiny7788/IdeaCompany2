package com.ideacompany.etm.config;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.kafka.clients.consumer.Consumer;
import org.apache.kafka.clients.consumer.ConsumerConfig;
import org.apache.kafka.clients.consumer.ConsumerRecord;
import org.apache.kafka.common.serialization.StringDeserializer;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.ConcurrentKafkaListenerContainerFactory;
import org.springframework.kafka.core.ConsumerFactory;
import org.springframework.kafka.core.DefaultKafkaConsumerFactory;
import org.springframework.kafka.listener.ContainerProperties.AckMode;
import org.springframework.kafka.listener.ErrorHandler;
import org.springframework.kafka.listener.MessageListenerContainer;

import com.ideacompany.etm.dto.BaseEvent;
import com.ideacompany.etm.dto.BaseEventDeserializer;

@EnableKafka
@Configuration
@ConfigurationProperties(prefix = "kafka")
public class KafkaConsumerConfig {

	Logger logger = LoggerFactory.getLogger(getClass());
	
	@Value(value = "${kafka.bootstrapAddress}")
	private String bootstrapAddress;

	@Value(value = "${kafka.consumer.group-id:event-engine}")
	private String groupId;
	
	@Value(value = "${kafka.consumer.auto_offset_reset:latest}")
	private String offsetReset;
	
	@Value(value = "${kafka.consumer.enable-auto-commit}")
    private String ebableAutoCommit;
	
	@Value(value = "${kafka.consumer.auto-commit-interval}")
    private String autoCommitInterval;
	
	@Value(value = "${kafka.consumer.max-poll-records}")
    private String maxPollRecords;	

	public ConsumerFactory<String, BaseEvent> baseEventConsumerFactory() {
		Map<String, Object> props = new HashMap<>();
		props.put(ConsumerConfig.BOOTSTRAP_SERVERS_CONFIG, bootstrapAddress);
		props.put(ConsumerConfig.GROUP_ID_CONFIG, groupId);
		props.put(ConsumerConfig.AUTO_OFFSET_RESET_CONFIG, offsetReset);
		props.put(ConsumerConfig.ENABLE_AUTO_COMMIT_CONFIG, ebableAutoCommit);
		props.put(ConsumerConfig.AUTO_COMMIT_INTERVAL_MS_CONFIG, autoCommitInterval);
		props.put(ConsumerConfig.SESSION_TIMEOUT_MS_CONFIG, "30000");
		props.put(ConsumerConfig.MAX_POLL_RECORDS_CONFIG, maxPollRecords);
		return new DefaultKafkaConsumerFactory<>(props, new StringDeserializer(), new BaseEventDeserializer());
	}

	@Bean
	public ConcurrentKafkaListenerContainerFactory<String, BaseEvent> baseEventKafkaListenerContainerFactory() {
		ConcurrentKafkaListenerContainerFactory<String, BaseEvent> factory = new ConcurrentKafkaListenerContainerFactory<>();
		factory.setConsumerFactory(baseEventConsumerFactory());
		
		// 특정 Event만 필터링하고 싶은 경우 여기서 처리
		// factory.setRecordFilterStrategy(r -> (r.value().getEventCategory() == xxxx) );

		return factory;
	}
	
}
