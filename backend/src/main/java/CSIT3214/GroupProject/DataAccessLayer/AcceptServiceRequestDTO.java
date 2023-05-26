package CSIT3214.GroupProject.DataAccessLayer;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * Data Transfer Object (DTO) class representing the acceptance of a service request.
 */
@Data
@Getter
@Setter
public class AcceptServiceRequestDTO {
    /**
     * The ID of the service request being accepted.
     */
    private Long serviceRequestId;
}