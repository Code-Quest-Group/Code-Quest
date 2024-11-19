package pl.agh.edu.wi.informatyka.codequest.problem.dto;

import jakarta.persistence.Column;
import java.util.List;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class CreateProblemDTO {
    String problemId;

    String name;

    String description;

    List<Language> supportedLanguages;

    String inputFormat;

    @Column(name = "test_cases", nullable = false, columnDefinition = "text")
    String testCases;

    @Column(name = "expected_result", nullable = false, columnDefinition = "text")
    String expectedResult;
}
