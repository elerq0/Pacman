package pl.wat.pz.pacman.PacmanServer.database.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "score")
public class Score {

	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	private Long id;

	@Column(name = "time_played")
	private Long timePlayed;

	@Column(name = "score")
	private Long score;

	@ManyToOne()
	@JoinColumn(name = "fk_ranking")
	private Rank ranking;

	public Long getTimePlayed() {
		return timePlayed;
	}

	public void setTimePlayed(Long timePlayed) {
		this.timePlayed = timePlayed;
	}

	public Long getScore() {
		return score;
	}

	public void setScore(Long score) {
		this.score = score;
	}

	public Rank getRanking() {
		return ranking;
	}

	public void setRanking(Rank ranking) {
		this.ranking = ranking;
	}

}
