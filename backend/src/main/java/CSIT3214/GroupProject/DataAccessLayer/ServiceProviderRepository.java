package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.ServiceProvider;
import CSIT3214.GroupProject.Model.Skill;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repository interface for managing ServiceProvider entities.
 */
@Repository
public interface ServiceProviderRepository extends BaseUserRepository<ServiceProvider> {

    /**
     * Retrieve a list of Service Providers by their service type.
     *
     * @param skill The service type to search for.
     * @return A list of Service Providers matching the service type.
     */
    @Query("SELECT sp FROM ServiceProvider sp JOIN sp.skills s WHERE s = :skill")
    List<ServiceProvider> findByServiceType(@Param("skill") Skill skill);
}