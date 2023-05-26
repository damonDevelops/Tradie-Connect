package CSIT3214.GroupProject;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
//@EnableWebSecurity
public class TradieFinderApplication {

	public static void main(String[] args) {
		SpringApplication.run(TradieFinderApplication.class, args);
	}

}
