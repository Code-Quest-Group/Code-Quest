package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import lombok.Data;

@Tag(name = "Result of code submission")
@Data
@SuppressWarnings("java:S116")
public class SubmissionResultDTO {
    String userId;
    String problemId;

    // all attributes below are exactly the same as Judge0 /submissions attributes
    String stdout;
    String stderr;
    String compile_output;
    String message;
    Integer exit_code;
    Integer exit_signal;
    Status status;
    LocalDateTime created_at;
    LocalDateTime finished_at;
    String token;
    Double time;
    Double wall_time;
    Double memory;

    @Data
    public static class Status {
        Long id;
        String description;
    }
}
