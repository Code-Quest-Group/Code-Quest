package pl.agh.edu.wi.informatyka.codequest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;

@SpringBootApplication
@EnableWebMvc
public class CodeQuestApplication {

    public static void main(String[] args) {
        SpringApplication.run(CodeQuestApplication.class, args);
    }
}
