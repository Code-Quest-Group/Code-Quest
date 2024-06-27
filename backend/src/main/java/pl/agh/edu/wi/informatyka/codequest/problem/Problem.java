package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
@AllArgsConstructor
public class Problem {
    String problemId;
    String name;
    String description;
    List<Language> supportedLanguages;
    String inputFormat;
    String codeTemplate;
    String testCases;
    String expectedResult;
}
