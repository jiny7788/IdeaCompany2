package com.ideacompany.etm.dto;

import javax.validation.constraints.NotEmpty;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
public class AddFilesDto {	
	@NotEmpty
	@ApiModelProperty(value = "업로드 파일")
	private MultipartFile[] files;
	
	@NotEmpty
	@ApiModelProperty(value = "bucket", example = "dsaas.attach")
    private String bucket;
    
	@NotEmpty
    @ApiModelProperty(value = "업로드 위치", example = "/")
    private String path = "/";
    
    @NotEmpty
    @ApiModelProperty(value = "사용자 번호", example = "1")
    private long userNo; 

}
