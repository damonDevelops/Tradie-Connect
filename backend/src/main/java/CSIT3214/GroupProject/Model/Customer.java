package CSIT3214.GroupProject.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * Entity class representing a customer.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor(force = true)
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class Customer extends User {
    private String firstName;
    private String lastName;

    @OneToMany(mappedBy = "customer")
    @JsonIdentityReference(alwaysAsId = true)
    //@JsonManagedReference("customer-serviceRequests")
    private List<ServiceRequest> serviceRequests;

    @OneToMany(mappedBy = "customer")
    @JsonIdentityReference(alwaysAsId = true)
    private List<Review> reviews;

    @Embedded
    private PaymentInformation paymentInformation;

    @Override
    public String getPassword()  { return super.getPassword(); }
    @Override
    public String getUsername() {
        return this.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    @Override
    public String toString() {
        return "Customer{" +
                "id=" + this.getId() +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                '}';
    }

}