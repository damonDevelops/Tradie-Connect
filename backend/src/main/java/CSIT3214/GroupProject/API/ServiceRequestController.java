package CSIT3214.GroupProject.API;

import CSIT3214.GroupProject.Config.JwtService;
import CSIT3214.GroupProject.DataAccessLayer.CreateServiceRequestDTO;
import CSIT3214.GroupProject.DataAccessLayer.CustomerRepository;
import CSIT3214.GroupProject.DataAccessLayer.ServiceProviderRepository;
import CSIT3214.GroupProject.DataAccessLayer.ServiceRequestRepository;
import CSIT3214.GroupProject.Model.*;
import CSIT3214.GroupProject.Service.ServiceRequestService;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

/**
 * The ServiceRequestController class is a REST controller that handles API requests related to service requests.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/service-requests")
public class ServiceRequestController {

    @Autowired
    private ServiceRequestService serviceRequestService;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves all service requests.
     *
     * @return A list of all service requests.
     */
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    @GetMapping
    public List<ServiceRequest> getAllServiceRequests() {
        return serviceRequestService.findAllServiceRequests();
    }

    /**
     * Retrieves a service request by ID.
     *
     * @param id The service request ID.
     * @return The service request with the specified ID.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_SYSTEM_ADMIN', 'ROLE_CUSTOMER', 'ROLE_SERVICE_PROVIDER')")
    @GetMapping("/{id}")
    public ServiceRequest getServiceRequestById(@PathVariable Long id) {
        ServiceRequest serviceRequest = serviceRequestService.findServiceRequestById(id);
        if (serviceRequest == null) {
            throw new ServiceRequestNotFoundException("Service request not found with ID: " + id);
        }
        return serviceRequest;
    }

    /**
     * Creates a new service request.
     *
     * @param serviceRequestDTO The CreateServiceRequestDTO containing the service request data.
     * @param request           The HTTP servlet request.
     * @return The created service request.
     */
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/create")
    @ResponseStatus(HttpStatus.CREATED)
    public ServiceRequest createServiceRequest(@RequestBody CreateServiceRequestDTO serviceRequestDTO, HttpServletRequest request) {
        Long customerId = extractUserIdFromRequest(request);
        ServiceRequest createdServiceRequest = serviceRequestService.createServiceRequest(customerId, serviceRequestDTO);
        if (createdServiceRequest == null) {
            System.out.println("Null serviceRequest");
        }
        return createdServiceRequest;
    }

    /**
     * Retrieves the valid service providers for a service request.
     *
     * @param serviceRequestId The ID of the service request.
     * @return A list of valid service providers.
     */
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @GetMapping("/{serviceRequestId}/valid-service-providers")
    public List<ServiceProvider> getValidServiceProviders(@PathVariable Long serviceRequestId) {
        ServiceRequest serviceRequest = serviceRequestService.findServiceRequestById(serviceRequestId);
        if (serviceRequest == null) {
            System.out.println("Null serviceRequest");
        }
        assert serviceRequest != null;
        return serviceRequestService.findValidServiceProviders(serviceRequest);
    }

    /**
     * Applies for a service request as a service provider.
     *
     * @param serviceRequestId The ID of the service request.
     * @param request          The HTTP servlet request.
     */
    @PreAuthorize("hasAuthority('ROLE_SERVICE_PROVIDER')")
    @PostMapping("/{serviceRequestId}/apply")
    public void applyForServiceRequest(@PathVariable Long serviceRequestId, HttpServletRequest request) {
        try {
            Long serviceProviderId = extractUserIdFromRequest(request);
            ServiceProvider serviceProvider = serviceProviderRepository.findById(serviceProviderId).orElse(null);
            ServiceRequest serviceRequest = serviceRequestService.findServiceRequestById(serviceRequestId);

            if (serviceRequest == null || serviceProvider == null) {
                System.out.println("Invalid service request ID or service provider ID");
            }

            // Calculate the distance between the serviceProvider and the customer
            assert serviceProvider != null;
            assert serviceRequest != null;
            double distance = serviceRequestService.haversine(
                    serviceProvider.getSuburb().getLatitude(),
                    serviceProvider.getSuburb().getLongitude(),
                    serviceRequest.getCustomer().getSuburb().getLatitude(),
                    serviceRequest.getCustomer().getSuburb().getLongitude());

            serviceRequestService.applyForServiceRequest(serviceRequest, serviceProvider, distance);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }

    /**
     * Completes a service request.
     *
     * @param serviceRequestId The ID of the service request.
     * @param request          The HTTP servlet request.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SERVICE_PROVIDER')")
    @PostMapping("/{serviceRequestId}/complete")
    public void completeServiceRequest(@PathVariable Long serviceRequestId, HttpServletRequest request) {
        ServiceRequest serviceRequest = serviceRequestService.findServiceRequestById(serviceRequestId);
        serviceRequest.setCompletedAt(LocalTime.now());
        serviceRequest.setCompletedOn(LocalDate.now());
        serviceRequest.setStatus(OrderStatus.COMPLETED);

        Payment payment = new Payment();

        Customer customer = serviceRequest.getCustomer();
        ServiceProvider serviceProvider = serviceRequest.getServiceProvider();

        payment.setAmount(serviceRequest.getCost());
        payment.setTransactionDate(LocalDateTime.now());
        payment.setCustomer(customer);
        payment.setServiceProvider(serviceProvider);

        customer.addPayment(payment);
        serviceProvider.addPayment(payment);

        serviceRequestRepository.save(serviceRequest);
        customerRepository.save(customer);
        serviceProviderRepository.save(serviceProvider);
    }

    /**
     * Accepts a service provider for a service request.
     *
     * @param serviceRequestId  The ID of the service request.
     * @param serviceProviderId The ID of the service provider.
     */
    @PreAuthorize("hasAuthority('ROLE_CUSTOMER')")
    @PostMapping("/{serviceRequestId}/accept-service-provider/{serviceProviderId}")
    public void acceptServiceProvider(@PathVariable Long serviceRequestId, @PathVariable Long serviceProviderId) {
        ServiceRequest serviceRequest = serviceRequestService.findServiceRequestById(serviceRequestId);
        if (serviceRequest == null) {
            System.out.println("Null serviceRequest");
        }
        ServiceProvider serviceProvider = serviceProviderRepository.findById(serviceProviderId).orElse(null);

        assert serviceRequest != null;
        serviceRequestService.acceptServiceProvider(serviceRequest, serviceProvider);
    }

    /**
     * Retrieves the service requests for the current user.
     *
     * @param request The HTTP servlet request.
     * @return A list of service requests for the current user.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER', 'ROLE_SERVICE_PROVIDER')")
    @GetMapping("/user-requests")
    public List<ServiceRequest> getServiceRequestsForCurrentUser(HttpServletRequest request) {
        String jwt = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null) {
            // Handle the case when JWT is not found in cookies.
            throw new IllegalArgumentException("JWT not found in cookies");
        }

        Claims claims = jwtService.extractAllClaims(jwt);
        Number userIdNumber = (Number) claims.get("userId");
        if (userIdNumber == null) {
            throw new IllegalArgumentException("User ID not found in JWT claims");
        }

        Long userId = userIdNumber.longValue();
        Role role = Role.valueOf((String) claims.get("role"));

        return serviceRequestService.findServiceRequestsByUserIdAndRole(userId, role);
    }

    /**
     * Retrieves the customer details from a service request.
     *
     * @param request The HTTP servlet request.
     * @return The customer details.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_CUSTOMER')")
    @GetMapping("/customer-details")
    public Customer getCustomerDetailsFromServiceRequest(HttpServletRequest request) {
        Long customerId = extractUserIdFromRequest(request);
        return serviceRequestService.getCustomerDetails(customerId);
    }

    /**
     * Retrieves the service provider details from a service request.
     *
     * @param request The HTTP servlet request.
     * @return The service provider details.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_SERVICE_PROVIDER')")
    @GetMapping("/sp-details")
    public ServiceProvider getServiceProviderDetailsFromServiceRequest(HttpServletRequest request) {
        Long serviceProviderId = extractUserIdFromRequest(request);
        return serviceRequestService.getServiceProviderDetails(serviceProviderId);
    }

    /**
     * Extracts the user ID from the HTTP servlet request.
     *
     * @param request The HTTP servlet request.
     * @return The user ID.
     */
    private Long extractUserIdFromRequest(HttpServletRequest request) {
        String jwt = extractJwtFromRequest(request);
        Claims claims = jwtService.extractAllClaims(jwt);
        Number userIdNumber = (Number) claims.get("userId");
        if (userIdNumber == null) {
            throw new IllegalArgumentException("User ID not found in JWT claims");
        }

        return userIdNumber.longValue();
    }

    /**
     * Extracts the JWT from the HTTP servlet request.
     *
     * @param request The HTTP servlet request.
     * @return The JWT.
     */
    private String extractJwtFromRequest(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }

        throw new IllegalArgumentException("JWT not found in cookies");
    }
}

/**
 * Custom exception to handle service request not found.
 */
@ResponseStatus(HttpStatus.NOT_FOUND)
class ServiceRequestNotFoundException extends RuntimeException {
    public ServiceRequestNotFoundException(String message) {
        super(message);
    }
}
