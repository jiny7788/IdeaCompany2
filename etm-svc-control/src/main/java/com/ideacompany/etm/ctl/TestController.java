package com.ideacompany.etm.ctl;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.ideacompany.etm.dto.AlarmDetail;
import com.ideacompany.etm.dto.AlarmSearchVO;
import com.ideacompany.etm.dto.Board;
import com.ideacompany.etm.dto.RealTimeAlarmsDto;
import com.ideacompany.etm.svc.TestService;

import io.swagger.annotations.ApiOperation;
import lombok.Data;

@RestController
@RequestMapping(path = "/test")
@CrossOrigin(allowCredentials="true")
public class TestController {
	private static final Logger logger = LoggerFactory.getLogger(TestController.class);
	
	@Autowired
	TestService testService;

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
		
		return new ResponseEntity<Greet>(greet, HttpStatus.OK);
	}
	
	@PostMapping("/getAlarmDetail")
	@ApiOperation(value = "알람 상세 조회")
	public AlarmDetail getAlarmDetail(@RequestBody AlarmSearchVO vo) {
		AlarmDetail result = null;
		
		result =new AlarmDetail();
		result.setAlarmSeq(vo.getAlarmSeq());
		result.setAlarmName("알람이름");
		
		return result;
	}

	@GetMapping("/board")
	@ApiOperation(value = "Board List")
	public List<Board> getAllBoards() {
		List<Board> result = testService.getAllBoards();
		return result;
	}

}


@Data
class Greet  {
	private String message;

	public Greet() {
	}

	public Greet(String message) {
		this.message = message;
	}
}