package pl.agh.edu.wi.informatyka.codequest.sourcecode;

import lombok.Getter;

@Getter
public enum Language {
    PYTHON("71"),
    CPP("50");

    private final String languageId;

    Language(String languageId) {
        this.languageId = languageId;
    }
}
