package CSIT3214.GroupProject.DataAccessLayer;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * Data transfer object for creating a review.
 */
@Data
@Getter
@Setter
public class CreateReviewDTO {

    /**
     * The ID of the customer associated with the review.
     */
    private Long customerId;

    /**
     * The ID of the service provider associated with the review.
     */
    private Long serviceProviderId;

    /**
     * The ID of the service request associated with the review.
     */
    private Long serviceRequestId;

    /**
     * The rating given in the review.
     */
    private Double rating;

    /**
     * The comment provided in the review.
     */
    private String comment;

}