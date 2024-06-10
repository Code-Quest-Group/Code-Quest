package pl.agh.edu.wi.informatyka.codequest;

import java.util.List;
import lombok.Data;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Data
public class Problem {
    String problemName;
    String problemDescription;
    List<Language> supportedLanguages;
    String testCases;
    String expectedResult;

    public Problem(
            String problemName,
            String problemDescription,
            List<Language> supportedLanguages,
            String testCases,
            String expectedResult) {
        this.problemName = problemName;
        this.problemDescription = problemDescription;
        this.supportedLanguages = supportedLanguages;
        this.testCases = testCases;
        this.expectedResult = expectedResult;
    }

    public static Problem addTwoNumbers = new Problem(
            "Add two numbers",
            "This problem requires calculating the sum of two numbers",
            List.of(Language.PYTHON),
            """
                    1,6
                    2,2
                    3,7
                    4,2
                    5,3
                    """,
            """
                    7
                    4
                    10
                    6
                    8
                    """);
}
