package pl.agh.edu.wi.informatyka.codequest.submission.model;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public enum SubmissionStatus {
    IN_QUEUE(1),
    PROCESSING(2),
    ACCEPTED(3),
    WRONG_ANSWER(4),
    TIME_LIMIT_EXCEEDED(5),
    COMPILATION_ERROR(6),
    RUNTIME_ERROR_SIGSEGV(7),
    RUNTIME_ERROR_SIGXFSZ(8),
    RUNTIME_ERROR_SIGFPE(9),
    RUNTIME_ERROR_SIGABRT(10),
    RUNTIME_ERROR_NZEC(11),
    RUNTIME_ERROR_OTHER(12),
    INTERNAL_ERROR(13),
    EXEC_FORMAT_ERROR(14);

    private final int id;

    public static SubmissionStatus fromId(int id) {
        return switch (id) {
            case 1 -> IN_QUEUE;
            case 2 -> PROCESSING;
            case 3 -> ACCEPTED;
            case 4 -> WRONG_ANSWER;
            case 5 -> TIME_LIMIT_EXCEEDED;
            case 6 -> COMPILATION_ERROR;
            case 7 -> RUNTIME_ERROR_SIGSEGV;
            case 8 -> RUNTIME_ERROR_SIGXFSZ;
            case 9 -> RUNTIME_ERROR_SIGFPE;
            case 10 -> RUNTIME_ERROR_SIGABRT;
            case 11 -> RUNTIME_ERROR_NZEC;
            case 12 -> RUNTIME_ERROR_OTHER;
            case 13 -> INTERNAL_ERROR;
            case 14 -> EXEC_FORMAT_ERROR;
            default -> throw new IllegalArgumentException("Unexpected value: " + id);
        };
    }
}
