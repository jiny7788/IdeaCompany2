package com.ideacompany.etm.svc;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.concurrent.TimeoutException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.messaging.converter.MappingJackson2MessageConverter;
import org.springframework.messaging.simp.stomp.StompHeaders;
import org.springframework.messaging.simp.stomp.StompSession;
import org.springframework.messaging.simp.stomp.StompSessionHandlerAdapter;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.WebSocketHttpHeaders;
import org.springframework.web.socket.client.standard.StandardWebSocketClient;
import org.springframework.web.socket.messaging.WebSocketStompClient;
import org.springframework.web.socket.sockjs.client.SockJsClient;
import org.springframework.web.socket.sockjs.client.Transport;
import org.springframework.web.socket.sockjs.client.WebSocketTransport;

import static java.util.concurrent.TimeUnit.SECONDS;

import com.google.gson.GsonBuilder;
import com.google.gson.reflect.TypeToken;
import com.ideacompany.etm.dto.RealTimeAlarmsDto;

@Service
public class WebSocketService {

	@Value(value = "${websocket.end-points:/ws}")
    private String               endPoints;

    @Value(value = "${websocket.brokers:/topic}")
    private String               brokers;

    @Value(value = "${websocket.destination-prefixes:/app}")
    private String               destinationPrefixes;

    @Value(value = "${websocket.api-key:bf649d52-3057-40f2-b3f0-8c84865b4946}")
    private String               API_KEY;

    private static final String  SEND_REAL_TIME_ALARM = "/alarms/";

    private WebSocketStompClient stompClient;

    private StompSession         stompSession;
    
    public WebSocketService() {
        List<Transport> transports = new ArrayList<Transport>(1);
        transports.add(new WebSocketTransport(new StandardWebSocketClient()));
        this.stompClient = new WebSocketStompClient(new SockJsClient(transports));
        this.stompClient.setMessageConverter(new MappingJackson2MessageConverter());
    }

    public void sendRealtimeAlarm(String host, int port, RealTimeAlarmsDto item) throws InterruptedException, ExecutionException, TimeoutException {
        if (item == null) {
            throw new IllegalArgumentException("alarm data is null!");
        }

        List<RealTimeAlarmsDto> items = new ArrayList<RealTimeAlarmsDto>();
        items.add(item);

        sendRealtimeAlarms(host, port, items);
    }

    public void sendRealtimeAlarm(String host, int port, RealTimeAlarmsDto item, long userNo)
            throws InterruptedException, ExecutionException, TimeoutException {
        if (item == null) {
            throw new IllegalArgumentException("alarm data is null!");
        }

        List<RealTimeAlarmsDto> items = new ArrayList<RealTimeAlarmsDto>();
        items.add(item);

        sendRealtimeAlarms(host, port, items, userNo);
    }

    public void sendRealtimeAlarms(String host, int port, List<RealTimeAlarmsDto> items)
            throws InterruptedException, ExecutionException, TimeoutException {
        if (stompSession == null || !stompSession.isConnected()) {
            String url = "ws://" + host + ":" + port + endPoints;
            WebSocketHttpHeaders handshakeHeaders = new WebSocketHttpHeaders();
            StompHeaders connectHeaders = new StompHeaders();
            handshakeHeaders.add("x-api-key", API_KEY);

            stompSession = stompClient.connect(url, handshakeHeaders, connectHeaders, new StompSessionHandlerAdapter() {}).get(1, SECONDS);
        }

        String payload = new GsonBuilder().create().toJson(items, new TypeToken<List<RealTimeAlarmsDto>>() {}.getType());

        stompSession.send(destinationPrefixes + SEND_REAL_TIME_ALARM, payload);
    }

    public void sendRealtimeAlarms(String host, int port, List<RealTimeAlarmsDto> items, long userNo)
            throws InterruptedException, ExecutionException, TimeoutException {
        if (stompSession == null || !stompSession.isConnected()) {
            String url = "ws://" + host + ":" + port + endPoints;
            WebSocketHttpHeaders handshakeHeaders = new WebSocketHttpHeaders();
            StompHeaders connectHeaders = new StompHeaders();
            handshakeHeaders.add("x-api-key", API_KEY);

            stompSession = stompClient.connect(url, handshakeHeaders, connectHeaders, new StompSessionHandlerAdapter() {}).get(1, SECONDS);
        }

        String payload = new GsonBuilder().create().toJson(items, new TypeToken<List<RealTimeAlarmsDto>>() {}.getType());

        stompSession.send(destinationPrefixes + SEND_REAL_TIME_ALARM + userNo, payload);
    }
    
}
