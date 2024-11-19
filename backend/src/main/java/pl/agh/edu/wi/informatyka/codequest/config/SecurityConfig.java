package pl.agh.edu.wi.informatyka.codequest.config;

import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import pl.agh.edu.wi.informatyka.codequest.auth.jwt.JwtAuthenticationFilter;
import pl.agh.edu.wi.informatyka.codequest.auth.oauth2.OAuth2LoginFailureHandler;
import pl.agh.edu.wi.informatyka.codequest.auth.oauth2.OAuth2LoginSuccessHandler;
import pl.agh.edu.wi.informatyka.codequest.user.model.Role;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler;
    private final OAuth2LoginFailureHandler oAuth2LoginFailureHandler;
    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(
            OAuth2LoginSuccessHandler oAuth2LoginSuccessHandler,
            OAuth2LoginFailureHandler oAuth2LoginFailureHandler,
            JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.oAuth2LoginSuccessHandler = oAuth2LoginSuccessHandler;
        this.oAuth2LoginFailureHandler = oAuth2LoginFailureHandler;
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authorizeHttpRequests(authorize -> authorize
                        .requestMatchers(HttpMethod.PUT, "/submissions/webhook")
                        .permitAll()
                        .requestMatchers(HttpMethod.POST, "/submissions/")
                        .hasAnyRole(Role.USER.name(), Role.ADMIN.name())
                        .requestMatchers("/submissions/**", "/user/**")
                        .hasAnyRole(Role.USER.name(), Role.ADMIN.name())
                        .requestMatchers(HttpMethod.POST, "/problems/**")
                        .hasRole(Role.ADMIN.name())
                        .requestMatchers(HttpMethod.DELETE, "/problems/**")
                        .hasRole(Role.ADMIN.name())
                        .anyRequest()
                        .permitAll())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(
                        exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedEntryPoint()))
                .oauth2Login(oauth2 ->
                        oauth2.successHandler(oAuth2LoginSuccessHandler).failureHandler(oAuth2LoginFailureHandler))
                .logout(logout -> logout.logoutSuccessUrl("/api")
                        .invalidateHttpSession(false)
                        .clearAuthentication(true)
                        .deleteCookies("JSESSIONID", "JWT"))
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationEntryPoint unauthorizedEntryPoint() {
        return (request, response, authException) -> {
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Unauthorized\"}");
        };
    }
}
