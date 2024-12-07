package pl.agh.edu.wi.informatyka.codequest.user.model;

import java.time.LocalDateTime;

public record UserView(String userId, String username, LocalDateTime lastLogin) {}
