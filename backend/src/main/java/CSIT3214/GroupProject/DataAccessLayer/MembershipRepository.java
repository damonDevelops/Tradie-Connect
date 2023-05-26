package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.Membership;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository interface for managing Membership entities.
 */
@Repository
public interface MembershipRepository extends JpaRepository<Membership, Long> {
}