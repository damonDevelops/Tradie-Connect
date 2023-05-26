package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.User;
import org.springframework.security.core.GrantedAuthority;

import java.util.Collection;

/**
 * Custom implementation of UserDetails that extends org.springframework.security.core.userdetails.User.
 * This class includes additional user information.
 */
public class CustomUserDetails extends org.springframework.security.core.userdetails.User {

    private final User user;

    /**
     * Constructs a CustomUserDetails object with the provided user and authorities.
     *
     * @param user        The user associated with the UserDetails.
     * @param authorities The authorities granted to the user.
     */
    public CustomUserDetails(User user, Collection<? extends GrantedAuthority> authorities) {
        super(user.getEmail(), user.getPassword(), authorities);
        this.user = user;
    }

    /**
     * Retrieves the associated User object.
     *
     * @return The User object.
     */
    public User getUser() {
        return user;
    }

}