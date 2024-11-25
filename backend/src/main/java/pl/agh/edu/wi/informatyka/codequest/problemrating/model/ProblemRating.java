package pl.agh.edu.wi.informatyka.codequest.problemrating.model;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "problem_ratings")
public class ProblemRating {

    @EmbeddedId
    private ProblemRatingId id;

    private double rating;
}
