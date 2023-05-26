package CSIT3214.GroupProject.Authentication;

import CSIT3214.GroupProject.Model.User;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class AuthenticationResponse {

    private String token;
    private User user;

    /**
     * Constructor for the AuthenticationResponse class.
     *
     * @param token the JWT token
     * @param user  the authenticated user
     */
    public AuthenticationResponse(String token, User user) {
        this.token = token;
        this.user = user;
    }
}