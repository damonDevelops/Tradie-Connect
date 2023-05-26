package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.SystemAdmin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

/**
 * Repository interface for managing SystemAdmin entities.
 */
@Repository
public interface SystemAdminRepository extends JpaRepository<SystemAdmin, Long> {

    /**
     * Retrieve a System Admin by email.
     *
     * @param email The email of the System Admin.
     * @return An optional System Admin matching the email.
     */
    Optional<SystemAdmin> findByEmail(String email);
}
