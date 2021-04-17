package com.example.demo;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.redis.core.HashOperations;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.config.RedisConfig;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
public class Test2Application {

	public static void main(String[] args) {
		SpringApplication.run(Test2Application.class, args);
	}

}

@RestController
@RequestMapping(path = "/")
class GreetingController {
	private static final Logger logger = LoggerFactory.getLogger(GreetingController.class);

	@Autowired
	public RedisTemplate<String, String> authAccessKeyRedisTemplate;

	@RequestMapping("/")
	Greet greet() {
		//logger.info("bootrest.customproperty " + env.getProperty("bootrest.customproperty"));
		Greet greet = new Greet("Hello World!");
		
		HashOperations<String, Object, Object> hashOp = authAccessKeyRedisTemplate.opsForHash();
		hashOp.put(RedisConfig.PREFIX_AUTH_ACCESS_KEY+"5367035EE5F04593", "secretkey", "c4163c040af84f46828322564704204e");
		
		Object test = hashOp.get(RedisConfig.PREFIX_AUTH_ACCESS_KEY+"5367035EE5F04593", "secretkey");
		greet.setMessage("Redis Test: " + test);
		
		
		return greet;
	}

	@RequestMapping("/greeting")
	@ResponseBody
	public HttpEntity<Greet> greeting(
			@RequestParam(value = "name", required = false, defaultValue = "HATEOAS") String name) {
		Greet greet = new Greet("Hello " + name);

//		HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
//		logger.info(request.getSession().getId());
		
		return new ResponseEntity<Greet>(greet, HttpStatus.OK);
	}
}

class Greet {
	private String message;

	public Greet() {
	}

	public Greet(String message) {
		this.message = message;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}
}
