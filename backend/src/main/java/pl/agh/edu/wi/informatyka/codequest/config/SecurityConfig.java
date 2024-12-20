package pl.agh.edu.wi.informatyka.codequest.config;

import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
    private final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

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
                        .requestMatchers("/actuator/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.PUT, "/judge0/webhook")
                        .permitAll()
                        .requestMatchers(
                                "/auth/**",
                                "/error",
                                "/swagger-ui/**",
                                "/v3/api-docs*/**",
                                "/api",
                                "/",
                                "/favicon.ico",
                                "/user")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/problems/**")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/problems")
                        .permitAll()
                        .requestMatchers(HttpMethod.GET, "/user/**")
                        .permitAll()
                        .anyRequest()
                        .authenticated())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .csrf(AbstractHttpConfigurer::disable)
                .exceptionHandling(
                        exceptionHandling -> exceptionHandling.authenticationEntryPoint(unauthorizedEntryPoint()))
                //                .oauth2Login(oauth2 ->
                //
                // oauth2.successHandler(oAuth2LoginSuccessHandler).failureHandler(oAuth2LoginFailureHandler))
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
            String clientIp = request.getRemoteAddr();

            logger.warn(
                    "Unauthorized access attempt to: {} {}, from IP: {}",
                    request.getMethod(),
                    request.getRequestURI(),
                    clientIp);

            logger.error(">>> {}", authException.getMessage());
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("{\"error\":\"Unauthorized\"}");
        };
    }
}
