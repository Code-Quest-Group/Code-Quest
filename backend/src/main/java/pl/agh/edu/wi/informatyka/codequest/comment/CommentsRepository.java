package pl.agh.edu.wi.informatyka.codequest.comment;

import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import pl.agh.edu.wi.informatyka.codequest.comment.model.Comment;

public interface CommentsRepository extends JpaRepository<Comment, String> {
    List<Comment> findByProblem_ProblemId(String problemId);
}
