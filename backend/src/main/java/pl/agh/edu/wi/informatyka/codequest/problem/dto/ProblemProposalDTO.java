package pl.agh.edu.wi.informatyka.codequest.problem.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import java.util.List;
import lombok.Data;
import org.hibernate.validator.constraints.Length;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Data
public class ProblemProposalDTO {
    @Length(min = 5, max = 100, message = "ProblemId must be must have between 5 and 100 characters")
    @Pattern(regexp = "^[a-z](-?[a-z])*[a-z]$", message = "Problem ID must contain only lowercase letters and hyphens.")
    String problemId;

    @NotBlank
    String name;

    @NotBlank
    String description;

    @JsonProperty("supported_language")
    Language supportedLanguage;

    @JsonProperty("input_format")
    String inputFormat;

    @Pattern(regexp = "(.|\n)*Problem(.|\n)*", message = "The code template class name must be Problem")
    @JsonProperty("code_template")
    String codeTemplate;

    @Pattern(
            regexp = "(.|\n)*InternalProblem(.|\n)*",
            message = "The reference solution class name must be InternalProblem")
    @JsonProperty("reference_solution")
    String referenceSolution;

    @NotBlank
    @JsonProperty("test_cases")
    String testCases;

    //    @JsonProperty("expected_result")
    //    String expectedResult;

    List<String> tags;

    String constraints;

    List<String> hints;

    @JsonProperty("example_testcases")
    String exampleTestcases;

    @NotEmpty
    @JsonProperty("example_expected_result")
    List<String> exampleExpectedResult;

    @Schema(hidden = true)
    User author;
}
