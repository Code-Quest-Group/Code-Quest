package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import lombok.Getter;

@Getter
public enum Language {
    PYTHON("71", "3.11.2"),
    JAVASCRIPT("63", "Node.js 12.14.0"),
    JAVA("62", "OpenJDK 13.0.1"),
    CPP("52", "GCC 7.4.0");

    private final String languageId;
    private final String version;

    Language(String languageId, String version) {
        this.languageId = languageId;
        this.version = version;
    }
}
