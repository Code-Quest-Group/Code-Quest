package pl.agh.edu.wi.informatyka.codequest.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;

@RestController
@Tag(name = "Users")
public class UserController {

    @GetMapping("/user")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public User getUser(@AuthenticationPrincipal User user) {
        return user;
    }
}
