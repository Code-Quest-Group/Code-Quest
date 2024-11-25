package pl.agh.edu.wi.informatyka.codequest.comment.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import pl.agh.edu.wi.informatyka.codequest.comment.dto.CreateCommentDTO;
import pl.agh.edu.wi.informatyka.codequest.problem.model.Problem;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@Entity
@Table(name = "comments")
@Data
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty("comment_id")
    private String commentId;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    User user;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "problem_id", nullable = false)
    Problem problem;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false, columnDefinition = "text")
    private String content;

    @JsonProperty("created_at")
    @CreationTimestamp
    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public static Comment fromCreateCommentDTO(CreateCommentDTO createCommentDTO) {
        Comment comment = new Comment();
        comment.setUser(createCommentDTO.getUser());
        comment.setAuthor(createCommentDTO.getUser().getUsername());
        comment.setProblem(createCommentDTO.getProblem());
        comment.setContent(createCommentDTO.getContent());
        return comment;
    }
}
