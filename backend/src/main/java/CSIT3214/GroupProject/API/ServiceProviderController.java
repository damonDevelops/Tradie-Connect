package CSIT3214.GroupProject.API;

import CSIT3214.GroupProject.Model.*;
import CSIT3214.GroupProject.Model.GeoCoding.LatLng;
import CSIT3214.GroupProject.Service.GeocodingService;
import CSIT3214.GroupProject.Service.ServiceProviderService;
import CSIT3214.GroupProject.Service.SuburbService;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.lang.reflect.Field;
import java.util.List;
import java.util.Map;

/**
 * The ServiceProviderController class is a REST controller that handles API requests related to service providers.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/service-providers")
public class ServiceProviderController extends BaseController {

    @Autowired
    private ServiceProviderService serviceProviderService;

    @Autowired
    private GeocodingService geocodingService;

    @Autowired
    private SuburbService suburbService;

    /**
     * Retrieves all service providers.
     *
     * @return A list of all service providers.
     */
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    @GetMapping("/all")
    public List<ServiceProvider> getAllServiceProviders() {

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("Authenticated user has roles: " + authentication.getAuthorities());
        return serviceProviderService.findAllServiceProviders();

    }

    /**
     * Retrieves the current service provider based on the JWT stored in the request cookies.
     *
     * @param request The HTTP servlet request.
     * @return The current service provider.
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    @GetMapping
    public ServiceProvider getCurrentServiceProvider(HttpServletRequest request) {
        UserIdAndRole userIdAndRole = getUserIdAndRoleFromJwt(request);
        Long userId = userIdAndRole.getUserId();
        return serviceProviderService.findServiceProviderById(userId);
    }

    /**
     * Creates a new service provider.
     *
     * @param serviceProvider The service provider to create.
     * @return The created service provider.
     */
    @PostMapping
    public ServiceProvider createServiceProvider(@RequestBody ServiceProvider serviceProvider) {
        return serviceProviderService.saveServiceProvider(serviceProvider);
    }

    /**
     * Updates the current service provider's information.
     *
     * @param updatedFields The updated fields.
     * @param request       The HTTP servlet request.
     * @return The updated service provider.
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    @PutMapping
    public ServiceProvider updateCurrentServiceProvider(@RequestBody Map<String, Object> updatedFields, HttpServletRequest request) {
        UserIdAndRole userIdAndRole = getUserIdAndRoleFromJwt(request);
        Long userId = userIdAndRole.getUserId();

        ServiceProvider existingServiceProvider = serviceProviderService.findServiceProviderById(userId);
        if (existingServiceProvider == null) {
            throw new IllegalArgumentException("Service provider not found");
        }

        ObjectMapper objectMapper = new ObjectMapper();

        // Iterate through the updatedFields map and update the existingServiceProvider object using Reflection API
        for (Map.Entry<String, Object> entry : updatedFields.entrySet()) {
            if ("suburb".equals(entry.getKey())) {
                // Handle it later
                continue;
            }

            try {
                Field field;
                try {
                    field = ServiceProvider.class.getDeclaredField(entry.getKey());
                } catch (NoSuchFieldException e) {
                    // Try to find the field in the base class
                    field = User.class.getDeclaredField(entry.getKey());
                }
                field.setAccessible(true);

                // Handle membership field separately
                if ("membership".equals(entry.getKey())) {
                    Map<String, Object> membershipData = (Map<String, Object>) entry.getValue();
                    Membership membership = objectMapper.convertValue(membershipData, Membership.class);
                    field.set(existingServiceProvider, membership);
                } else {
                    field.set(existingServiceProvider, entry.getValue());
                }
            } catch (NoSuchFieldException | IllegalAccessException e) {
                // Handle the exception or log it
            }
        }

        // Handle suburb update separately
        if (updatedFields.containsKey("suburb")) {
            Map<String, String> suburbData = (Map<String, String>) updatedFields.get("suburb");
            String suburbName = suburbData.get("name");
            String suburbState = suburbData.get("state");

            Suburb existingSuburb = suburbService.findSuburbByNameAndState(suburbName, suburbState);

            if (existingSuburb == null || existingSuburb.getLatitude() == 0.0 || existingSuburb.getLongitude() == 0.0) {
                LatLng latLng = geocodingService.getLatLng(suburbName, suburbState);

                Suburb suburb = suburbService.findOrCreateSuburb(suburbName, suburbState, latLng.getLat(), latLng.getLng());
                existingServiceProvider.setSuburb(suburb);
            } else {
                existingServiceProvider.setSuburb(existingSuburb);
            }
        }

        return serviceProviderService.saveServiceProvider(existingServiceProvider);
    }

    /**
     * Deletes the current service provider.
     *
     * @param request The HTTP servlet request.
     */
    @DeleteMapping
    public void deleteCurrentServiceProvider(HttpServletRequest request) {
        UserIdAndRole userIdAndRole = getUserIdAndRoleFromJwt(request);
        Long userId = userIdAndRole.getUserId();
        serviceProviderService.deleteServiceProvider(userId);
    }

    /**
     * Adds a skill to the current service provider.
     *
     * @param skill   The skill to add.
     * @param request The HTTP servlet request.
     */
    @PostMapping("/skills/{skill}")
    public void addSkillToCurrentServiceProvider(@PathVariable Skill skill, HttpServletRequest request) {
        UserIdAndRole userIdAndRole = getUserIdAndRoleFromJwt(request);
        Long serviceProviderId = userIdAndRole.getUserId();
        serviceProviderService.addSkillToServiceProvider(serviceProviderId, skill);
    }

    /**
     * Removes a skill from the current service provider.
     *
     * @param skill   The skill to remove.
     * @param request The HTTP servlet request.
     */
    @DeleteMapping("/skills/{skill}")
    public void removeSkillFromCurrentServiceProvider(@PathVariable Skill skill, HttpServletRequest request) {
        UserIdAndRole userIdAndRole = getUserIdAndRoleFromJwt(request);
        Long serviceProviderId = userIdAndRole.getUserId();
        serviceProviderService.removeSkillFromServiceProvider(serviceProviderId, skill);
    }

    /**
     * Retrieves a service provider by ID.
     *
     * @param id The service provider ID.
     * @return The service provider with the specified ID.
     */
    @GetMapping("/{id}")
    public ServiceProvider getServiceProviderById(@PathVariable Long id) {
        return serviceProviderService.findServiceProviderById(id);
    }
}