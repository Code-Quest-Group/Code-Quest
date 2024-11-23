package pl.agh.edu.wi.informatyka.codequest;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import jakarta.annotation.PostConstruct;
import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.context.event.EventListener;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerAdapter;

@SpringBootApplication
public class CodeQuestApplication {

    public CodeQuestApplication(RequestMappingHandlerAdapter handlerAdapter) {
        this.handlerAdapter = handlerAdapter;
    }

    public static void main(String[] args) {
        SpringApplication.run(CodeQuestApplication.class, args);
    }

    @PostConstruct
    void started() {
        TimeZone.setDefault(TimeZone.getTimeZone("Etc/UTC"));
    }

    private final RequestMappingHandlerAdapter handlerAdapter;

    @EventListener
    public void handleContextRefresh(ContextRefreshedEvent event) {
        handlerAdapter
                .getMessageConverters()
                .forEach(c -> {
                    if (c instanceof MappingJackson2HttpMessageConverter jsonMessageConverter) {
                        ObjectMapper objectMapper = jsonMessageConverter.getObjectMapper();
                        objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
                    }
                });
    }
}
