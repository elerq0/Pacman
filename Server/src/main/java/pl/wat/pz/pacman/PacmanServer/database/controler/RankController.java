package pl.wat.pz.pacman.PacmanServer.database.controler;

import static pl.wat.pz.pacman.PacmanServer.security.SecurityConstants.SECRET;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Stack;

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
import net.minidev.json.JSONObject;
import pl.wat.pz.pacman.PacmanServer.database.model.Account;
import pl.wat.pz.pacman.PacmanServer.database.model.Rank;
import pl.wat.pz.pacman.PacmanServer.database.model.Score;
import pl.wat.pz.pacman.PacmanServer.database.repository.AccountRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.RankRepository;
import pl.wat.pz.pacman.PacmanServer.database.repository.ScoreRepository;

@CrossOrigin
@RestController
public class RankController {

	@Autowired
	private AccountRepository accountRepository;
	@Autowired
	private RankRepository rankRepository;
	@Autowired
	private ScoreRepository scoreRepository;

	@RequestMapping(value = "/rank/gettop", method = RequestMethod.GET)
	public @ResponseBody HashMap<String, HashMap<String, String>> getTop(@RequestParam int ammount)
			throws ServletException {
		HashMap<String, HashMap<String, String>> top = new HashMap<>();
		for (int i = 1; i <= ammount; i++) {
			HashMap<String, String> rankMap = new HashMap<>();
			Rank rankObj = rankRepository.findByRankPosition(i);
			if (rankObj == null)
				continue;
			rankMap.put("Position", rankObj.getRankPosition().toString());
			rankMap.put("Name", rankObj.getAccount().getLogin());
			rankMap.put("TotalTime", rankObj.getTotalTime().toString());
			rankMap.put("MaxScore", rankObj.getMaxScore().toString());
			top.put("" + i, rankMap);
		}
		return top;
	}

	@RequestMapping(value = "/rank/getmyrank", method = RequestMethod.GET)
	public @ResponseBody JSONObject getRank(ServletRequest request) throws ServletException {
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
			Rank r = a.getRank();

			Long rank = r.getRankPosition();
			Long totalTime = a.getRank().getTotalTime();

			Stack<Score> stack = new Stack<Score>();

			for(Score s : scoreRepository.findByRanking(r) ) {
				stack.push(s);
				if (stack.size() > 5) {
					stack.remove(0);
				}
			}

			JSONObject json = new JSONObject();
			json.put("name", user);
			json.put("rank", rank);
			json.put("totalTime", totalTime);

			
			while (!stack.isEmpty()) {
				Score sc = stack.remove(0);
				JSONObject item = new JSONObject();
				item.put("score", sc.getScore());
				item.put("timePlayed", sc.getTimePlayed());
				json.put("" + stack.size(), item);
			}

			return json;

		} catch (ServletException e) {
			JSONObject json = new JSONObject();
			json.put("name", "Error:" + e.getMessage());
			return json;
		}
	}
}
