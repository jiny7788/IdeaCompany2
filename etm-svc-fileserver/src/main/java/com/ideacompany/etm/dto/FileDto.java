package com.ideacompany.etm.dto;

import java.util.Date;

import lombok.Data;

@Data
public class FileDto {
	private long fileSeq;

    private String fileName;
    
    private String filePath;
    
    private String saveFileName;
    
    private String hash;
    
    private String bucket;
    
    private String storageType;
    
    private String savePath;
    
    private String useYn;
    
    private long regUsrNo;
    
    private Date regDate;
    
    private long modUsrNo;
    
    private Date modDate;
    
    private String downloadUrl;
}
