package pl.wat.pz.pacman.PacmanServer;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.servlet.FilterRegistrationBean;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import pl.wat.pz.pacman.PacmanServer.database.repository.AccountRepository;
import pl.wat.pz.pacman.PacmanServer.security.UrlFilterAuthorized;
import pl.wat.pz.pacman.PacmanServer.security.UrlFilterUnauthorized;

@SuppressWarnings("deprecation")
@SpringBootApplication
@EnableWebMvc
public class PacmanServerApplication {
	
	@Bean
    public BCryptPasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	@Bean
	public FilterRegistrationBean<UrlFilterUnauthorized> urlUnauthFilter() {
		FilterRegistrationBean<UrlFilterUnauthorized> urlBean = new FilterRegistrationBean<>();
		urlBean.setFilter(new UrlFilterUnauthorized());
		urlBean.addUrlPatterns("/users/*");

		return urlBean;
	}
	
	@Bean
	public FilterRegistrationBean<UrlFilterAuthorized> urlAuthFilter() {
		FilterRegistrationBean<UrlFilterAuthorized> urlBean = new FilterRegistrationBean<>();
		urlBean.setFilter(new UrlFilterAuthorized());
		urlBean.addUrlPatterns("/rank/*");
		urlBean.addUrlPatterns("/game/*");
		urlBean.getFilter().accountRepository = accountRepository;

		return urlBean;
	}
	
	@Bean
	public WebMvcConfigurer corsConfigurer() {
	    return new WebMvcConfigurerAdapter() {
	        @Override
	        public void addCorsMappings(CorsRegistry registry) {
	            registry.addMapping("/**").allowedOrigins("http://localhost:4200");
	        }
	    };
	}
	
	@Autowired
	AccountRepository accountRepository;
	
	
	
	public static void main(String[] args) {
		SpringApplication.run(PacmanServerApplication.class, args);
	}

}
