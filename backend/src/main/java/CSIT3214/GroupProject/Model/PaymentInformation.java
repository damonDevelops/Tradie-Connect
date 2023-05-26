package CSIT3214.GroupProject.Model;

import jakarta.persistence.*;
import lombok.*;


/**
 * A class representing payment information.
 */
@Data
@NoArgsConstructor
@Embeddable
public class PaymentInformation {
    private String cardName;
    private String cardNumber;
    private String cardExpiry;
    private String cardCVV;

    /**
     * Constructs a new instance of PaymentInformation with the provided card details.
     *
     * @param cardName    the name on the card
     * @param cardNumber  the card number
     * @param cardExpiry  the card expiry date
     * @param cardCVV     the card CVV number
     */
    public PaymentInformation(String cardName, String cardNumber, String cardExpiry, String cardCVV) {
        this.cardName = cardName;
        this.cardNumber = cardNumber;
        this.cardExpiry = cardExpiry;
        this.cardCVV = cardCVV;
    }
}