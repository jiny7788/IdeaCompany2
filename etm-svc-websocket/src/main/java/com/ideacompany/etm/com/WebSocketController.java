package com.ideacompany.etm.com;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class WebSocketController {

	private static final Logger logger = LoggerFactory.getLogger(WebSocketController.class);

    @MessageMapping("/alarms/")
    @SendTo(value = "/topic/alarms/")
    public @ResponseBody ResponseEntity<?> alarms(@Payload String payload) throws Exception {

        if (logger.isDebugEnabled()) {
            logger.debug("send TO - /topic/alarms/");
        }

        return new ResponseEntity<>(payload, HttpStatus.OK);
    }

    @MessageMapping("/alarms/{userNo}")
    @SendTo(value = "/topic/alarms/{userNo}")
    public @ResponseBody ResponseEntity<?> alarms(@Payload String payload, @DestinationVariable String userNo) throws Exception {

        if (logger.isDebugEnabled()) {
            logger.debug("send TO - /topic/alarms/{}", userNo);
        }

        return new ResponseEntity<>(payload, HttpStatus.OK);
    }
    
}
