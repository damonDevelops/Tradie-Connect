package CSIT3214.GroupProject.API;

import CSIT3214.GroupProject.Config.JwtService;
import CSIT3214.GroupProject.Model.Role;
import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * The BaseController class is an abstract class that provides common functionality for API controllers.
 */
public abstract class BaseController {

    @Autowired
    protected JwtService jwtService;

    /**
     * Retrieves the user ID and role from the JWT stored in the request cookies.
     *
     * @param request The HTTP servlet request.
     * @return An instance of UserIdAndRole containing the user ID and role.
     * @throws IllegalArgumentException if the JWT is not found in cookies or if the user ID is not found in the JWT claims.
     */
    protected UserIdAndRole getUserIdAndRoleFromJwt(HttpServletRequest request) {
        String jwt = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("JWT".equals(cookie.getName())) {
                    jwt = cookie.getValue();
                    break;
                }
            }
        }

        if (jwt == null) {
            // Handle the case when JWT is not found in cookies.
            throw new IllegalArgumentException("JWT not found in cookies");
        }

        Claims claims = jwtService.extractAllClaims(jwt);
        Number userIdNumber = (Number) claims.get("userId");
        if (userIdNumber == null) {
            throw new IllegalArgumentException("User ID not found in JWT claims");
        }

        Long userId = userIdNumber.longValue();
        Role role = Role.valueOf((String) claims.get("role"));

        return new UserIdAndRole(userId, role);
    }

    /**
     * Inner class representing the user ID and role.
     */
    @NoArgsConstructor
    @AllArgsConstructor
    protected static class UserIdAndRole {
        private Long userId;
        private Role role;

        /**
         * Returns the user ID.
         *
         * @return The user ID.
         */
        public Long getUserId() {
            return userId;
        }

        /**
         * Returns the user's role.
         *
         * @return The user's role.
         */
        public Role getRole() {
            return role;
        }


        /**
         * Sets the user's role.
         *
         * @param role The user's role to set.
         */
        public void setRole(Role role) {
            this.role = role;
        }
    }
}