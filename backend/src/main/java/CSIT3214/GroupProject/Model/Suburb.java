package CSIT3214.GroupProject.Model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * A class representing suburbs.
 */
@Entity
@Data
@NoArgsConstructor
public class Suburb {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private double latitude;
    private double longitude;
    private String state;

    /**
     * Constructs a new Suburb object with the specified attributes.
     *
     * @param id        the ID of the suburb
     * @param name      the name of the suburb
     * @param latitude  the latitude coordinate of the suburb
     * @param longitude the longitude coordinate of the suburb
     * @param state     the state in which the suburb is located
     */
    public Suburb(Long id, String name, double latitude, double longitude, String state) {
        this.id = id;
        this.name = name;
        this.latitude = latitude;
        this.longitude = longitude;
        this.state = state;
    }
}