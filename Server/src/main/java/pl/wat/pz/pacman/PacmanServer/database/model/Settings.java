package pl.wat.pz.pacman.PacmanServer.database.model;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@Entity
@Table(name = "settings")
public class Settings {

	@GeneratedValue(strategy=GenerationType.AUTO)
	@Id
	private Long id;

	@Column(name = "player_color")
	private String playerColor;

	@Column(name = "enemies_amount")
	private int enemiesAmount;

	@Column(name = "lives_amount")
	private int livesAmount;
	
	@OneToOne(cascade=CascadeType.ALL)
	@JoinColumn(name="fk_settings")
	private Account account;

	public String getPlayerColor() {
		return playerColor;
	}

	public void setPlayerColor(String playerModel) {
		this.playerColor = playerModel;
	}

	public int getEnemiesAmount() {
		return enemiesAmount;
	}

	public void setEnemiesAmount(int enemiesAmount) {
		this.enemiesAmount = enemiesAmount;
	}

	public int getLivesAmount() {
		return livesAmount;
	}

	public void setLivesAmount(int livesAmount) {
		this.livesAmount = livesAmount;
	}

	public Account getAccount() {
		return account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

}
