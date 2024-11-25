package pl.agh.edu.wi.informatyka.codequest.comment.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Data
public class CreateCommentDTO {
    @NotBlank
    @Size(max = 10000, message = "Content must not exceed 10,000 characters.")
    private String content;

    @Schema(hidden = true)
    private User user;

    @Schema(hidden = true)
    private Problem problem;

    @Schema(hidden = true)
    private String problemId;
}
