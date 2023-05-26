package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.PaymentRepository;
import CSIT3214.GroupProject.Model.Payment;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Service class for payment operations.
 * This class provides methods to interact with the payment gateway,
 * create charges, save payments, and retrieve all payments.
 */
@Service
public class PaymentService {

    @Value("${stripe.api.key}")
    private String stripeApiKey;

    @Autowired
    private PaymentRepository paymentRepository;

    /**
     * Initializes the Stripe API key.
     * This method is executed after the dependencies are injected.
     */
    @PostConstruct
    public void init() {
        Stripe.apiKey = stripeApiKey;
    }

    /**
     * Creates a charge using the provided token and amount.
     *
     * @param token  the token representing the payment source
     * @param amount the amount to be charged in the smallest currency unit (e.g., cents)
     * @return the created charge object
     * @throws StripeException if an error occurs during the charge creation process
     */
    public Charge createCharge(String token, int amount) throws StripeException {
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", amount);
        chargeParams.put("currency", "usd");
        chargeParams.put("source", token);
        chargeParams.put("description", "Example charge");

        return Charge.create(chargeParams);
    }

    /**
     * Saves a payment.
     *
     * @param payment the payment to be saved
     * @return the saved payment
     */
    public Payment savePayment(Payment payment) {
        return paymentRepository.save(payment);
    }

    /**
     * Retrieves all payments.
     *
     * @return a list of all payments
     */
    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }
}