package pl.wat.pz.pacman.PacmanServer.database.model;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;


@Entity
@Table(name = "ranking")
public class Rank {

	@GeneratedValue(strategy=GenerationType.AUTO)
	@Id
	private Long id;

	@Column(name = "rank_position")
	private Long rankPosition;

	@Column(name = "max_score")
	private Long maxScore;

	@Column(name = "total_time")
	private Long totalTime;
	
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name = "fk_rank")
	private Account account;

	@OneToMany(mappedBy="ranking", cascade = CascadeType.ALL, orphanRemoval = true)
	private Set<Score> scores;
	
	public Rank() {
		scores = new HashSet<Score>();
		Score s = new Score();
		s.setRanking(this);
		s.setScore(0L);
		s.setTimePlayed(0L);
		scores.add(s);
	}

	public Long getRankPosition() {
		return rankPosition;
	}

	public void setRankPosition(Long rankPosition) {
		this.rankPosition = rankPosition;
	}

	public Long getMaxScore() {
		return maxScore;
	}

	public void setMaxScore(Long maxScore) {
		this.maxScore = maxScore;
	}

	public Long getTotalTime() {
		return totalTime;
	}

	public void setTotalTime(Long totalTime) {
		this.totalTime = totalTime;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}
	
	public void addScore(Score s) {
		this.scores.add(s);
	}
	
	public void removeScore(Score s) {
		this.scores.remove(s);
	}
	
	public Set<Score> getScores(){
		return this.scores;
	}

}
