package pl.agh.edu.wi.informatyka.codequest.submission.model;

import java.util.ArrayList;
import java.util.List;
import lombok.Data;

@Data
public class SubmissionResult {
    List<String> userStdout = new ArrayList<>();

    List<String> testAnswers = new ArrayList<>();

    String errorMessage = null;

    List<String> systemAnswers = new ArrayList<>();
}
