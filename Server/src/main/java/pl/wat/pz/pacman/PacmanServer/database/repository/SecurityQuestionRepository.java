package pl.wat.pz.pacman.PacmanServer.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.wat.pz.pacman.PacmanServer.database.model.SecurityQuestion;

@Repository
public interface SecurityQuestionRepository extends JpaRepository<SecurityQuestion, Long> {
	
	SecurityQuestion findByContent(String Content);

}
