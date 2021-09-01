package com.ideacompany.etm.ctl;

import java.io.File;
import java.io.IOException;
import java.io.PrintWriter;
import java.net.URLEncoder;
import java.nio.file.Paths;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.commons.io.FilenameUtils;
import org.apache.commons.io.FileUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import com.google.gson.JsonObject;
import com.ideacompany.etm.dto.AlarmDetail;
import com.ideacompany.etm.dto.AlarmSearchVO;
import com.ideacompany.etm.dto.Board;
import com.ideacompany.etm.dto.RealTimeAlarmsDto;
import com.ideacompany.etm.svc.TestService;

import io.lettuce.core.SslOptions.Resource;
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
	public ResponseEntity<Map> getAllBoards(@RequestParam(value = "p_num", required=false) Integer p_num) {
		if (p_num == null || p_num <= 0) p_num = 1;
		
		return testService.getPagingBoard(p_num);
	}
	
	@PostMapping("/board")
	public int createBoard(@RequestBody Board board) {
		return testService.createBoard(board);
	}
	
	@GetMapping("/board/{no}")
	public ResponseEntity<Board> getBoardByNo(@PathVariable Integer no) {		
		return testService.getBoard(no);
	}
	
	@PutMapping("/board/{no}")
	public int updateBoardByNo(
			@PathVariable Integer no, @RequestBody Board board) {
		
		return testService.updateBoard(no, board);
	}
	
	@DeleteMapping("/board/{no}")
	public ResponseEntity<Map<String, Boolean>> deleteBoardByNo(
			@PathVariable Integer no) {
		
		return testService.deleteBoard(no);
	}
	
	@ResponseBody
	@RequestMapping(value = "/fileUpload", method = {RequestMethod.POST, RequestMethod.GET})
	public String fileUpload(Model model,  
	        @RequestParam(value="upload", required = false) MultipartFile fileload,
	        HttpServletRequest req) {
				
	    //filename 취득
	    String filename = fileload.getOriginalFilename();
	    
	    logger.info("fileUpload called : " + filename);
	
	    try {
		    String newfilename = uploadCKEditorFile(fileload, "ckeditor");
		    String fileUrl = "/test/fileDownload?fileName=" + newfilename;

		    //return "{ \"uploaded\" : 1, \"fileName\" : \""+ filename+ "\", \"url\" : \"http://localhost:8090" + fileUrl + "\" }";
		    //return "{ \"uploaded\":1,\"urls\":{\"default\":\"http://localhost:8090\"" + fileUrl + "\"}}";
		    //return "{ \"uploaded\" : 1, \"fileName\" : \""+ filename+ "\", \"url\" : \"http://localhost:8090" + fileUrl + "\", \"default\":\"http://localhost:8090" +fileUrl+ "\" }";
		    return "{\"uploaded\":1, \"url\":\"http://localhost:8090" +fileUrl+ "\"}";
		    //return "{\"default\": \"http://localhost:8090" +fileUrl+ "\"}";
	    } catch (Exception e) {
	    	return "{\"error\":true, {\"message\":\"File save error\"}}";
	    }
	}
	
	
	public String rootPath = Paths.get("C:", "Temp").toString();
	public String uploadCKEditorFile(MultipartFile multipartFile, String subPath) throws Exception {
		// 파일 업로드 경로 생성 
		String savePath = Paths.get(rootPath, subPath).toString(); 
		verifyUploadPath(savePath); 
		
		String origFilename = multipartFile.getOriginalFilename(); 
		if (origFilename == null || "".equals(origFilename)) return null; 
		String filename = getUuidFileName(origFilename);
		String filePath = Paths.get(savePath, filename).toString(); 
		try { 
			File file = new File(filePath); 
			// 파일 권한 설정(쓰기, 읽기) 
			file.setWritable(true); 
			file.setReadable(true); 
			multipartFile.transferTo(file); 
			} catch (Exception e) { 
				throw new Exception("[" + multipartFile.getOriginalFilename() + "] failed to save file..."); 
			} 

		return filename;
	}

	public void verifyUploadPath(String path) {
		if (!new File(path).exists()) { 
			try { new File(path).mkdir(); 
			} catch (Exception e) { 
				e.getStackTrace(); 
			} 
		} 
	}
	
	public String getUuidFileName(String filename) { 
		UUID uuid = UUID.randomUUID(); 
		StringBuilder sb = new StringBuilder(); 
		sb.append(FilenameUtils.getBaseName(filename)) 
			.append("_")
			.append(uuid)
			.append(".").
			append(FilenameUtils.getExtension(filename)); 
		return sb.toString(); 
	}
	
	@RequestMapping("/fileDownload") 
	public void ckSubmit(@RequestParam(value="fileName") String fileName, 
			HttpServletRequest request, 
			HttpServletResponse response) {
		File file = getDownloadFile(fileName, "ckeditor"); 
		try {
			byte[] data = FileUtils.readFileToByteArray(file); 
			response.setContentType(getMediaType(fileName).toString());
			response.setContentLength(data.length); response.setHeader("Content-Transfer-Encoding", "binary");
			response.setHeader("Content-Disposition", "attachment; fileName=\"" + URLEncoder.encode(fileName, "UTF-8") + "\";"); 
			response.getOutputStream().write(data); response.getOutputStream().flush(); response.getOutputStream().close(); 
		} catch (IOException e) { 
			throw new RuntimeException("파일 다운로드에 실패하였습니다."); 
		} catch (Exception e) { 
			throw new RuntimeException("시스템에 문제가 발생하였습니다."); 
		} 
	} 
	
	public File getDownloadFile(String filaName, String subPath) { 
		return new File(Paths.get(rootPath, subPath).toString(), filaName); 
	}

	public MediaType getMediaType(String filename) { 
		String contentType = FilenameUtils.getExtension(filename); 
		MediaType mediaType = null; 
		if (contentType.equals("png")) { mediaType = MediaType.IMAGE_PNG; } 
		else if (contentType.equals("jpeg") || contentType.equals("jpg")) { mediaType = MediaType.IMAGE_JPEG; }
		else if (contentType.equals("gif")) { mediaType = MediaType.IMAGE_GIF; } 
		return mediaType; 
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
