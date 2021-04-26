package com.ideacompany.etm;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.client.discovery.EnableDiscoveryClient;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ideacompany.etm.config.WebSocketConfig;
import com.ideacompany.etm.dto.RealTimeAlarmsDto;
import com.ideacompany.etm.svc.WebSocketService;

import springfox.documentation.swagger2.annotations.EnableSwagger2;

@SpringBootApplication
@EnableSwagger2
@EnableDiscoveryClient
public class EtmSvcControlApplication {

	public static void main(String[] args) {
		SpringApplication.run(EtmSvcControlApplication.class, args);
	}

}


@RestController
@RequestMapping(path = "/test/")
class GreetingController {
	private static final Logger logger = LoggerFactory.getLogger(GreetingController.class);
	
	@Autowired
	WebSocketService webSocketService;
	
	@Autowired
	WebSocketConfig webSocketConfig;

	@RequestMapping("/")
	Greet greet() {
		Greet greet = new Greet("Hello World!");

		return greet;
	}

	@RequestMapping("/greeting")
	@ResponseBody
	public HttpEntity<Greet> greeting(
			@RequestParam(value = "name", required = false, defaultValue = "HATEOAS") String name) {
		Greet greet = new Greet("Hello " + name);
		
		try {
			RealTimeAlarmsDto item = new RealTimeAlarmsDto();
			
			item.setHrEmployeeName(name);
			
			webSocketService.sendRealtimeAlarm(webSocketConfig.getHost(), webSocketConfig.getPort(), item, 1);
		} catch (Exception e) {
			logger.info(e.getMessage());
		}
		
		return new ResponseEntity<Greet>(greet, HttpStatus.OK);
	}
}

class Greet  {
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