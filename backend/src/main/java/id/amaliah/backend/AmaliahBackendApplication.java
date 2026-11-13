package id.amaliah.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class AmaliahBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(AmaliahBackendApplication.class, args);
	}

}
