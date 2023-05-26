package CSIT3214.GroupProject.API;

import CSIT3214.GroupProject.DataAccessLayer.CreateReviewDTO;
import CSIT3214.GroupProject.DataAccessLayer.ReviewResponseDTO;
import CSIT3214.GroupProject.Model.Review;
import CSIT3214.GroupProject.Service.ReviewService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;

/**
 * The ReviewController class is a REST controller that handles API requests related to reviews.
 */
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    /**
     * Retrieves all reviews.
     *
     * @return A list of all reviews.
     */
    @PreAuthorize("hasAuthority('ROLE_SYSTEM_ADMIN')")
    @GetMapping("/all")
    public List<Review> getAllReviews() {
        return reviewService.findAllReviews();
    }

    /**
     * Retrieves a review by ID.
     *
     * @param id The review ID.
     * @return The review with the specified ID.
     */
    @PreAuthorize("hasAnyAuthority('ROLE_SYSTEM_ADMIN', 'ROLE_CUSTOMER', 'ROLE_SERVICE_PROVIDER')")
    @GetMapping("/{id}")
    public ReviewResponseDTO getReview(@PathVariable Long id) {
        Review review = reviewService.findReviewById(id);
        return toDTO(review);
    }

    /**
     * Converts a Review entity to a ReviewResponseDTO.
     *
     * @param review The Review entity.
     * @return The corresponding ReviewResponseDTO.
     */
    public ReviewResponseDTO toDTO(Review review) {
        ReviewResponseDTO dto = new ReviewResponseDTO();
        dto.setId(review.getId());
        dto.setCustomerId(review.getCustomer().getId());
        dto.setServiceProviderId(review.getServiceProvider().getId());
        dto.setServiceRequestId(review.getServiceRequest().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        return dto;
    }

    /**
     * Creates a new review.
     *
     * @param reviewDto The CreateReviewDTO containing the review data.
     * @return The created review.
     */
    @PostMapping
    public Review createReview(@RequestBody CreateReviewDTO reviewDto) {
        return reviewService.saveReview(reviewDto);
    }

    /**
     * Deletes a review by ID.
     *
     * @param id The review ID.
     */
    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id) {
        reviewService.deleteReview(id);
    }
}