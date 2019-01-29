package pl.wat.pz.pacman.PacmanServer.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.wat.pz.pacman.PacmanServer.database.model.Rank;
import pl.wat.pz.pacman.PacmanServer.database.model.Score;

@Repository
public interface ScoreRepository extends JpaRepository<Score, Long> {
	
	Score[] findByRanking(Rank ranking);
}
