package com.ideacompany.etm.config;

import java.io.IOException;
import java.util.concurrent.CountDownLatch;

import org.apache.zookeeper.WatchedEvent;
import org.apache.zookeeper.Watcher;
import org.apache.zookeeper.Watcher.Event.KeeperState;
import org.apache.zookeeper.ZooKeeper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ZkConfig {
	
	private final Logger logger = LoggerFactory.getLogger(getClass());
	
	@Value(value = "${zk.conn}")
	private String zkConn;
	
	@Value(value = "${zk.sessionTimeoutMs}")
	private int zkSessionTimeoutMs;

	@Bean
	public ZooKeeper zookeeper() throws IOException, InterruptedException {
		logger.info("zk connection: {}, sessionTimeout: {}", zkConn, zkSessionTimeoutMs);
		CountDownLatch connectionLatch = new CountDownLatch(1);
		ZooKeeper zoo = new ZooKeeper(zkConn, zkSessionTimeoutMs, new Watcher() {
            public void process(WatchedEvent we) {
            	logger.debug("watcher callback: {}, {}, {}", we.getState(), we.getPath(), we.getType().toString());
                if (we.getState() == KeeperState.SyncConnected) {
                    connectionLatch.countDown();
                }
            }
        });
 
        connectionLatch.await();
        return zoo;
	}
	
}
