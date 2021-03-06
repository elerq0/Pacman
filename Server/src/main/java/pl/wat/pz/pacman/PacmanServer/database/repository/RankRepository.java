package pl.wat.pz.pacman.PacmanServer.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.wat.pz.pacman.PacmanServer.database.model.Rank;

@Repository
public interface RankRepository extends JpaRepository<Rank, Long> {
	
	Rank findByRankPosition(long rankPosition);
	
}
