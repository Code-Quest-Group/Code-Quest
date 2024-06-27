package pl.agh.edu.wi.informatyka.codequest.util;

/**
 * Class that holds example data for swagger
 *
 * <p>Quotes " " in json strings must be escaped because java swagger breaks without them
 */
public class DataExamples {
    private DataExamples() {}

    public static class AddTwo {
        public static final String VALID_SOLUTION =
                """
                {
                    \"sourceCode\": \"class Problem:\\n    def solve(self, a, b):\\n        return a + b\\n\\n\",
                    \"problemId\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String RANDOM_FAIL =
                """
                {
                    \"sourceCode\": \"import random\\n\\nclass Problem:\\n    def solve(self, a, b):\\n        return a + b + random.randint(1, 15)//10\\n\\n\",
                    \"problemId\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String INVALID_SOLUTION =
                """
                {
                    \"sourceCode\": \"class Problem:\\n    def solve(self, a, b):\\n        return a - b\\n\\n\",
                    \"problemId\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String INFINITE_LOOP =
                """
                {
                    \"sourceCode\": \"class Problem:\\n    def solve(self, a, b):\\n        while True:            a = 1\\n        return a + b\\n\\n",
                    \"problemId\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
    }

    public static class NthFibonacci {
        public static final String VALID_SOLUTION =
                """
                {
                    \"sourceCode\": \"class Problem:\\n    \\n    def solve(self, n):\\n        if n < 2:\\n            return n\\n        \\n        return self.solve(n - 1) + self.solve(n - 2)\\n\\n\",
                    \"problemId\": \"nth-fibonacci-number\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String INVALID_SOLUTION =
                """
                {
                    \"sourceCode\": \"class Problem:\\n    def solve(self, n):\\n        return n\\n\\n\",
                    \"problemId\": \"nth-fibonacci-number\",
                    \"language\": \"PYTHON\"
                }\
                """;
    }
}
