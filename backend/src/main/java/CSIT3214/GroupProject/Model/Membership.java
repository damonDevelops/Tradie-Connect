package CSIT3214.GroupProject.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * An entity class representing a membership.
 */
@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Membership {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private MembershipType membershipType;
    private Double price;
    private String description;

    /**
     * Constructs a new Membership object with the given parameters.
     *
     * @param newMembershipType The membership type.
     * @param amount            The price of the membership.
     * @param description       The description of the membership.
     */
    public Membership(MembershipType newMembershipType, Double amount, String description) {
        this.membershipType = newMembershipType;
        this.price = amount;
        this.description = description;
    }
}