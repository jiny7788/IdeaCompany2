package com.ideacompany.etm.dto;

import java.io.IOException;

import org.apache.commons.lang3.math.NumberUtils;

import com.google.gson.JsonSyntaxException;
import com.google.gson.TypeAdapter;
import com.google.gson.stream.JsonReader;
import com.google.gson.stream.JsonToken;
import com.google.gson.stream.JsonWriter;

public class EmptyStringToNumberTypeAdapter extends TypeAdapter<Number> {
	
	@Override
	public Number read(JsonReader reader) throws IOException {
		if (reader.peek() == JsonToken.NULL) {
			reader.nextNull();
			return null;
		}
		try {
			String value = reader.nextString();
			if (value == null || value.isEmpty() || "".equals(value)) {
				return 0;
			}
			return NumberUtils.createNumber(value);
		} catch (NumberFormatException e) {
			throw new JsonSyntaxException(e);
		}
	}
	
	@Override
	public void write(JsonWriter writer, Number value) throws IOException {
		if (value == null) {
			writer.nullValue();
			return;
		}
		writer.value(value);
	}
}