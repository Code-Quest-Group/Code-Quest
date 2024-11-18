package pl.agh.edu.wi.informatyka.codequest.util;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor
public class GenericResponse<T> {
    private ResponseStatus status;
    private String message;
    private T data;
}
