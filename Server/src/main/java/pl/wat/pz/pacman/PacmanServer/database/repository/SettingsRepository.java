package pl.wat.pz.pacman.PacmanServer.database.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import pl.wat.pz.pacman.PacmanServer.database.model.Settings;

@Repository
public interface SettingsRepository extends JpaRepository<Settings, Long>{

}
