package com.ideacompany.etm.util;

import java.io.BufferedInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.security.DigestInputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.Formatter;

public class MD5 {
	public static String convert(File file) {
		MessageDigest md5;
		byte[] hash = null;
		try {
			md5 = MessageDigest.getInstance("MD5");
			FileInputStream fis = new FileInputStream(file);
	        BufferedInputStream bis = new BufferedInputStream(fis);
	        DigestInputStream dis = new DigestInputStream(bis, md5);
	       
	        while(dis.read() != -1) ;
	        hash = md5.digest();
	       
	        dis.close();
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		} catch (FileNotFoundException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
        
        return byteArray2Hex(hash);
	}
	
	private static String byteArray2Hex(byte[] hash) {
        String resultData;
        Formatter formatter = new Formatter();
        for(byte b : hash) {
            formatter.format("%02X", b);
        }
        resultData = formatter.toString();
        formatter.close();
        return resultData;
    }
}
