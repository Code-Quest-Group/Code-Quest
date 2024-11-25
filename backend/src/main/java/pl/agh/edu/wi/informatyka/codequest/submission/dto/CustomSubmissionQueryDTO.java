package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Data
@AllArgsConstructor
public class CustomSubmissionQueryDTO {
    private String submissionId;

    private User user;
}
