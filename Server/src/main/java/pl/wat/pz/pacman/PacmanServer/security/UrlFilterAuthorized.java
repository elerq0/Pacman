package pl.wat.pz.pacman.PacmanServer.security;

import static pl.wat.pz.pacman.PacmanServer.security.SecurityConstants.SECRET;

import java.io.IOException;
import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.core.annotation.Order;
import org.springframework.web.bind.annotation.CrossOrigin;

import io.jsonwebtoken.Jwts;
import pl.wat.pz.pacman.PacmanServer.database.model.Account;
import pl.wat.pz.pacman.PacmanServer.database.repository.AccountRepository;

@Order(1)
@CrossOrigin("*")
public class UrlFilterAuthorized implements Filter {

	Logger logger = LoggerFactory.getLogger(UrlFilterAuthorized.class);
	public AccountRepository accountRepository;
	
	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest) request;
		HttpServletResponse res = (HttpServletResponse) response;

		String token = (String)req.getHeader("Authorization");
		logger.info("Logging Request  {} : {}", req.getMethod(), req.getRequestURI());

		try {
			String user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
			
			for(Account a : accountRepository.findAll()) {
				if(a.getLogin().equals(user)) {
					chain.doFilter(request, response);
					logger.info("Logging Response :{}", res.getContentType());
					break;
				}
					
			}
		} catch (NullPointerException e) {} 
		catch (IllegalArgumentException e) {}
	}
}
