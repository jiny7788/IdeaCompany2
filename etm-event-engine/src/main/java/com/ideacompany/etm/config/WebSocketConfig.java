package com.ideacompany.etm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Configuration
@ConfigurationProperties(prefix = "websocket")
@Data
public class WebSocketConfig {

	private String host;

	private int port;

	private String endPoints;
	
	private String brokers;
	
	private String destinationPrefixes;
	
	private boolean enable;
	
}
