package com.ideacompany.etm.svc;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.dto.Board;
import com.ideacompany.etm.map.TestMapper;

@Service
public class TestService {

	private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
	@Autowired
	private TestMapper testMapper;
	
	public List<Board> getAllBoards() {
		return testMapper.getAllBoards();		
	}

}
