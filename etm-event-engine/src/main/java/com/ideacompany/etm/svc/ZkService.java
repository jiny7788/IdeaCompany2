package com.ideacompany.etm.svc;

import javax.annotation.PostConstruct;

import org.apache.zookeeper.CreateMode;
import org.apache.zookeeper.KeeperException;
import org.apache.zookeeper.ZooDefs;
import org.apache.zookeeper.ZooKeeper;
import org.apache.zookeeper.data.Stat;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class ZkService {

private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Autowired
	private ZooKeeper zookeeper;
	
	@Value(value = "${kafka.groupId}")
	private String groupId;
	
	@Value(value = "${kafka.comsume.topic}")
	private String consumeTopic;
	
	final private static String UNIX_FILE_SEPARATOR = "/";
	
	@Value(value = "${zk.offsets}")
	private String zkOffsets;
	
	private static String zkPathOffsetsGroupRoot;
	
	private static String zkPathOffsetsConsumeRoot;
	
	@PostConstruct
	public void init() throws Exception {
		zkPathOffsetsGroupRoot = zkOffsets + UNIX_FILE_SEPARATOR + groupId;
		zkPathOffsetsConsumeRoot = zkPathOffsetsGroupRoot + UNIX_FILE_SEPARATOR + consumeTopic;
		
		logger.debug("######################## {}", zkPathOffsetsGroupRoot);
		String[] pathEles = zkPathOffsetsGroupRoot.split(UNIX_FILE_SEPARATOR);
		StringBuilder path = new StringBuilder();
		for(String zkPath : pathEles) {
			if(!zkPath.isEmpty()) {
				path.append(UNIX_FILE_SEPARATOR);
				path.append(zkPath);
				if(zookeeper.exists(path.toString(), false) == null) {
					zookeeper.create(path.toString(), null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
					logger.debug("'{}' is created", path.toString());
				} else {
					logger.debug("'{}' is already exist...", path.toString());
				}
			}
		}
		
		if(zookeeper.exists(zkPathOffsetsConsumeRoot, false) == null) {
			zookeeper.create(zkPathOffsetsConsumeRoot, null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
			logger.debug("'{}' is created", zkPathOffsetsConsumeRoot);
		} else {
			logger.debug("'{}' is already exist...", zkPathOffsetsConsumeRoot);
		}
	}
	
	// access error catch add
	public long getOffset(String topic, int partition) {
		long initialOffset = -1;
		
		try {
			String zNode = zkPathOffsetsGroupRoot + UNIX_FILE_SEPARATOR + topic + UNIX_FILE_SEPARATOR + partition;
			Stat stat = zookeeper.exists(zNode, false);
			if( stat == null) {
				zookeeper.create(zNode, null, ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
			} else {
				byte[] data = zookeeper.getData(zNode, true, new Stat());
				if(data != null) {
					initialOffset = Long.parseLong(new String(data));
				}
			}
		} catch (Exception e) {
			e.printStackTrace();
			initialOffset = -2; // zookeeper access fail case.
		}
		
		return initialOffset;
	}
	
	public Stat saveOffset(String topic, int partition, String offsetStr) throws KeeperException, InterruptedException {
		String zNode = zkPathOffsetsGroupRoot + UNIX_FILE_SEPARATOR + topic + UNIX_FILE_SEPARATOR + partition;
		Stat stat = zookeeper.exists(zNode, false);
		
		if( stat == null) {
			zookeeper.create(zNode, offsetStr.getBytes(), ZooDefs.Ids.OPEN_ACL_UNSAFE, CreateMode.PERSISTENT);
		} else {
			logger.info("###: {}, {}", zNode, offsetStr);
			zookeeper.setData(zNode, offsetStr.getBytes(), stat.getVersion());
		}
		
		return stat;
	}
	
}
