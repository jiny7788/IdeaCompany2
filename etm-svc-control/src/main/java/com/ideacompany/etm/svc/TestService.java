package com.ideacompany.etm.svc;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.dto.Board;
import com.ideacompany.etm.map.TestMapper;

@Service
public class TestService {

	private static final Logger logger = LoggerFactory.getLogger(TestService.class);
	
	@Autowired
	private TestMapper testMapper;
	
	public int findAllCount() {
		return testMapper.count();
	}
	
	// get paging boards data
	public ResponseEntity<Map> getPagingBoard(Integer p_num) {
		Map result = null;
		
		PagingUtil pu = new PagingUtil(p_num, 5, 5); // ($1:표시할 현재 페이지, $2:한페이지에 표시할 글 수, $3:한 페이지에 표시할 페이지 버튼의 수 )
		List<Board> list = testMapper.findFromTo(pu.getObjectStartNum(), pu.getObjectCountPerPage());
		pu.setObjectCountTotal(findAllCount());
		pu.setCalcForPaging();
		
		System.out.println("p_num : "+p_num);
		System.out.println(pu.toString());
		
		if (list == null || list.size() == 0) {
			return null;
		}
		
		result = new HashMap<>();
		result.put("pagingData", pu);
		result.put("list", list);
		
		return ResponseEntity.ok(result);
	}	
	
	public int createBoard(Board board) {
		logger.info("createBoard called : {}", board);
		
		return testMapper.save(board);		
	}
	
	public ResponseEntity<Board> getBoard(Integer no) {
		Board board = null;
		try {
			board = testMapper.findById(no);
		} catch (Exception e) {
			ResponseEntity.noContent();  
		}
				
		return ResponseEntity.ok(board);
	}	
	
	public int updateBoard(Integer no, Board updatedBoard) {
		Board board = null;
		
		board = testMapper.findById(no);				
		board.setType(updatedBoard.getType());
		board.setTitle(updatedBoard.getTitle());
		board.setContents(updatedBoard.getContents());
		board.setUpdatedTime(new Date());
		
		return testMapper.update(board);		
	}
	
	public ResponseEntity<Map<String, Boolean>> deleteBoard(Integer no) {
		Board board = testMapper.findById(no);
				
		
		testMapper.delete(board);
		Map<String, Boolean> response = new HashMap<>();
		response.put("Deleted Board Data by id : ["+no+"]", Boolean.TRUE);
		return ResponseEntity.ok(response);
	}

}
