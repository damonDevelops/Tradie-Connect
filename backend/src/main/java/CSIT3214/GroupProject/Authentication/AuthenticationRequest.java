package CSIT3214.GroupProject.Authentication;

import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class AuthenticationRequest {

    private String email;
    private String password;

    /**
     * Constructor for the AuthenticationRequest class.
     *
     * @param email    the user's email
     * @param password the user's password
     */
    public AuthenticationRequest(String email, String password) {
        this.email = email;
        this.password = password;
    }
}