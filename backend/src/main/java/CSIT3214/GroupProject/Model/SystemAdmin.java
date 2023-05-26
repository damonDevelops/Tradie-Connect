package CSIT3214.GroupProject.Model;

import jakarta.persistence.Entity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;


@Entity
@Data
@AllArgsConstructor
@EqualsAndHashCode(callSuper = false)
public class SystemAdmin extends User {

    /**
     * Retrieves the password of the system admin.
     *
     * @return the password of the system admin
     */
    @Override
    public String getPassword() {
        return super.getPassword();
    }

    /**
     * Retrieves the username of the system admin, which is the email address.
     *
     * @return the email address of the system admin
     */
    @Override
    public String getUsername() {
        return this.getEmail();
    }

    /**
     * Checks if the system admin's account is not expired.
     *
     * @return always returns true for the system admin
     */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /**
     * Checks if the system admin's account is not locked.
     *
     * @return always returns true for the system admin
     */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /**
     * Checks if the system admin's credentials are not expired.
     *
     * @return always returns true for the system admin
     */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * Checks if the system admin's account is enabled.
     *
     * @return always returns true for the system admin
     */
    @Override
    public boolean isEnabled() {
        return true;
    }
}