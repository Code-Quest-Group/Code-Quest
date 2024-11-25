package pl.agh.edu.wi.informatyka.codequest.util.converter;

import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Converter
public class EnumListConverter<E extends Enum<E>> implements AttributeConverter<List<E>, String> {

    private final Class<E> enumType;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public EnumListConverter(Class<E> enumType) {
        this.enumType = enumType;
        objectMapper.enable(SerializationFeature.WRITE_ENUMS_USING_TO_STRING);
        objectMapper.enable(DeserializationFeature.READ_ENUMS_USING_TO_STRING);
    }

    @Override
    public String convertToDatabaseColumn(List<E> attribute) {
        if (attribute == null) {
            return "[]";
        }
        try {
            return objectMapper.writeValueAsString(attribute);
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to convert enum array to JSON", e);
        }
    }

    @Override
    public List<E> convertToEntityAttribute(String dbData) {
        if (dbData == null || dbData.isEmpty()) {
            return new ArrayList<>();
        }
        try {
            return objectMapper.readValue(
                    dbData, objectMapper.getTypeFactory().constructCollectionType(List.class, enumType));
        } catch (IOException e) {
            throw new IllegalArgumentException("Failed to convert JSON to enum array: " + dbData, e);
        }
    }
}
