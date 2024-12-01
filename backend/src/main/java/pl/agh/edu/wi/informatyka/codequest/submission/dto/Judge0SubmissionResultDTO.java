package pl.agh.edu.wi.informatyka.codequest.submission.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.time.Instant;
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

    @JsonProperty("status")
    Judge0Status judge0Status;

    @JsonProperty("created_at")
    Instant createdAt;

    @JsonProperty("finished_at")
    Instant finishedAt;

    String token;
    Float time;

    @JsonProperty("wall_time")
    Float wallTime;

    Float memory;

    @Data
    @AllArgsConstructor
    public static class Judge0Status {
        Integer id;
        String description;
    }

    @Override
    public String toString() {
        return "Judge0SubmissionResultDTO{" + "stderr='"
                + stderr + '\'' + ", compileOutput='"
                + compileOutput + '\'' + ", message='"
                + message + '\'' + ", exitCode="
                + exitCode + ", exitSignal="
                + judge0Status + ", createdAt="
                + createdAt + ", finishedAt="
                + finishedAt + ", token='"
                + token + '\'' + ", time="
                + time + ", memory="
                + memory + '}';
    }
}
