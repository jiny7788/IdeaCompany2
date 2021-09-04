package com.ideacompany.etm.ctl;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.validation.Valid;

import java.net.MalformedURLException;
import java.net.URLDecoder;
import java.nio.file.Path;
import java.nio.file.Paths;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.ideacompany.etm.dto.AddFilesDto;
import com.ideacompany.etm.dto.FileDto;
import com.ideacompany.etm.svc.FileService;
import com.ideacompany.etm.util.MD5;

import io.swagger.annotations.ApiOperation;

@RestController
@RequestMapping(path = "/fileserver")
@CrossOrigin(allowCredentials="true")
public class FileController {
	private static final Logger logger = LoggerFactory.getLogger(FileController.class);
	
	@Value("${etm.fileserver.nfs.path}")
	private String nfsPath;

	@Autowired
	FileService fileService;
	
	@ApiOperation("파일 등록")
	@RequestMapping(value = "/files", method = RequestMethod.POST, consumes=MediaType.MULTIPART_FORM_DATA_VALUE)
	public List<FileDto> addFiles(AddFilesDto vo) {	
		logger.info("file upload called : {}건", vo.getFiles().length);
	
		List<FileDto> result = null;
		
		if(vo.getFiles() == null || vo.getFiles().length <1) {
			logger.info("files is empty.");
			return result;
		}

		String path = vo.getPath();
		if(path != null && !path.startsWith("/")) {
			path = "/" + path;
		}
		
		// 파일 업로드 경로 생성
		String savePath = Paths.get(nfsPath, vo.getBucket()).toString();
		verifyUploadPath(savePath);		
		savePath = Paths.get(nfsPath, vo.getBucket() + path).toString();
		verifyUploadPath(savePath); 		
		
		File nfsDir = new File(savePath);		
		result = new ArrayList<>();
		
		for( MultipartFile file : vo.getFiles()	) {
			FileOutputStream fos = null;
			
			try {
				FileDto fileDto = null;
				
				String fileName = UUID.randomUUID().toString();
				File toFile = new File(nfsDir, fileName);
				fos = new FileOutputStream(toFile);
				fos.write(file.getBytes());
				
				String originFileName = URLDecoder.decode(file.getOriginalFilename(), "UTF-8");
				
				if(toFile != null && toFile.exists()) {
					
					fileDto = new FileDto();
					fileDto.setFileName(originFileName);
					fileDto.setSaveFileName(fileName);
					fileDto.setHash(MD5.convert(toFile));
					fileDto.setBucket(vo.getBucket());
					fileDto.setStorageType("NFS");
					fileDto.setUseYn("Y");
					fileDto.setSavePath(nfsDir.getAbsolutePath());
					fileDto.setRegUsrNo(vo.getUserNo());
					
					fileService.addFile(fileDto);
					
					logger.info("added file seq :: " + fileDto.getFileSeq() + ", MD5: " + fileDto.getHash());
					if(fileDto.getFileSeq() > 0) {
						result.add(fileDto);
					}
					
				} else {
					logger.info("file save fail." + originFileName);
				}
			} catch (IOException e) {
				logger.error(e.getMessage(), e);
			} catch (Exception e) {
				logger.error(e.getMessage(), e);
			} finally {
				if(fos != null) {
					try {
						fos.close();
					} catch (IOException e) {
						logger.error(e.getMessage());
						//e.printStackTrace();
					}
				}
			}
		}
		
		return result;
	}
	
	@ApiOperation("파일 다운로드")
	@RequestMapping(value = "/download/file/{file-seq}", method = RequestMethod.GET,
	produces = MediaType.APPLICATION_OCTET_STREAM_VALUE)
	public ResponseEntity<org.springframework.core.io.Resource> downloadFile(@Valid @PathVariable("file-seq") long fileSeq)  {
		if(fileSeq <1) {
			logger.error("fileSeq is invalid");
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
		}
		
		FileDto fileDto = fileService.getFileInfo(fileSeq);
		Path filePath = Paths.get(fileDto.getSavePath(), fileDto.getSaveFileName());
		org.springframework.core.io.Resource resource;
		try {
			resource = new UrlResource(filePath.toUri());
			return ResponseEntity.ok()
			        .contentType(MediaType.parseMediaType("application/octet-stream; charset=utf-8"))
			        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + new String(fileDto.getFileName().getBytes("UTF-8"), "ISO8859_1") + "\"")
			        .body(resource);
		} catch (Exception e) {
			logger.error("Internal Error");
			return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
			//e.printStackTrace();
		}
	}
	
	@ApiOperation("파일 업로드 for CKEditor")
	@RequestMapping(value = "/fileUpload", method = RequestMethod.POST)
	public String fileUpload(Model model,
			@RequestParam(value="upload", required = false) MultipartFile fileload,
	        HttpServletRequest req) {
		//filename 취득
	    String filename = fileload.getOriginalFilename();	    
	    logger.info("fileUpload called : " + filename);

	    AddFilesDto addfile = new AddFilesDto();
	    addfile.setUserNo(1);
	    addfile.setBucket("test");
	    addfile.setPath("ckeditor");
	    
	    List<MultipartFile> fileList = new ArrayList<MultipartFile>();
	    fileList.add(fileload);
	    MultipartFile[] files = {};
	    files = fileList.toArray(files);	    
	    addfile.setFiles(files);
	    
	    List<FileDto> result = addFiles(addfile);
	    if(result.size() > 0) {
	    	return "{\"uploaded\":1, \"url\":\"http://localhost:8094/fileserver/download/file/" +result.get(0).getFileSeq()+ "\"}";
	    } else {
	    	return "{\"error\":true, {\"message\":\"File save error\"}}";	    	
	    }
	}
	
	public void verifyUploadPath(String path) {
		if (!new File(path).exists()) { 
			try { new File(path).mkdir(); 
			} catch (Exception e) { 
				e.getStackTrace(); 
			} 
		} 
	}

}
