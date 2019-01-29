package pl.wat.pz.pacman.PacmanServer.database.controler;

import static pl.wat.pz.pacman.PacmanServer.security.SecurityConstants.EXPIRATION_TIME;
import static pl.wat.pz.pacman.PacmanServer.security.SecurityConstants.SECRET;

import java.util.ArrayList;
import java.util.Date;
import java.util.LinkedList;
import java.util.List;

import javax.servlet.ServletException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import pl.wat.pz.pacman.PacmanServer.database.model.Account;
import pl.wat.pz.pacman.PacmanServer.database.model.Rank;
import pl.wat.pz.pacman.PacmanServer.database.model.SecurityQuestion;
import pl.wat.pz.pacman.PacmanServer.database.model.Settings;
import pl.wat.pz.pacman.PacmanServer.database.repository.AccountRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.RankRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.SecurityQuestionRepository;

@CrossOrigin
@RestController
public class AccountControler {

	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private SecurityQuestionRepository secQuestionRepository;
	@Autowired
	private RankRepository rankRepository;
	BCryptPasswordEncoder bCryptPasswordEncoder;

	public AccountControler() {
		this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
	}

	public List<SecurityQuestion> all() {
		return secQuestionRepository.findAll();
	}

	@RequestMapping(value = "/users/getquestionlist", method = RequestMethod.GET)
	public List<String> getListOfQuestions() {
		List<String> listOfQuestions = new LinkedList<String>();
		for (SecurityQuestion q : secQuestionRepository.findAll()) {
			listOfQuestions.add(q.getContent());
		}
		return listOfQuestions;
	}

	@RequestMapping(value = "/users/token", method = RequestMethod.GET)
	public boolean checkToken(@RequestParam String token) {

		if (token.isEmpty())
			return false;

		String user = "";
		try {
			user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
		} catch (MalformedJwtException e) {
			return false;
		} catch (SignatureException e) {
			return false;
		}
		if (user == null)
			return false;

		UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
				new ArrayList<>());

		SecurityContextHolder.getContext().setAuthentication(authToken);
		return true;
	}

	@RequestMapping(value = "/users/signup", method = RequestMethod.POST)
	public @ResponseBody String createAccount(@RequestParam String login, @RequestParam String password,
			@RequestParam String question, @RequestParam String answer) throws ServletException {
		try {
			if (login.isEmpty() || password.isEmpty() || question.isEmpty() || answer.isEmpty()) {
				throw new ServletException("1 Some fields left empty");
			}

			if (login.contains(" ") || password.contains(" ")) {
				throw new ServletException("2 Login or password contains whitespaces, please remove them!");
			}
			
			if(password.length() < 6)
				throw new ServletException("3 Password is too short!");

			for (Account a : accountRepository.findAll()) {
				if (a.getLogin().equals(login)) {
					throw new ServletException("4 Login already taken!");
				}
			}
			SecurityQuestion secQuestion = secQuestionRepository.findByContent(question);
			if (secQuestion == null) {
				throw new ServletException("5 Unexpected error!");
			}

			Account a = new Account();
			a.setLogin(login);
			a.setPassword(bCryptPasswordEncoder.encode(password));
			a.setSecurityQuestion(secQuestion);
			a.setSecAnswer(answer);

			Settings s = new Settings();
			s.setEnemiesAmount(4);
			s.setLivesAmount(3);
			s.setPlayerColor("0xFFFF00");
			s.setAccount(a);
			a.setSettings(s);

			Rank r = new Rank();
			r.setMaxScore(0L);
			r.setRankPosition(rankRepository.count() + 1);
			r.setTotalTime(0L);
			r.setAccount(a);
			a.setRank(r);

			accountRepository.save(a);
			return "Completed";
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}

	@RequestMapping(value = "/users/signin", method = RequestMethod.GET)
	public @ResponseBody String login(@RequestParam String login, @RequestParam String password)
			throws ServletException {
		try {

			if (login.isEmpty() || password.isEmpty())
				throw new ServletException("1 Some fields left empty");

			if (login.contains(" ") || password.contains(" "))
				throw new ServletException("2 Login or password contains whitespaces, please remove them!");

			Account a = accountRepository.findByLogin(login);
			if (a == null)
				throw new ServletException("3 Account not found!");

			if (!bCryptPasswordEncoder.matches(password, a.getPassword()))
				throw new ServletException("4 Wrong password");

			String token = Jwts.builder().setSubject(a.getLogin())
					.setExpiration(new Date(System.currentTimeMillis() + EXPIRATION_TIME))
					.signWith(SignatureAlgorithm.HS512, SECRET).compact();
			
			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(login, null,
					new ArrayList<>());

			SecurityContextHolder.getContext().setAuthentication(authToken);
			
			return token;
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}

	@RequestMapping(value = "/users/getquestion", method = RequestMethod.GET)
	public @ResponseBody String getQuestion(@RequestParam String login) throws ServletException {
		try {
			if (login.isEmpty()) {
				throw new ServletException("1 Login field left empty");
			}

			if (login.contains(" ")) {
				throw new ServletException("2 Login contain whitespaces, please remove them!");
			}

			Account a = accountRepository.findByLogin(login);
			if (a == null)
				throw new ServletException("3 Account not found!");

			return a.getSecurityQuestion().getContent();
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}

	@RequestMapping(value = "/users/changepassword", method = RequestMethod.PUT)
	public @ResponseBody String changePassword(@RequestParam String login, @RequestParam String password,
			@RequestParam String answer) throws ServletException {
		try {
			if (login.isEmpty()) {
				throw new ServletException("1 Some fields left empty");
			}

			if (login.contains(" ")) {
				throw new ServletException("2 Login contain whitespaces, please remove them!");
			}
			
			if(password.length() < 6)
				throw new ServletException("3 Password is too short!");

			Account a = accountRepository.findByLogin(login);
			if (a == null)
				throw new ServletException("4 Account not found!");

			accountRepository.delete(a);
			String userAnswer = a.getSecAnswer();
			if (!userAnswer.equals(answer)) {
				throw new ServletException("5 Wrong answer");
			}
			a.setPassword(bCryptPasswordEncoder.encode(password));
			accountRepository.save(a);
			return "Password changed successfully!";
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}	
}
