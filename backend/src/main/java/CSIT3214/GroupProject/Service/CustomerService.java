package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.CustomerRepository;
import CSIT3214.GroupProject.Model.Customer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

/**
 * Service class for managing customers.
 * This class provides methods to retrieve, save, and delete customers.
 */
@Service
public class CustomerService {

    @Autowired
    private CustomerRepository customerRepository;

    /**
     * Retrieves all customers from the repository.
     *
     * @return a list of all customers
     */
    public List<Customer> findAllCustomers() {
        return customerRepository.findAll();
    }

    /**
     * Retrieves a customer by their ID.
     *
     * @param id the ID of the customer
     * @return the customer with the specified ID, or null if not found
     */
    public Customer findCustomerById(Long id) {
        return customerRepository.findById(id).orElse(null);
    }

    /**
     * Saves a customer in the repository.
     *
     * @param customer the customer to be saved
     * @return the saved customer
     */
    public Customer saveCustomer(Customer customer) {
        return customerRepository.save(customer);
    }

    /**
     * Deletes a customer from the repository by their ID.
     *
     * @param id the ID of the customer to be deleted
     */
    public void deleteCustomer(Long id) {
        customerRepository.deleteById(id);
    }

}