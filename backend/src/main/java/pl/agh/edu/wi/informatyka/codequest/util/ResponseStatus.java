package pl.agh.edu.wi.informatyka.codequest.util;

import com.fasterxml.jackson.annotation.JsonValue;

public enum ResponseStatus {
    OK("ok"),
    ERROR("error");

    private final String value;

    ResponseStatus(String value) {
        this.value = value;
    }

    @JsonValue
    public String getValue() {
        return value;
    }
}
