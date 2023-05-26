package CSIT3214.GroupProject.Config;

import CSIT3214.GroupProject.API.SystemAdminController;
import CSIT3214.GroupProject.DataAccessLayer.SystemAdminRepository;
import CSIT3214.GroupProject.Model.Role;
import CSIT3214.GroupProject.Model.SystemAdmin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    private final SystemAdminRepository systemAdminRepository;
    private final PasswordEncoder passwordEncoder;
    private final SystemAdminController systemAdminController;

    @Autowired
    public DataInitializer(SystemAdminRepository systemAdminRepository, PasswordEncoder passwordEncoder, SystemAdminController systemAdminController) {
        this.systemAdminRepository = systemAdminRepository;
        this.passwordEncoder = passwordEncoder;
        this.systemAdminController = systemAdminController;
    }

    @Override
    public void run(String... args) {
        createSystemAdmin();
        generateTestData();
    }

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

    private void generateTestData() {
        systemAdminController.generateTestData();
        System.out.println("Test Data successfully generated");
    }
}