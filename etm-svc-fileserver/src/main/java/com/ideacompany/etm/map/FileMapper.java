package com.ideacompany.etm.map;

import com.ideacompany.etm.dto.FileDto;

public interface FileMapper {
	public int insertFile(FileDto fileDto);
	public FileDto getFileInfo(long fileSeq);
}
