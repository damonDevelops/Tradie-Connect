package CSIT3214.GroupProject.Service;

import CSIT3214.GroupProject.Model.GeoCoding.GeocodingResponse;
import CSIT3214.GroupProject.Model.GeoCoding.GeocodingResult;
import CSIT3214.GroupProject.Model.GeoCoding.LatLng;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

/**
 * Service class for geocoding operations.
 * This class provides a method to retrieve the latitude and longitude coordinates
 * for a given suburb and state using the Google Geocoding API.
 */
@Service
public class GeocodingService {

    private static final Logger logger = LoggerFactory.getLogger(GeocodingService.class);

    /**
     * Retrieves the latitude and longitude coordinates for a given suburb and state.
     *
     * @param suburbName the name of the suburb
     * @param state      the state of the suburb
     * @return the latitude and longitude coordinates as a LatLng object,
     *         or null if the coordinates cannot be fetched
     */
    public LatLng getLatLng(String suburbName, String state) {
        logger.info("Fetching lat/lng for suburb: {}, state: {}", suburbName, state);
        String baseUrl = "https://maps.googleapis.com/maps/api/geocode/json";
        String address = String.format("%s, %s, Australia", suburbName, state);
        String apiKey = "AIzaSyAV4VcwlPdfyWJA1MYMUcCwgqakZYn9wMk"; // Replace with your own API key

        // Build the URL with query parameters
        UriComponentsBuilder builder = UriComponentsBuilder.fromHttpUrl(baseUrl)
                .queryParam("address", address)
                .queryParam("key", apiKey);

        RestTemplate restTemplate = new RestTemplate();
        ResponseEntity<GeocodingResponse> response = restTemplate.getForEntity(builder.toUriString(), GeocodingResponse.class);

        if (response.getStatusCode() == HttpStatus.OK) {
            GeocodingResponse geocodingResponse = response.getBody();
            if (geocodingResponse != null && !geocodingResponse.getResults().isEmpty()) {
                GeocodingResult result = geocodingResponse.getResults().get(0);
                LatLng location = result.getGeometry().getLocation();
                logger.info("Fetched lat/lng: lat={}, lng={}", location.getLat(), location.getLng());
                return location;
            } else {
                logger.warn("Empty or null geocoding response");
            }
        } else {
            logger.error("Error fetching lat/lng, status code: {}", response.getStatusCode());
        }

        return null;
    }
}
