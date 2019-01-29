package pl.wat.pz.pacman.PacmanServer.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.wat.pz.pacman.PacmanServer.database.model.Account;

@Repository
public interface AccountRepository extends JpaRepository<Account, Long>{
	
	Account findByLogin(String login); 
	
	Account findByPassword(String s);
	
	
}
