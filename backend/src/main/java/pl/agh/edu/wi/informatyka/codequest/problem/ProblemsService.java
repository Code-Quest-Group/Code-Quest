package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Service
public class ProblemsService {

    private static final String addTwoCodeTemplate =
            """
            class Problem:

                def solve(self, a: int, b: int):
                    pass


            """;

    private static final String fibonacciCodeTemplate =
            """
            class Problem:

                def solve(self, n: int):
                    pass


            """;

    private static final String countDivisorsCodeTemplate =
            """
            class Problem:

                def solve(self, n: int, k: int):
                    pass


            """;

    // this is a database lmao
    Map<String, Problem> problems = Map.of(
            "add-two-numbers",
            new Problem(
                    "add-two-numbers",
                    "Add two numbers",
                    "Calculate the sum of two numbers",
                    List.of(Language.PYTHON),
                    "int int",
                    addTwoCodeTemplate,
                    "1\n6\n2\n2\n3\n7\n4\n2\n5\n3\n",
                    "7\n4\n10\n6\n8\n"),
            "nth-fibonacci-number",
            new Problem(
                    "nth-fibonacci-number",
                    "Nth Fibonacci number",
                    "Find nth fibonacci number.",
                    List.of(Language.PYTHON),
                    "int",
                    fibonacciCodeTemplate,
                    "0\n1\n2\n3\n4\n5\n10\n18\n",
                    "0\n1\n1\n2\n3\n5\n55\n2584"),
            "count-divisors",
            new Problem(
                    "count-divisors",
                    "Count divisors",
                    "Count how many numbers less then n are divisible by k",
                    List.of(Language.PYTHON),
                    "int int",
                    countDivisorsCodeTemplate,
                    "10\n2\n100\n25\n", // two test cases n,k   10, 2 and 100, 25
                    "4\n3\n"));

    public List<Problem> getProblems() {
        return new ArrayList<>(problems.values());
    }

    public Problem getProblem(String problemId) {
        Problem problem = problems.get(problemId);
        if (problem == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Problem " + problemId + " not found");
        }
        return problem;
    }
}
