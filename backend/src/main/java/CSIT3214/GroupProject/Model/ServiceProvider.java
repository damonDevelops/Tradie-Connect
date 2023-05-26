package CSIT3214.GroupProject.Model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIdentityReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.*;

/**
 * Entity class representing a service provider.
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class ServiceProvider extends User {
    private String companyName;
    private Double rating;
    private String Abn;

    @ElementCollection(targetClass = Skill.class)
    @CollectionTable(name = "service_provider_skill",
            joinColumns = @JoinColumn(name = "service_provider_id"))
    @Enumerated(EnumType.STRING)
    private Set<Skill> skills = EnumSet.noneOf(Skill.class);

    @OneToMany(mappedBy = "serviceProvider")
    @JsonIdentityReference(alwaysAsId = true)
    //@JsonManagedReference("serviceProvider-serviceRequests")
    private List<ServiceRequest> serviceRequests;

    @OneToMany(mappedBy = "serviceProvider")
    @JsonIdentityReference(alwaysAsId = true)
    private List<Review> reviews = new ArrayList<>();

    @JsonManagedReference
    @ManyToMany(mappedBy = "qualifiedServiceProviders")
    @JsonIdentityReference(alwaysAsId = true)
    private Set<ServiceRequest> qualifiedServiceRequests = new HashSet<>();

    /**
     * Adds a skill to the set of skills for this service provider.
     *
     * @param skill the skill to add
     */
    public void addSkill(Skill skill) {
        skills.add(skill);
    }

    /**
     * Removes a skill from the set of skills for this service provider.
     *
     * @param skill the skill to remove
     */
    public void removeSkill(Skill skill) {
        skills.remove(skill);
    }

    @Override
    public String toString() {
        return "ServiceProvider{" +
                "id=" + this.getId() +
                ", companyName='" + companyName + '\'' +
                ", rating=" + rating +
                ", Abn='" + Abn + '\'' +
                '}';
    }

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((Abn == null) ? 0 : Abn.hashCode());
        result = prime * result + ((companyName == null) ? 0 : companyName.hashCode());
        result = prime * result + ((rating == null) ? 0 : rating.hashCode());
        return result;
    }

    @Override
    public String getPassword() {
        return super.getPassword();
    }

    @Override
    public String getUsername() {
        return this.getEmail();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}