package pl.agh.edu.wi.informatyka.codequest.submission.exception;

public class SubmissionFormatException extends RuntimeException {
    public SubmissionFormatException(String submissionOutputIsEmpty) {
        super(submissionOutputIsEmpty);
    }
}
