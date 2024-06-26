package pl.agh.edu.wi.informatyka.codequest;

/**
 * Class that holds example data for swagger
 *
 * <p>Quotes " " in json strings must be escaped because java swagger breaks without them
 */
public class ExampleData {
    private ExampleData() {}

    public static final String PROBLEM_SUBMISSION_BODY =
            """
            {
                \"sourceCode\": \"class Problem:\\n    def solve(self, a, b):\\n        return a + b\\n\\n\",
                \"problemId\": \"1\",
                \"language\": \"PYTHON\"
            }\
            """;
}
