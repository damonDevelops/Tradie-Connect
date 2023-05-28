import Cookies from "js-cookie";
import jwtDecode from "jwt-decode";

// checks if user has a valid cookie
export function checkLogin() {
  const cookie = Cookies.get("JWT"); // checks if cookie exists
  if (cookie == null) {
    return false;
  }

  return true;
}

//checks the users role, also checks if the user is logged in/has a valid cookie
export function checkRole() {
  if (!checkLogin()) return null;

  const token = Cookies.get("JWT");
  const decoded = jwtDecode(token);
  
  return decoded.role;
}
