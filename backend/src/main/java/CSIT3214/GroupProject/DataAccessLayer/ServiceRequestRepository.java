package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.ServiceRequest;
import CSIT3214.GroupProject.Model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

/**
 * Repository interface for managing ServiceRequest entities.
 */
@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, Long> {

    /**
     * Retrieve a list of Service Requests by customer ID.
     *
     * @param customerId The ID of the customer.
     * @return A list of Service Requests associated with the customer ID.
     */
    List<ServiceRequest> findByCustomerId(Long customerId);

    /**
     * Retrieve a list of Service Requests by service provider ID.
     *
     * @param serviceProviderId The ID of the service provider.
     * @return A list of Service Requests associated with the service provider ID.
     */
    List<ServiceRequest> findByServiceProviderId(Long serviceProviderId);

    /**
     * Retrieve a list of Service Requests by service type.
     *
     * @param skills The set of service types to search for.
     * @return A list of Service Requests matching the service types.
     */
    @Query("SELECT sr FROM ServiceRequest sr WHERE sr.serviceType IN :skills")
    List<ServiceRequest> findByServiceTypeInSet(@Param("skills") Set<Skill> skills);
}