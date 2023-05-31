import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { checkRole } from "../hooks/checkUser";

// with auth determins if user is authorised to view a certain page
const withAuth = (WrappedComponent, allowedRoles) => {
  const Authenticate = (props) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
      // Check if the user has the necessary role to access the page
      if (allowedRoles.includes(checkRole())) {
        setIsAuthorized(true);
      } else {
        router.push("/unauthorized");
      }
    }, []);

    // Render the wrapped component if the user has the necessary role
    return isAuthorized ? <WrappedComponent {...props} /> : null;
  };

  // Set the display name for debugging purposes
  Authenticate.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || "Component"
  })`;

  return Authenticate;
};

export default withAuth;
