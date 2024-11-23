package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CustomSubmissionQueryDTO {
    private String submissionId;

    private String userId;
}
