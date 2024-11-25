package pl.agh.edu.wi.informatyka.codequest.problemrating.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class CreateProblemRatingDTO {

    @Max(5)
    @Min(1)
    double rating;
}
