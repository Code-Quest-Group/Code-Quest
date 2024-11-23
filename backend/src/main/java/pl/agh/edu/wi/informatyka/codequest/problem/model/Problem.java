package pl.agh.edu.wi.informatyka.codequest.problem.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.apache.commons.lang3.builder.HashCodeExclude;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;
import pl.agh.edu.wi.informatyka.codequest.submission.model.Submission;
import pl.agh.edu.wi.informatyka.codequest.util.LanguageListConverter;

@Entity
@Table(name = "problems")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Problem {

    @Id
    @Column(name = "problem_id")
    String problemId;

    @Column(nullable = false)
    String name;

    @Column(nullable = false, columnDefinition = "text")
    String description;

    @Convert(converter = LanguageListConverter.class)
    @Column(name = "supported_languages")
    List<Language> supportedLanguages;

    @Column(name = "input_format", nullable = false)
    String inputFormat;

    @Column(name = "code_template", nullable = false, columnDefinition = "text")
    String codeTemplate;

    @Column(name = "test_cases", nullable = false, columnDefinition = "text")
    String testCases;

    @Column(name = "expected_result", nullable = false, columnDefinition = "text")
    String expectedResult;

    @JsonIgnore()
    @OneToMany(mappedBy = "problem", cascade = CascadeType.REMOVE, orphanRemoval = true)
    @HashCodeExclude
    List<Submission> submissions;
}
