package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.Suburb;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * Repository interface for managing Suburb entities.
 */
public interface SuburbRepository extends JpaRepository<Suburb, Long> {

    /**
     * Retrieve a Suburb by name and state.
     *
     * @param name  The name of the suburb.
     * @param state The state of the suburb.
     * @return An optional Suburb matching the name and state.
     */
    Optional<Suburb> findByNameAndState(String name, String state);
}