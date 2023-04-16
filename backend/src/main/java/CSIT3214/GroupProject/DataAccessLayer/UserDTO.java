package CSIT3214.GroupProject.DataAccessLayer;

import CSIT3214.GroupProject.Model.Membership;
import CSIT3214.GroupProject.Model.Role;
import CSIT3214.GroupProject.Model.Suburb;
import lombok.Data;

@Data
public class UserDTO {
    private String email;
    private String password;
    private Role role;
    // Customer fields
    private String firstName;
    private String lastName;
    // ServiceProvider fields
    private String companyName;
    private String abn;
    // Common fields
    private String phoneNumber;
    private String streetAddress;
    private Suburb suburb;
    private String postCode;
    //private Membership membership;
}