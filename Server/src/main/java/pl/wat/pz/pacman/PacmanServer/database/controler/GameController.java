package pl.wat.pz.pacman.PacmanServer.database.controler;

import static pl.wat.pz.pacman.PacmanServer.security.SecurityConstants.SECRET;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.HashMap;
import java.util.List;

import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import pl.wat.pz.pacman.PacmanServer.database.model.Account;
import pl.wat.pz.pacman.PacmanServer.database.model.Rank;
import pl.wat.pz.pacman.PacmanServer.database.model.Score;
import pl.wat.pz.pacman.PacmanServer.database.model.Settings;
import pl.wat.pz.pacman.PacmanServer.database.repository.AccountRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.RankRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.ScoreRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.SettingsRepository;

@CrossOrigin
@RestController
public class GameController {

	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private RankRepository rankRepository;
	@Autowired
	private ScoreRepository scoreRepository;
	@Autowired
	private SettingsRepository settingRepository;

	@RequestMapping(value = "/game/getsettings", method = RequestMethod.GET)
	public @ResponseBody HashMap<String, String> getTop(ServletRequest request) throws ServletException {
		try {
			HttpServletRequest req = (HttpServletRequest) request;
			String token = (String) req.getHeader("Authorization");
			if (token == null)
				throw new ServletException("1 Empty token!");

			String user = "";
			try {
				user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
			} catch (MalformedJwtException e) {
				throw new ServletException("2 Unexpected error!");
			} catch (SignatureException e) {
				throw new ServletException("3 Unexpected error!");
			}
			if (user == null)
				throw new ServletException("4 Unauthorized access");

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
					new ArrayList<>());
			SecurityContextHolder.getContext().setAuthentication(authToken);

			Account a = accountRepository.findByLogin(user);
			
			HashMap<String, String> settings = new HashMap<>();
			
			Settings s = a.getSettings();
			
			settings.put("LivesAmmount", Integer.toString(s.getLivesAmount()));
			settings.put("EnemiesAmmount", Integer.toString(s.getEnemiesAmount()));
			settings.put("PlayerColor", s.getPlayerColor());
			
			return settings;
//
		} catch (ServletException e) {
			HashMap<String, String> settings = new HashMap<>();
			settings.put("Error" ,"Error:" + e.getMessage());
			return settings;
		}
	}
	
	
	@RequestMapping(value = "/game/setsettings", method = RequestMethod.PUT)
	public @ResponseBody String changePassword(ServletRequest request, @RequestParam String lives, @RequestParam String enemies,
			@RequestParam String color) throws ServletException {
		try {
			
			HttpServletRequest req = (HttpServletRequest) request;
			String token = (String)req.getHeader("Authorization");
			if (token == null)
				throw new ServletException("1 Empty token!");

			String user = "";
			try {
				user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
			} catch (MalformedJwtException e) {
				throw new ServletException("2 Unexpected error!");
			} catch (SignatureException e) {
				throw new ServletException("3 Unexpected error!");
			}
			if (user == null)
				throw new ServletException("4 Unauthorized access");

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
					new ArrayList<>());
			SecurityContextHolder.getContext().setAuthentication(authToken);

			Account a = accountRepository.findByLogin(user);
			
			Settings s = a.getSettings();
			
			if (lives.isEmpty() || enemies.isEmpty() || color.isEmpty()){
				throw new ServletException("5 Some fields left empty");
			}
			
			
			if(Integer.parseInt(lives) > 5 || Integer.parseInt(lives) < 1)
				throw new ServletException("6 Wrong number of lives");
			
			if(Integer.parseInt(enemies) > 9 || Integer.parseInt(enemies) < 1)
				throw new ServletException("7 Wrong number of enemies");
			
			settingRepository.delete(s);
			s.setLivesAmount(Integer.parseInt(lives));
			s.setEnemiesAmount(Integer.parseInt(enemies));
			s.setPlayerColor(color);
			settingRepository.save(s);

			return "Completed";
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}
	
	
	@RequestMapping(value = "/game/savescore", method = RequestMethod.POST)
	public @ResponseBody String createAccount(ServletRequest request, @RequestParam String score, @RequestParam String time) throws ServletException {
		try {
			HttpServletRequest req = (HttpServletRequest) request;
			String token = (String)req.getHeader("Authorization");
			if (token == null)
				throw new ServletException("1 Empty token!");

			String user = "";
			try {
				user = Jwts.parser().setSigningKey(SECRET).parseClaimsJws(token).getBody().getSubject();
			} catch (MalformedJwtException e) {
				throw new ServletException("2 Unexpected error!");
			} catch (SignatureException e) {
				throw new ServletException("3 Unexpected error!");
			}
			if (user == null)
				throw new ServletException("4 Unauthorized access");

			UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(user, null,
					new ArrayList<>());
			SecurityContextHolder.getContext().setAuthentication(authToken);

			Account a = accountRepository.findByLogin(user);
			accountRepository.delete(a);
			
			Rank r = a.getRank();
			rankRepository.delete(r);
			Score s = new Score();
			s.setRanking(r);
			s.setScore(Long.parseLong(score));
			s.setTimePlayed(Long.parseLong(time));
			r.addScore(s);
			r.setMaxScore(r.getMaxScore() + s.getScore());
			r.setTotalTime(r.getTotalTime() + s.getTimePlayed());			
			scoreRepository.save(s);
			rankRepository.save(r);
			accountRepository.save(a);
			
			List<Rank> ranks = rankRepository.findAll();
			
			ranks.sort(Comparator.comparing(Rank::getMaxScore).reversed());
			long temp = 1;
			for(Rank rs : ranks) {
				rankRepository.delete(rs);
				rs.setRankPosition(temp);
				rankRepository.save(rs);
				temp += 1;
			}
			
			return "Completed";
		} catch (ServletException e) {
			return "Error:" + e.getMessage();
		}
	}

}
