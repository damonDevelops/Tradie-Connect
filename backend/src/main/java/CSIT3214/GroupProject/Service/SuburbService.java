package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.DataAccessLayer.SuburbRepository;
import CSIT3214.GroupProject.Model.Suburb;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Optional;

/**
 * Service class for suburb operations.
 * This class provides methods to find or create suburbs,
 * update suburb coordinates, and retrieve suburb details.
 */
@Service
public class SuburbService {
    @Autowired
    private SuburbRepository suburbRepository;
    private static final Logger logger = LoggerFactory.getLogger(SuburbService.class);

    /**
     * Finds or creates a suburb.
     * This method attempts to find a suburb with the given name and state.
     * If found, it checks if the coordinates are already set.
     * If not set, it updates the suburb with the provided latitude and longitude.
     * If not found, it creates a new suburb with the given details.
     *
     * @param name      the name of the suburb
     * @param state     the state of the suburb
     * @param latitude  the latitude of the suburb
     * @param longitude the longitude of the suburb
     * @return the found or created suburb
     */
    public Suburb findOrCreateSuburb(String name, String state, double latitude, double longitude) {
        Optional<Suburb> existingSuburb = suburbRepository.findByNameAndState(name, state);

        if (existingSuburb.isPresent()) {
            Suburb currentSuburb = existingSuburb.get();
            if (currentSuburb.getLatitude() == 0.0 && currentSuburb.getLongitude() == 0.0) {
                // Update the existing suburb with the new latitude and longitude values
                currentSuburb.setLatitude(latitude);
                currentSuburb.setLongitude(longitude);
                return suburbRepository.save(currentSuburb);
            } else {
                return currentSuburb;
            }
        } else {
            Suburb newSuburb = new Suburb();
            newSuburb.setName(name);
            newSuburb.setState(state);
            newSuburb.setLatitude(latitude);
            newSuburb.setLongitude(longitude);
            return suburbRepository.save(newSuburb);
        }
    }

    /**
     * Updates the coordinates of a suburb.
     * This method updates the coordinates of the provided suburb with the given latitude and longitude values.
     *
     * @param suburb    the suburb to be updated
     * @param latitude  the new latitude value
     * @param longitude the new longitude value
     * @return the updated suburb
     */
    private Suburb updateSuburb(Suburb suburb, double latitude, double longitude) {
        suburb.setLatitude(latitude);
        suburb.setLongitude(longitude);
        return suburbRepository.save(suburb);
    }

    /**
     * Finds a suburb by name and state.
     * This method attempts to find a suburb with the given name and state.
     * It checks if the found suburb has valid coordinates.
     * If valid, it returns the suburb.
     * If the coordinates are not set, it returns the suburb with empty coordinates.
     * If multiple suburbs are found without valid coordinates or empty coordinates,
     * it logs a warning and returns null.
     *
     * @param name  the name of the suburb
     * @param state the state of the suburb
     * @return the found suburb with valid coordinates, or the suburb with empty coordinates,
     * or null if multiple suburbs without valid or empty coordinates are found
     */
    public Suburb findSuburbByNameAndState(String name, String state) {
        Optional<Suburb> existingSuburb = suburbRepository.findByNameAndState(name, state);
        if (existingSuburb.isPresent()) {
            Suburb validSuburb = existingSuburb.filter(suburb -> suburb.getLatitude() != 0.0 && suburb.getLongitude() != 0.0).orElse(null);
            if (validSuburb != null) {
                return validSuburb;
            } else {
                Suburb emptyCoordinatesSuburb = existingSuburb.filter(suburb -> suburb.getLatitude() == 0.0 && suburb.getLongitude() == 0.0).orElse(null);
                if (emptyCoordinatesSuburb != null) {
                    return emptyCoordinatesSuburb;
                } else {
                    // Multiple suburbs found, but none with valid coordinates or empty coordinates
                    logger.warn("Multiple suburbs found with name: {} and state: {}", name, state);
                    return null;
                }
            }
        } else {
            return null;
        }
    }
}