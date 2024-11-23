package pl.agh.edu.wi.informatyka.codequest.submission.model;

import lombok.Getter;

@Getter
public enum SubmissionType {
    REGULAR("REGULAR"),
    CUSTOM("CUSTOM");

    private final String submissionType;

    SubmissionType(String submissionType) {
        this.submissionType = submissionType;
    }
}
