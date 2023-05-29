import React from "react";
import axios from "axios";

// creates context
export const CurrentUserContext = React.createContext();

// function returns current user information
export const CurrentUserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = React.useState(null);

  const instance = axios.create({
    withCredentials: true,
  });

  const fetchCurrentUser = async () => {
    try {
      let response = await instance.get("http://localhost:8080/api/customers");

      setCurrentUser(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <CurrentUserContext.Provider value={{ currentUser, fetchCurrentUser }}>
      {children}
    </CurrentUserContext.Provider>
  );
};

export const useCurrentUser = () => React.useContext(CurrentUserContext);
