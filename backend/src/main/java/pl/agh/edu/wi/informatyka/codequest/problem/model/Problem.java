package pl.agh.edu.wi.informatyka.codequest.problem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.user.model.UserProblemDetails;
import pl.agh.edu.wi.informatyka.codequest.util.converter.LanguageListConverter;
import pl.agh.edu.wi.informatyka.codequest.util.converter.ListToJsonConverter;

@Entity
@Table(name = "problems")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Problem {

    @Id
    @Column(name = "problem_id")
    @JsonProperty("problem_id")
    String problemId;

    @Column(nullable = false)
    String name;

    @Column(nullable = false, columnDefinition = "text")
    String description;

    @JsonProperty("supported_languages")
    @Convert(converter = LanguageListConverter.class)
    @Column(name = "supported_languages")
    List<Language> supportedLanguages;

    @JsonProperty("input_format")
    @Column(name = "input_format", nullable = false)
    String inputFormat;

    @JsonProperty("code_template")
    @Column(name = "code_template", nullable = false, columnDefinition = "text")
    @Basic(fetch = FetchType.LAZY)
    String codeTemplate;

    @JsonIgnore()
    @Column(name = "test_cases", nullable = false, columnDefinition = "mediumtext")
    @Basic(fetch = FetchType.LAZY)
    String testCases;

    @JsonIgnore()
    @Column(name = "expected_result", nullable = false, columnDefinition = "mediumtext")
    String expectedResult;

    @JsonIgnore()
    @OneToMany(mappedBy = "problem", cascade = CascadeType.REMOVE, orphanRemoval = true)
    List<Submission> submissions;

    @Column(name = "tags", columnDefinition = "text")
    @Convert(converter = ListToJsonConverter.class)
    List<String> tags;

    @Column(columnDefinition = "text")
    String constraints;

    @Column(name = "hints", columnDefinition = "text")
    @Convert(converter = ListToJsonConverter.class)
    List<String> hints;

    Double rating;

    @JsonProperty("example_testcases")
    @Column(name = "example_testcases", columnDefinition = "text")
    String exampleTestcases;

    @JsonProperty("example_expected_result")
    @Column(name = "example_expected_result", columnDefinition = "text")
    @Convert(converter = ListToJsonConverter.class)
    List<String> exampleExpectedResult;

    @Transient
    @JsonProperty("user_problem_details")
    UserProblemDetails userProblemDetails;

    @Override
    public String toString() {
        return "Problem{" + "problemId='" + problemId + '\'' + ", name='" + name + '\'' + '}';
    }
}
