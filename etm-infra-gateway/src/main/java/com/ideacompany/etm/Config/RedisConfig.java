package com.ideacompany.etm.Config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.Jackson2JsonRedisSerializer;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@Configuration
public class RedisConfig {

	@Autowired
	private RedisProperty redisProperty;
	
	@Primary
	@Bean(name = "redisConnectionFactory")
	public LettuceConnectionFactory redisConnectionFactory() {
		RedisStandaloneConfiguration redisConfig = new RedisStandaloneConfiguration();
        redisConfig.setHostName(redisProperty.getHost());
        redisConfig.setPort(redisProperty.getPort());
        redisConfig.setDatabase(redisProperty.getDatabase());

        LettuceConnectionFactory conn = new LettuceConnectionFactory(redisConfig, LettuceClientConfiguration.defaultConfiguration());
        return conn;
	}
	
	public static final String PREFIX_AUTH_ACCESS_KEY = "etm:user:accesskey:";
	
	@Bean(name = "authAccessKeyRedisTemplate")
	public RedisTemplate<String, String> authAccessKeyRedisTemplate() {
		
		RedisTemplate<String, String> redisTemplate = new RedisTemplate<> ();
		redisTemplate.setConnectionFactory(redisConnectionFactory());
		redisTemplate.setHashKeySerializer(new StringRedisSerializer());
		redisTemplate.setHashKeySerializer(new StringRedisSerializer());
		redisTemplate.setHashValueSerializer(new Jackson2JsonRedisSerializer<>(Object.class));
		
		return redisTemplate;
	}
}
