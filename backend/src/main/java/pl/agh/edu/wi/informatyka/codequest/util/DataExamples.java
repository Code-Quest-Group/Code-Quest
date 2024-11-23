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
                    \"source_code\": \"class Problem:\\n    def solve(self, a, b):\\n        return a + b\\n\\n\",
                    \"problem_id\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String ONE_WRONG_SOLUTION =
                """
                {
                    \"source_code\": \"class Problem:\\n    def solve(self, a, b):\\n        return a + b if a != 697387 else 0\\n\\n\",
                    \"problem_id\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String RANDOM_FAIL =
                """
                {
                    \"source_code\": \"import random\\n\\nclass Problem:\\n    def solve(self, a, b):\\n        return a + b + random.randint(1, 15)//10\\n\\n\",
                    \"problem_id\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String INVALID_SOLUTION =
                """
                {
                    \"source_code\": \"class Problem:\\n    def solve(self, a, b):\\n        return a - b\\n\\n\",
                    \"problem_id\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String INFINITE_LOOP =
                """
                {
                    \"source_code\": \"class Problem:\\n    def solve(self, a, b):\\n        while True:            a = 1\\n        return a + b\\n\\n",
                    \"problem_id\": \"add-two-numbers\",
                    \"language\": \"PYTHON\"
                }\
                """;
    }

    public static class NthFibonacci {
        public static final String VALID_SOLUTION =
                """
                {
                    \"source_code\": \"class Problem:\\n    \\n    def solve(self, n):\\n        if n < 2:\\n            return n\\n        \\n        return self.solve(n - 1) + self.solve(n - 2)\\n\\n\",
                    \"problem_id\": \"nth-fibonacci-number\",
                    \"language\": \"PYTHON\"
                }\
                """;
        public static final String s =
                "class Problem:\n    \n    def solve(self, n):\n        if n < 2:\n            return n\n        \n        return self.solve(n - 1) + self.solve(n - 2)\n\n";
        public static final String INVALID_SOLUTION =
                """
                {
                    \"source_code\": \"class Problem:\\n    def solve(self, n):\\n        return n\\n\\n\",
                    \"problem_id\": \"nth-fibonacci-number\",
                    \"language\": \"PYTHON\"
                }\
                """;
    }
}
