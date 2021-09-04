package com.ideacompany.etm.svc;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.ideacompany.etm.dto.FileDto;
import com.ideacompany.etm.map.FileMapper;

@Service
public class FileService {
	private static final Logger logger = LoggerFactory.getLogger(FileService.class);
	
	@Autowired
	FileMapper fileMapper;
	
	public void addFile(FileDto fileDto) {		
		fileMapper.insertFile(fileDto);
	}
	
	public FileDto getFileInfo(long fileSeq) {
		FileDto result = null;
		
		if(fileSeq<1)  return result;
		
		result = fileMapper.getFileInfo(fileSeq);
		return result;
	}

}
