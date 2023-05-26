package CSIT3214.GroupProject.Config;

import CSIT3214.GroupProject.API.SystemAdminController;
import CSIT3214.GroupProject.DataAccessLayer.SystemAdminRepository;
import CSIT3214.GroupProject.Model.Role;
import CSIT3214.GroupProject.Model.SystemAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/**
 * Component class to initialize data upon application startup.
 */
@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemAdminRepository systemAdminRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemAdminController systemAdminController;

    /**
     * Constructor for the DataInitializer class.
     *
     * @param systemAdminRepository the SystemAdminRepository
     * @param passwordEncoder       the PasswordEncoder
     * @param systemAdminController the SystemAdminController
     */
    @Autowired
    public DataInitializer(SystemAdminRepository systemAdminRepository, PasswordEncoder passwordEncoder, SystemAdminController systemAdminController) {
        this.systemAdminRepository = systemAdminRepository;
        this.passwordEncoder = passwordEncoder;
        this.systemAdminController = systemAdminController;
    }

    /**
     * Method to run the data initialization process.
     *
     * @param args the command line arguments
     */
    @Override
    public void run(String... args) {
        createSystemAdmin();
        generateTestData();
    }

    /**
     * Method to create the system admin user.
     */
    private void createSystemAdmin() {
        String email = "admin@example.com";
        if (systemAdminRepository.findByEmail(email).isEmpty()) {
            SystemAdmin systemAdmin = new SystemAdmin();
            systemAdmin.setEmail(email);
            systemAdmin.setPassword(passwordEncoder.encode("password"));
            systemAdmin.setRole(Role.ROLE_SYSTEM_ADMIN);
            systemAdminRepository.save(systemAdmin);
            System.out.println("System admin saved");
        }
    }

    /**
     * Method to generate test data.
     */
    private void generateTestData() {
        systemAdminController.generateTestData();
        System.out.println("Test Data successfully generated");
    }
}