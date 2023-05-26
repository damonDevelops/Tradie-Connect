package CSIT3214.GroupProject.Model.GeoCoding;

import lombok.Data;

import java.util.List;

/**
 * Data class representing the response from the Geocoding API.
 */
@Data
public class GeocodingResponse {
    private List<GeocodingResult> results;
    private String status;
}
