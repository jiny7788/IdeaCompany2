package com.ideacompany.etm.dto;

import org.apache.kafka.common.serialization.Deserializer;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

public class BaseEventDeserializer implements Deserializer<BaseEvent> {

	@Override
	public BaseEvent deserialize(String topic, byte[] data) {
		BaseEvent o = null;
		Gson gson = new GsonBuilder()
				.registerTypeAdapter(int.class, new EmptyStringToNumberTypeAdapter())
				.registerTypeAdapter(Integer.class, new EmptyStringToNumberTypeAdapter())
				.registerTypeAdapter(long.class, new EmptyStringToLongTypeAdapter())
				.registerTypeAdapter(Long.class, new EmptyStringToLongTypeAdapter())
				.create();
		
		try {
			String json = new String(data);
			o = gson.fromJson(json, BaseEvent.class);
		} catch (Exception e) {
			e.printStackTrace();
		}
		return o;

	}

}
