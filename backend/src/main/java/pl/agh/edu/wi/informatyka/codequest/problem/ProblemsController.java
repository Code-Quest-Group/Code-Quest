package pl.agh.edu.wi.informatyka.codequest.problem;

import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.edu.wi.informatyka.codequest.Problem;

@RestController()
@RequestMapping("/problems")
@Tag(name = "Problems")
public class ProblemsController {
    private final ProblemsService problemsService;

    public ProblemsController(ProblemsService problemsService) {
        this.problemsService = problemsService;
    }

    @GetMapping("/{problemId}")
    public Problem getProblems(@PathVariable @Parameter(example = "add-two-numbers") String problemId) {
        return problemsService.getProblem(problemId);
    }

    @GetMapping()
    public List<Problem> getProblem() {
        return problemsService.getProblems();
    }
}
