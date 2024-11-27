package pl.agh.edu.wi.informatyka.codequest.comment;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import java.util.Collections;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import pl.agh.edu.wi.informatyka.codequest.comment.dto.CreateCommentDTO;
import pl.agh.edu.wi.informatyka.codequest.comment.model.Comment;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@RestController()
@RequestMapping("/problems/{problemId}/comments")
@Tag(name = "Comments")
public class CommentsController {
    private final CommentsService commentsService;

    public CommentsController(CommentsService commentsService) {
        this.commentsService = commentsService;
    }

    @GetMapping
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    List<Comment> getComments(@PathVariable @Parameter(example = "add-two-numbers") String problemId) {
        return commentsService.getComments(problemId);
    }

    @PostMapping
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<?> createComment(
            @PathVariable @Parameter(example = "add-two-numbers") String problemId,
            @Valid @RequestBody CreateCommentDTO createCommentDTO,
            @AuthenticationPrincipal User user) {
        createCommentDTO.setProblemId(problemId);
        createCommentDTO.setUser(user);
        Comment comment = this.commentsService.createComment(createCommentDTO);
        return ResponseEntity.ok(Collections.singletonMap("comment_id", comment.getCommentId()));
    }

    @DeleteMapping("{commentId}")
    @Operation(
            description = "Delete a comment, MODERATOR or ADMIN can delete other user comments",
            security = @SecurityRequirement(name = "bearerAuth"))
    ResponseEntity<?> deleteComment(
            @PathVariable @Parameter(example = "add-two-numbers") String problemId,
            @PathVariable String commentId,
            @AuthenticationPrincipal User user) {

        this.commentsService.deleteComment(commentId, problemId, user);
        return ResponseEntity.ok("ok");
    }
}
