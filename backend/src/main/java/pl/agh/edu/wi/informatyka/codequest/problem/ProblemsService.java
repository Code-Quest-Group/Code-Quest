package pl.agh.edu.wi.informatyka.codequest.problem;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.Problem;
import pl.agh.edu.wi.informatyka.codequest.sourcecode.Language;

@Service
public class ProblemsService {

    private final String codeTemplate =
            """
            class Problem:

                def solve(self, a: int, b: int):
                    pass


            """;

    // this is a database lmao
    Map<String, Problem> problems = Map.of(
            "add-two-numbers",
            new Problem(
                    "add-two-numbers",
                    "Add two numbers",
                    "This problem requires calculating the sum of two numbers",
                    List.of(Language.PYTHON),
                    "int int",
                    codeTemplate,
                    "1\n6\n2\n2\n3\n7\n4\n2\n5\n3\n",
                    "7\n4\n10\n6\n8\n"));

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
