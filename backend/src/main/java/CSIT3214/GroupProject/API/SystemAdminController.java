package CSIT3214.GroupProject.API;

import CSIT3214.GroupProject.DataAccessLayer.*;
import CSIT3214.GroupProject.Model.*;
import com.github.javafaker.Faker;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.HashSet;
import java.util.Locale;
import java.util.concurrent.TimeUnit;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/admin")
public class SystemAdminController {

    @Autowired
    private CustomerRepository customerRepository;

    @Autowired
    private ServiceProviderRepository serviceProviderRepository;

    @Autowired
    private ServiceRequestRepository serviceRequestRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private SuburbRepository suburbRepository;
    @Autowired
    private  MembershipRepository membershipRepository;

    private static final Faker faker = new Faker(new Locale("en-AU"));

    @PreAuthorize("hasAnyAuthority('ROLE_SYSTEM_ADMIN', 'ROLE_CUSTOMER', 'ROLE_SERVICE_PROVIDER')")
    @PostMapping("/generateTestData")
    public void generateTestData() {
        for (int i = 0; i < 100; i++) {
            Suburb suburb = generateSuburb();
            Customer customer = generateCustomer(suburb);
            ServiceProvider serviceProvider = generateServiceProvider(suburb);
            for (int j = 0; j < 5; j++) {
                ServiceRequest serviceRequest = generateServiceRequest(customer, serviceProvider);
                serviceRequest = serviceRequestRepository.save(serviceRequest);
                generateReview(customer, serviceProvider, serviceRequest);
                generatePayment(customer, serviceProvider);
            }
        }
    }

    private Suburb generateSuburb() {
        Suburb suburb = new Suburb();
        suburb.setName(faker.address().cityName());
        suburb.setLatitude(Double.parseDouble(faker.address().latitude()));
        suburb.setLongitude(Double.parseDouble(faker.address().longitude()));
        suburb.setState(faker.address().state());
        return suburbRepository.save(suburb);
    }

    private Customer generateCustomer(Suburb suburb) {
        Customer customer = new Customer();
        customer.setEmail(faker.internet().emailAddress());
        customer.setPassword(faker.internet().password());
        customer.setFirstName(faker.name().firstName());
        customer.setLastName(faker.name().lastName());
        customer.setStreetAddress(faker.address().streetAddress());
        customer.setPhoneNumber("0400000000");
        customer.setSuburb(suburb);
        customer.setRole(Role.ROLE_CUSTOMER);
        PaymentInformation paymentInfo = generatePaymentInfo();
        customer.setPaymentInformation(paymentInfo);

        Membership customerMembership = new Membership();
        customerMembership.setMembershipType(faker.options().option(MembershipType.CLIENT_SUBSCRIPTION, MembershipType.PAY_ON_DEMAND));
        customerMembership.setPrice(faker.number().randomDouble(2, 10, 200)); // example price
        customerMembership.setDescription(faker.lorem().sentence());
        customer.setMembership(membershipRepository.save(customerMembership));
        return customerRepository.save(customer);
    }

    private ServiceProvider generateServiceProvider(Suburb suburb) {
        ServiceProvider serviceProvider = new ServiceProvider();
        serviceProvider.setEmail(faker.internet().emailAddress());
        serviceProvider.setPassword(faker.internet().password());
        serviceProvider.setStreetAddress(faker.address().streetAddress());
        serviceProvider.setPhoneNumber("0400000000");
        serviceProvider.setCompanyName(faker.company().name());
        serviceProvider.setAbn("51824753556");
        serviceProvider.setSkills(new HashSet<>(Arrays.asList(Skill.values())));
        serviceProvider.setSuburb(suburb);
        serviceProvider.setRole(Role.ROLE_SERVICE_PROVIDER);

        Membership serviceProviderMembership = new Membership();
        serviceProviderMembership.setMembershipType(faker.options().option(MembershipType.SERVICE_PROVIDER_SUBSCRIPTION, MembershipType.COMMISSION));
        serviceProviderMembership.setPrice(faker.number().randomDouble(2, 10, 200)); // example price
        serviceProviderMembership.setDescription(faker.lorem().sentence());
        serviceProvider.setMembership(membershipRepository.save(serviceProviderMembership));

        return serviceProviderRepository.save(serviceProvider);
    }

    private ServiceRequest generateServiceRequest(Customer customer, ServiceProvider serviceProvider) {
        ServiceRequest serviceRequest = new ServiceRequest();
        serviceRequest.setCustomer(customer);
        serviceRequest.setServiceProvider(serviceProvider);
        serviceRequest.setStatus(OrderStatus.CREATED);
        serviceRequest.setCost((double) faker.number().numberBetween(1,45000));
        serviceRequest.setServiceType(Skill.values()[faker.random().nextInt(Skill.values().length)]);
        serviceRequest.setRequestedDate(LocalDate.now());
        serviceRequest.setRequestedTime(LocalTime.now());
        serviceRequest.setScheduledStartDate(faker.date().future(10, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        serviceRequest.setScheduledStartTime(LocalTime.now().plusHours(faker.number().numberBetween(1, 5)));
        serviceRequest.setScheduledEndDate(faker.date().future(20, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        serviceRequest.setScheduledEndTime(LocalTime.now().plusHours(faker.number().numberBetween(6, 10)));
        serviceRequest.setCompletedOn(faker.date().past(10, TimeUnit.DAYS).toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        serviceRequest.setCompletedAt(LocalTime.now().minusHours(faker.number().numberBetween(1, 5)));
        return serviceRequest;
    }

    public Review generateReview(Customer customer, ServiceProvider serviceProvider, ServiceRequest serviceRequest) {
        Review review = new Review();
        review.setCustomer(customer);
        review.setServiceProvider(serviceProvider);
        review.setServiceRequest(serviceRequest);  // Linking the review to a service request
        serviceRequest.setStatus(OrderStatus.COMPLETED);
        review.setRating(faker.number().randomDouble(2, 1, 5));
        review.setComment(faker.lorem().paragraph());
        review = reviewRepository.save(review);  // Save the review and assign the returned persisted entity back to review

        serviceProvider.getReviews().add(review);
        double averageRating = serviceProvider.getReviews().stream().mapToDouble(Review::getRating).average().orElse(1.0);
        serviceProvider.setRating(averageRating);
        serviceProviderRepository.save(serviceProvider);

        serviceRequest.setReview(review);  // set the saved review to the service request
        serviceRequestRepository.save(serviceRequest);

        return review;
    }


    private PaymentInformation generatePaymentInfo() {
        PaymentInformation paymentInfo = new PaymentInformation();
        paymentInfo.setCardName(faker.name().fullName());
        paymentInfo.setCardNumber(faker.finance().creditCard());
        paymentInfo.setCardExpiry(faker.business().creditCardExpiry());
        paymentInfo.setCardCVV("555");
        return paymentInfo;
    }

    private Payment generatePayment(Customer customer, ServiceProvider serviceProvider) {
        Payment payment = new Payment();
        payment.setAmount(faker.number().randomDouble(2, 10, 1000));
        payment.setTransactionDate(LocalDateTime.now());
        payment.setCustomer(customer);
        payment.setServiceProvider(serviceProvider);
        return paymentRepository.save(payment);
    }
}