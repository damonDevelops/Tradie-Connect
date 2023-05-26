package CSIT3214.GroupProject.Authentication;

import CSIT3214.GroupProject.Model.Role;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
public class RegisterRequest {

    private String email;
    private String password;
    private Role role;

    /**
     * Constructor for the RegisterRequest class.
     *
     * @param email    the user's email
     * @param password the user's password
     * @param role     the user's role
     */
    public RegisterRequest(String email, String password, Role role) {
        this.email = email;
        this.password = password;
        this.role = role;
    }
}