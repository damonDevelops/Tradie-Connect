package CSIT3214.GroupProject.Model;

/**
 * An enumeration representing different status of an order.
 */
public enum OrderStatus {
    CREATED,                              // Order created status
    ACCEPTED,                             // Order accepted status
    STARTED,                              // Order started status
    COMPLETED,                            // Order completed status
    REJECTED,                             // Order rejected status
    QUOTED_AWAITING_CUSTOMER_APPROVAL,    // Order quoted and awaiting customer approval status
    APPROVED_BY_CUSTOMER,                 // Order approved by customer status
    PENDING                               // Order pending status
}