package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.*;
import CSIT3214.GroupProject.Model.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;


/**
 * Service class for service request operations.
 * This class provides methods to retrieve, create, update, and delete service requests,
 * add service providers to qualified requests, validate service providers for a service request,
 * calculate distances between locations, and perform related operations.
 */
@Service
public class ServiceRequestService {

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceRequestApplicantRepository serviceRequestApplicantRepository;

    /**
     * Retrieves all service requests.
     *
     * @return a list of all service requests
     */
    public List<ServiceRequest> findAllServiceRequests() {
        return serviceRequestRepository.findAll();
    }

    /**
     * Retrieves a service request by its ID.
     *
     * @param id the ID of the service request
     * @return the service request with the specified ID, or null if not found
     */
    public ServiceRequest findServiceRequestById(Long id) {
        return serviceRequestRepository.findById(id).orElse(null);
    }

    /**
     * Creates a new service request.
     * This method creates a service request based on the provided customer ID and service request DTO,
     * sets the necessary details, saves it to the database, finds valid service providers,
     * and associates the service request with the qualified service providers.
     *
     * @param customerId         the ID of the customer
     * @param serviceRequestDTO  the service request DTO containing the request details
     * @return the created service request
     */
    public ServiceRequest createServiceRequest(Long customerId, CreateServiceRequestDTO serviceRequestDTO) {
        Optional<Customer> customer = customerRepository.findById(customerId);
        if (customer.isPresent()) {
            ServiceRequest serviceRequest = new ServiceRequest();
            serviceRequest.setCustomer(customer.get());
            serviceRequest.setServiceType(serviceRequestDTO.getServiceType());
            serviceRequest.setStatus(OrderStatus.CREATED);
            serviceRequest.setRequestedTime(LocalTime.from(LocalDateTime.now()));
            serviceRequest.setDescription(serviceRequestDTO.getDescription());
            serviceRequest.setCost(serviceRequestDTO.getCost());
            serviceRequest.setScheduledStartDate(serviceRequestDTO.getStartDate());
            serviceRequest.setScheduledStartTime(serviceRequestDTO.getStartTime());
            serviceRequest.setScheduledEndDate(serviceRequestDTO.getEndDate());
            serviceRequest.setScheduledEndTime(serviceRequestDTO.getEndTime());

            ServiceRequest savedServiceRequest = serviceRequestRepository.save(serviceRequest);

            // Find valid service providers
            List<ServiceProvider> validServiceProviders = findValidServiceProviders(savedServiceRequest);
            System.out.println("Valid Service Providers size: " + validServiceProviders.size());

            // Add the saved service request to the valid service providers' qualified service requests
            for (ServiceProvider serviceProvider : validServiceProviders) {
                serviceProvider.getQualifiedServiceRequests().add(savedServiceRequest);
                savedServiceRequest.getQualifiedServiceProviders().add(serviceProvider);
                serviceProviderRepository.save(serviceProvider);
            }

            // Retrieve the updated ServiceRequest object from the database
            return serviceRequestRepository.findById(savedServiceRequest.getId()).orElse(null);
        } else {
            return null;
        }
    }

    /**
     * Adds a service provider to qualified requests.
     * This method finds service requests of the corresponding skill set,
     * validates the service provider for each request, and adds them to the qualified service providers.
     *
     * @param serviceProvider the service provider to be added
     */
    public void addServiceProviderToQualifiedRequests(ServiceProvider serviceProvider) {
        List<ServiceRequest> serviceRequestsByType = serviceRequestRepository.findByServiceTypeInSet(serviceProvider.getSkills());

        for (ServiceRequest serviceRequest : serviceRequestsByType) {
            if (isValidServiceProvider(serviceProvider, serviceRequest)) {
                serviceRequest.getQualifiedServiceProviders().add(serviceProvider);
                serviceRequestRepository.save(serviceRequest);
            }
        }
    }

    /**
     * Validates a service provider for a service request.
     * This method calculates the distance between the customer's and service provider's locations
     * and checks if it is within the specified limit (50 km).
     *
     * @param serviceProvider the service provider to be validated
     * @param serviceRequest   the service request for validation
     * @return true if the service provider is valid, false otherwise
     */
    public boolean isValidServiceProvider(ServiceProvider serviceProvider, ServiceRequest serviceRequest) {
        Suburb customerSuburb = serviceRequest.getCustomer().getSuburb();
        double customerLatitude = customerSuburb.getLatitude();
        double customerLongitude = customerSuburb.getLongitude();
        double serviceProviderLatitude = serviceProvider.getSuburb().getLatitude();
        double serviceProviderLongitude = serviceProvider.getSuburb().getLongitude();

        double distance = haversine(customerLatitude, customerLongitude, serviceProviderLatitude, serviceProviderLongitude);

        System.out.println("Distance for ServiceProvider " + serviceProvider.getId() + ": " + distance);

        return distance <= 50;
    }

    /**
     * Finds valid service providers for a service request.
     * This method retrieves the customer's location, retrieves service providers based on the service type,
     * calculates the distance between the customer and each service provider,
     * and returns a list of valid service providers within the specified limit (50 km).
     *
     * @param serviceRequest the service request for which to find valid service providers
     * @return a list of valid service providers
     */
    public List<ServiceProvider> findValidServiceProviders(ServiceRequest serviceRequest) {
        Suburb customerSuburb = serviceRequest.getCustomer().getSuburb();
        double customerLatitude = customerSuburb.getLatitude();
        double customerLongitude = customerSuburb.getLongitude();

        List<ServiceProvider> serviceProviderBySkill = serviceProviderRepository.findByServiceType(serviceRequest.getServiceType());

        System.out.println("Service providers by skill size: " + serviceProviderBySkill.size());

        List<ServiceProvider> validServiceProviders = new ArrayList<>();

        for (ServiceProvider serviceProvider : serviceProviderBySkill) {
            double serviceProviderLatitude = serviceProvider.getSuburb().getLatitude();
            double serviceProviderLongitude = serviceProvider.getSuburb().getLongitude();

            double distance = haversine(customerLatitude, customerLongitude, serviceProviderLatitude, serviceProviderLongitude);

            System.out.println("Distance for ServiceProvider " + serviceProvider.getId() + ": " + distance);

            if (distance <= 50) {
                validServiceProviders.add(serviceProvider);
            }
        }

        return validServiceProviders;
    }

    /**
     * Calculates the distance between two locations using the Haversine formula.
     *
     * @param lat1 the latitude of location 1
     * @param lon1 the longitude of location 1
     * @param lat2 the latitude of location 2
     * @param lon2 the longitude of location 2
     * @return the distance between the two locations in kilometers
     */
    public double haversine(double lat1, double lon1, double lat2, double lon2) {
        final double R = 6371; // Earth radius in kilometers

        double latDistance = Math.toRadians(lat2 - lat1);
        double lonDistance = Math.toRadians(lon2 - lon1);
        double a = Math.sin(latDistance / 2) * Math.sin(latDistance / 2)
                + Math.cos(Math.toRadians(lat1)) * Math.cos(Math.toRadians(lat2))
                * Math.sin(lonDistance / 2) * Math.sin(lonDistance / 2);
        double c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        return R * c;
    }

    /**
     * Applies for a service request.
     * This method creates a service request applicant, associates it with the service request and service provider,
     * saves it to the database, and updates the status of the service request to PENDING.
     *
     * @param serviceRequest  the service request to apply for
     * @param serviceProvider the service provider applying for the request
     * @param distance        the distance between the customer and service provider
     */
    public void applyForServiceRequest(ServiceRequest serviceRequest, ServiceProvider serviceProvider, Double distance) {
        ServiceRequestApplicant sra = new ServiceRequestApplicant();
        sra.setServiceRequest(serviceRequest);
        sra.setServiceProvider(serviceProvider);
        sra.setDistance(distance);

        // Save the ServiceRequestApplicant
        serviceRequestApplicantRepository.save(sra);

        // Update the ServiceRequest status
        serviceRequest.setStatus(OrderStatus.PENDING);
        serviceRequestRepository.save(serviceRequest);
    }

    /**
     * Accepts a service provider for a service request.
     * This method updates the service request with the accepted service provider
     * and updates the status of the service request to ACCEPTED.
     *
     * @param serviceRequest  the service request to accept a service provider for
     * @param serviceProvider the accepted service provider
     */
    public void acceptServiceProvider(ServiceRequest serviceRequest, ServiceProvider serviceProvider) {
        serviceRequest.acceptServiceProvider(serviceProvider);
        serviceRequest.setStatus(OrderStatus.ACCEPTED);
        serviceRequestRepository.save(serviceRequest);
    }

    /**
     * Finds service requests by user ID and role.
     * This method retrieves service requests based on the user's ID and role.
     *
     * @param userId the ID of the user
     * @param role   the role of the user
     * @return a list of service requests associated with the user and role
     */
    public List<ServiceRequest> findServiceRequestsByUserIdAndRole(Long userId, Role role) {
        if (role == Role.ROLE_CUSTOMER) {
            return serviceRequestRepository.findByCustomerId(userId);
        } else if (role == Role.ROLE_SERVICE_PROVIDER) {
            return serviceRequestRepository.findByServiceProviderId(userId);
        } else {
            return new ArrayList<>();
        }
    }

    /**
     * Retrieves customer details.
     *
     * @param customerId the ID of the customer
     * @return the customer details, or null if not found
     */
    public Customer getCustomerDetails(Long customerId) {
        return customerRepository.findById(customerId).orElse(null);
    }

    /**
     * Retrieves service provider details.
     *
     * @param serviceProviderId the ID of the service provider
     * @return the service provider details, or null if not found
     */
    public ServiceProvider getServiceProviderDetails(Long serviceProviderId) {
        return serviceProviderRepository.findById(serviceProviderId).orElse(null);
    }
}