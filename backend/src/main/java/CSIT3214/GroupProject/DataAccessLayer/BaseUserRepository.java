package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.NoRepositoryBean;

import java.util.Optional;

/**
 * Base repository interface for user entities.
 *
 * @param <T> The type of user entity.
 */
@NoRepositoryBean
public interface BaseUserRepository<T extends User> extends JpaRepository<T, Long> {
    /**
     * Find a user by email.
     *
     * @param email The email of the user to find.
     * @return An Optional containing the user if found, or an empty Optional if not found.
     */
    Optional<T> findByEmail(String email);
}