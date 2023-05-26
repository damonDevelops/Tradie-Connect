package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.ServiceProviderRepository;
import CSIT3214.GroupProject.Model.Role;
import CSIT3214.GroupProject.Model.ServiceProvider;
import CSIT3214.GroupProject.Model.Skill;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service class for service provider operations.
 * This class provides methods to retrieve, save, and delete service providers,
 * as well as add and remove skills for a service provider.
 */
@Service
public class ServiceProviderService {

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    /**
     * Retrieves all service providers.
     *
     * @return a list of all service providers
     */
    public List<ServiceProvider> findAllServiceProviders() {
        return serviceProviderRepository.findAll();
    }

    /**
     * Retrieves a service provider by its ID.
     *
     * @param id the ID of the service provider
     * @return the service provider with the specified ID, or null if not found
     */
    public ServiceProvider findServiceProviderById(Long id) {
        return serviceProviderRepository.findById(id).orElse(null);
    }

    /**
     * Saves a service provider.
     * This method sets the role of the service provider to ROLE_SERVICE_PROVIDER
     * and saves it to the database.
     *
     * @param serviceProvider the service provider to be saved
     * @return the saved service provider
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    public ServiceProvider saveServiceProvider(ServiceProvider serviceProvider) {
        serviceProvider.setRole(Role.ROLE_SERVICE_PROVIDER);
        return serviceProviderRepository.save(serviceProvider);
    }

    /**
     * Deletes a service provider by its ID.
     *
     * @param id the ID of the service provider to be deleted
     */
    public void deleteServiceProvider(Long id) {
        serviceProviderRepository.deleteById(id);
    }

    /**
     * Adds a skill to a service provider.
     * This method retrieves the service provider by ID, adds the specified skill
     * to its skills set, and saves the updated service provider to the database.
     *
     * @param serviceProviderId the ID of the service provider
     * @param skill             the skill to be added
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    public void addSkillToServiceProvider(Long serviceProviderId, Skill skill) {
        ServiceProvider serviceProvider = findServiceProviderById(serviceProviderId);
        if (serviceProvider != null) {
            serviceProvider.addSkill(skill);
            saveServiceProvider(serviceProvider);
        }
    }

    /**
     * Removes a skill from a service provider.
     * This method retrieves the service provider by ID, removes the specified skill
     * from its skills set, and saves the updated service provider to the database.
     *
     * @param serviceProviderId the ID of the service provider
     * @param skill             the skill to be removed
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    public void removeSkillFromServiceProvider(Long serviceProviderId, Skill skill) {
        ServiceProvider serviceProvider = findServiceProviderById(serviceProviderId);
        if (serviceProvider != null) {
            serviceProvider.removeSkill(skill);
            saveServiceProvider(serviceProvider);
        }
    }
}