package com.ideacompany.etm.map;

import java.util.List;

import com.ideacompany.etm.dto.Board;

public interface TestMapper {
	public List<Board> getAllBoards();
	public int save(Board board);
	public Board findById(Integer no);
	public int update(Board board);
	public int delete(Board board);
	
	public int count();
	public List<Board> findFromTo(int startNum, int countPerPage);
}
