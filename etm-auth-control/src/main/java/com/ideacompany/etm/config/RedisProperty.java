package com.ideacompany.etm.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

import lombok.Data;

@Data
@Configuration
@ConfigurationProperties(prefix = "etm.redis.login-token")
public class RedisProperty {

	private String host;
    private int    port;
    private int    database;
    
}
