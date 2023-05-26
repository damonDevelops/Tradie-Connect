package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.*;
import CSIT3214.GroupProject.Model.Review;
import CSIT3214.GroupProject.Model.ServiceProvider;
import CSIT3214.GroupProject.Model.ServiceRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service class for review operations.
 * This class provides methods to retrieve, save, and delete reviews,
 * calculate the average rating for a service provider, and perform
 * related operations.
 */
@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves all reviews.
     *
     * @return a list of all reviews
     */
    public List<Review> findAllReviews() {
        return reviewRepository.findAll();
    }

    /**
     * Retrieves a review by its ID.
     *
     * @param id the ID of the review
     * @return the review with the specified ID, or null if not found
     */
    public Review findReviewById(Long id) {
        return reviewRepository.findById(id).orElse(null);
    }

    /**
     * Saves a review.
     * This method creates a new review based on the provided review DTO,
     * associates it with the corresponding service request, service provider,
     * and customer, calculates the average rating for the service provider,
     * and updates it in the database.
     *
     * @param reviewDto the review DTO containing the review details
     * @return the saved review
     */
    @Transactional
    public Review saveReview(CreateReviewDTO reviewDto) {
        Review review = new Review();
        ServiceRequest sr = serviceRequestRepository.findById(reviewDto.getServiceRequestId()).orElse(null);
        assert sr != null;
        sr.setReview(review);
        ServiceProvider sp = serviceProviderRepository.findById(reviewDto.getServiceProviderId()).orElse(null);
        review.setCustomer(customerRepository.findById(reviewDto.getCustomerId()).orElse(null));
        review.setServiceProvider(sp);
        review.setServiceRequest(sr);
        review.setRating(reviewDto.getRating());
        review.setComment(reviewDto.getComment());

        // Save the review first to the database
        Review savedReview = reviewRepository.save(review);

        // Then update the ServiceProvider's average rating
        assert sp != null;
        Double newAverageRating = calculateAverageRating(sp);
        sp.setRating(newAverageRating);

        // Save the updated ServiceProvider to the database
        serviceProviderRepository.save(sp);

        return savedReview;
    }

    /**
     * Calculates the average rating for a service provider.
     *
     * @param serviceProvider the service provider for which to calculate the average rating
     * @return the average rating, or null if no reviews are available
     */
    public Double calculateAverageRating(ServiceProvider serviceProvider) {
        List<Review> reviews = serviceProvider.getReviews();
        if (reviews.isEmpty()) {
            return null;
        }
        Double sum = 0.0;
        for (Review review : reviews) {
            sum += review.getRating();
        }
        return sum / reviews.size();
    }

    /**
     * Deletes a review by its ID.
     *
     * @param id the ID of the review to be deleted
     */
    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

}