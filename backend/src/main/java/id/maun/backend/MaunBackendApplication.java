package id.maun.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class MaunBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(MaunBackendApplication.class, args);
	}

}
