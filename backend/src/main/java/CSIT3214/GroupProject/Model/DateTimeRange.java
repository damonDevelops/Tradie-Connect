package CSIT3214.GroupProject.Model;

import java.time.LocalDate;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;

/**
 * A class representing a range of dates and times.
 */
public class DateTimeRange {
    private String startDate;
    private String endDate;
    private String startTime;
    private String endTime;

    /**
     * Get the start date of the range.
     *
     * @return The start date as a LocalDate object, or null if not set.
     */
    public LocalDate getStartDate() {
        if (startDate != null) {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return LocalDate.parse(startDate, dateFormatter);
        }
        return null;
    }

    /**
     * Get the start time of the range.
     *
     * @return The start time as a LocalTime object, or null if not set.
     */
    public LocalTime getStartTime() {
        if (startTime != null) {
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mma");
            return LocalTime.parse(startTime, timeFormatter);
        }
        return null;
    }

    /**
     * Get the end date of the range.
     *
     * @return The end date as a LocalDate object, or null if not set.
     */
    public LocalDate getEndDate() {
        if (endDate != null) {
            DateTimeFormatter dateFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
            return LocalDate.parse(endDate, dateFormatter);
        }
        return null;
    }

    /**
     * Get the end time of the range.
     *
     * @return The end time as a LocalTime object, or null if not set.
     */
    public LocalTime getEndTime() {
        if (endTime != null) {
            DateTimeFormatter timeFormatter = DateTimeFormatter.ofPattern("h:mma");
            return LocalTime.parse(endTime, timeFormatter);
        }
        return null;
    }
}