//This holds the values of cost and startdate/time in one object so we can use @requestbody and get all the values.

package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.DateTimeRange;
import CSIT3214.GroupProject.Model.Skill;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalTime;

/**
 * Data transfer object for creating a service request.
 */
@Data
@Getter
@Setter
public class CreateServiceRequestDTO {

    /**
     * The ID of the service request.
     */
    private Long serviceRequestId;

    /**
     * The cost of the service request.
     */
    private Double cost;

    /**
     * The date and time range for the service request.
     */
    private DateTimeRange dateTimeRange;

    /**
     * The description of the service request.
     */
    private String description;

    /**
     * The type of service for the request.
     */
    @Enumerated(EnumType.STRING)
    private Skill serviceType;

    /**
     * Get the start date of the service request.
     *
     * @return The start date of the service request, or null if not set.
     */
    public LocalDate getStartDate() {
        if (dateTimeRange != null) {
            return dateTimeRange.getStartDate();
        }
        return null;
    }

    /**
     * Get the start time of the service request.
     *
     * @return The start time of the service request, or null if not set.
     */
    public LocalTime getStartTime() {
        if (dateTimeRange != null) {
            return dateTimeRange.getStartTime();
        }
        return null;
    }

    /**
     * Get the end date of the service request.
     *
     * @return The end date of the service request, or null if not set.
     */
    public LocalDate getEndDate() {
        if (dateTimeRange != null) {
            return dateTimeRange.getEndDate();
        }
        return null;
    }

    /**
     * Get the end time of the service request.
     *
     * @return The end time of the service request, or null if not set.
     */
    public LocalTime getEndTime() {
        if (dateTimeRange != null) {
            return dateTimeRange.getEndTime();
        }
        return null;
    }

    /**
     * Get the service type of the request.
     *
     * @return The service type of the request.
     */
    public Skill getServiceType() {
        return serviceType;
    }
}