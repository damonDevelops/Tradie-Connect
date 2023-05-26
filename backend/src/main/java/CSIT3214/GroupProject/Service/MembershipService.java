package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.MembershipRepository;
import CSIT3214.GroupProject.Model.Membership;
import CSIT3214.GroupProject.Model.MembershipType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for membership operations.
 * This class provides methods to manage memberships, including saving, updating,
 * retrieving membership types, retrieving all memberships, and deleting memberships by ID.
 */
@Service
public class MembershipService {

    @Autowired
    private MembershipRepository membershipRepository;

    /**
     * Saves a membership.
     *
     * @param membership the membership to be saved
     * @return the saved membership
     */
    public Membership saveMembership(Membership membership) {
        return membershipRepository.save(membership);
    }

    /**
     * Updates a membership.
     *
     * @param membership the membership to be updated
     * @return the updated membership
     */
    public Membership updateMembership(Membership membership) {
        return membershipRepository.save(membership);
    }

    /**
     * Retrieves the membership type for the given membership ID.
     *
     * @param id the ID of the membership
     * @return the membership type associated with the ID, or null if not found
     */
    public MembershipType getMembershipTypeById(Long id) {
        Membership membership = membershipRepository.findById(id).orElse(null);
        return membership != null ? membership.getMembershipType() : null;
    }

    /**
     * Retrieves all memberships.
     *
     * @return a list of all memberships
     */
    public List<Membership> getAllMemberships() {
        return membershipRepository.findAll();
    }

    /**
     * Deletes a membership by ID.
     *
     * @param id the ID of the membership to be deleted
     */
    public void deleteMembershipById(Long id) {
        membershipRepository.deleteById(id);
    }
}