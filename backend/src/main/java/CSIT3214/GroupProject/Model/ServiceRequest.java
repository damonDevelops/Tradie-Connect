package CSIT3214.GroupProject.Model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.HashSet;
import java.util.Set;

/**
 * A class representing service requests.
 */
@Entity
@Data
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ServiceRequest {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "customer_id")
    //@JsonBackReference("customer-serviceRequests")
    private Customer customer;

    @ManyToOne
    @JoinColumn(name = "service_provider_id")
    //@JsonBackReference("serviceProvider-serviceRequests")
    private ServiceProvider serviceProvider;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Skill serviceType;

    @OneToMany(mappedBy = "serviceRequest")
    private Set<ServiceRequestApplicant> applicants = new HashSet<>();

    @OneToOne
    private Review review;

    @JsonBackReference
    @ManyToMany
    @JoinTable(
            name = "service_request_qualified_providers",
            joinColumns = @JoinColumn(name = "service_request_id"),
            inverseJoinColumns = @JoinColumn(name = "service_provider_id")
    )
    private Set<ServiceProvider> qualifiedServiceProviders = new HashSet<>();

    @CreationTimestamp
    private LocalDate requestedDate;
    private LocalTime requestedTime;
    private LocalDate scheduledStartDate;
    private LocalTime scheduledStartTime;
    private LocalDate scheduledEndDate;
    private LocalTime scheduledEndTime;
    private LocalDate completedOn;
    private LocalTime completedAt;
    @Enumerated(EnumType.STRING)
    private OrderStatus status;
    private Double cost;
    @Lob
    private String description;

    /**
     * Adds a service request applicant to the set of applicants for this service request.
     *
     * @param applicant the service request applicant to add
     */
    public void addApplicant(ServiceRequestApplicant applicant) {
        this.applicants.add(applicant);
    }

    /**
     * Accepts a service provider for this service request and updates the qualified service providers accordingly.
     * Removes the jobs from the losers who didn't get selected.
     *
     * @param serviceProvider the service provider to accept
     */
    public void acceptServiceProvider(ServiceProvider serviceProvider) {
        // Remove the jobs from the losers who didn't get selected
        for (ServiceProvider sp : qualifiedServiceProviders) {
            sp.getQualifiedServiceRequests().remove(this);
        }
        qualifiedServiceProviders.clear(); // Clear the qualifiedServiceProviders set for this service request

        this.applicants.remove(serviceProvider);
        this.serviceProvider = serviceProvider;
    }

    @Override
    public String toString() {
        return "ServiceRequest{" +
                "id=" + id +
                ", serviceType=" + serviceType +
                ", status=" + status +
                '}';
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((description == null) ? 0 : description.hashCode());
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((serviceType == null) ? 0 : serviceType.hashCode());
        result = prime * result + ((status == null) ? 0 : status.hashCode());
        return result;
    }
}