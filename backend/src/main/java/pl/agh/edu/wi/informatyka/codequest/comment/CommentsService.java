package pl.agh.edu.wi.informatyka.codequest.comment;

import java.util.List;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.comment.dto.CreateCommentDTO;
import pl.agh.edu.wi.informatyka.codequest.comment.model.Comment;
import pl.agh.edu.wi.informatyka.codequest.problem.ProblemsService;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.user.model.Role;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Service
public class CommentsService {
    Logger logger = LoggerFactory.getLogger(CommentsService.class);

    private final CommentsRepository commentsRepository;
    private final ProblemsService problemsService;

    public CommentsService(CommentsRepository commentsRepository, ProblemsService problemsService) {
        this.commentsRepository = commentsRepository;
        this.problemsService = problemsService;
    }

    public List<Comment> getComments(String problemId) {
        return this.commentsRepository.findByProblem_ProblemId(problemId);
    }

    public Comment createComment(CreateCommentDTO createCommentDTO) {
        Problem problem = this.problemsService.getProblemOrThrow(createCommentDTO.getProblemId());
        createCommentDTO.setProblem(problem);

        Comment comment = Comment.fromCreateCommentDTO(createCommentDTO);

        comment = this.commentsRepository.save(comment);
        this.logger.info(
                "Comment created by user {} for problem '{}'", comment.getAuthor(), createCommentDTO.getProblemId());

        return comment;
    }

    public void deleteComment(String commentId, String problemId, User user) {
        this.commentsRepository.findById(commentId).ifPresent(comment -> {
            // ADMIN and MODERATOR can delete other people comments
            if (user.getUserRole() == Role.USER
                    && !comment.getUser().getUserId().equals(user.getUserId())) {
                throw new ResponseStatusException(
                        HttpStatus.FORBIDDEN, "You do not have permission to delete this resource");
            }
            this.commentsRepository.deleteById(commentId);
            this.logger.info("Comment {} deleted", commentId);
        });
    }
}
