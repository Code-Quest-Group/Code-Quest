package pl.agh.edu.wi.informatyka.codequest.user;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import java.util.List;
import java.util.Objects;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import pl.agh.edu.wi.informatyka.codequest.user.dto.UpdateUserPreferencesDTO;
import pl.agh.edu.wi.informatyka.codequest.user.dto.UserStatisticsDTO;
import pl.agh.edu.wi.informatyka.codequest.user.model.User;
import pl.agh.edu.wi.informatyka.codequest.user.model.UserView;

@RestController
@Tag(name = "Users")
public class UserController {
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/user")
    public List<UserView> getUser() {
        return this.userService.getAllUserViews();
    }

    @GetMapping("/user/{userId}")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public User getUser(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        return this.userService.getUserOrThrow(user, userId);
    }

    @GetMapping("/user/{userId}/statistics")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public UserStatisticsDTO getUserStatistics(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        User pathUser = this.userService
                .getUser(userId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "User with id '" + userId + "' not found"));
        if ((user == null || !Objects.equals(user.getUserId(), userId))
                && !pathUser.getPreferences().getIsProfilePublic()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        return this.userService.getUserStatistics(userId);
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping("/user/{userId}/preferences")
    @Operation(security = @SecurityRequirement(name = "bearerAuth"))
    public ResponseEntity<?> getUserStatistics(
            @AuthenticationPrincipal User user,
            @RequestBody UpdateUserPreferencesDTO updateUserPreferencesDTO,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        if (!user.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED);
        }
        updateUserPreferencesDTO.setUser(user);
        this.userService.updateUserPreferences(updateUserPreferencesDTO);
        return ResponseEntity.ok("ok");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/user/{userId}/ban")
    @Operation(
            security = @SecurityRequirement(name = "adminBearerAuth"),
            description = "Bans the user - prevents him for all interaction with the app")
    public ResponseEntity<?> banUser(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        this.userService.banUser(user, userId);
        return ResponseEntity.ok("ok");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PatchMapping("/user/{userId}/unban")
    @Operation(security = @SecurityRequirement(name = "adminBearerAuth"), description = "Unbans the user.")
    public ResponseEntity<?> unbanUser(
            @AuthenticationPrincipal User user,
            @PathVariable @Parameter(example = "7aba9807-b018-4923-a6db-421c7e232237") String userId) {
        this.userService.unbanUser(user, userId);
        return ResponseEntity.ok("ok");
    }
}
