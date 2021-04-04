package com.ideacompany.etm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.cloud.netflix.eureka.server.EnableEurekaServer;

@SpringBootApplication
@EnableEurekaServer
public class EtmInfraEurekaApplication {

	public static void main(String[] args) {
		SpringApplication.run(EtmInfraEurekaApplication.class, args);
	}

}
