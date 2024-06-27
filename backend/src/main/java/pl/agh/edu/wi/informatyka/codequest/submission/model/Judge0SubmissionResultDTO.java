package pl.agh.edu.wi.informatyka.codequest.submission.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

@Tag(name = "Judge0 result of code submission")
@Data
@SuppressWarnings("java:S116")
public class Judge0SubmissionResultDTO {
    String stdout;
    String stderr;

    @JsonProperty("compile_output")
    String compileOutput;

    String message;

    @JsonProperty("exit_code")
    Integer exitCode;

    @JsonProperty("exit_signal")
    Integer exitSignal;

    Status status;

    @JsonProperty("created_at")
    LocalDateTime createdAt;

    @JsonProperty("finished_at")
    LocalDateTime finishedAt;

    String token;
    Double time;

    @JsonProperty("wall_time")
    Double wallTime;

    Double memory;

    @Data
    @AllArgsConstructor
    public static class Status {
        Long id;
        String description;
    }
}
