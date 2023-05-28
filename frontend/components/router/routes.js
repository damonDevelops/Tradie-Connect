import SignIn from "../../pages/SignIn";
import SignUp from "../../pages/SignUp";


const routes = [
  {
    path: "/SignUp",
    component: SignUp,
    allowedRoles: ["Admin", "CUSTOMER", "SERVICE_PROVIDER"],
  },
  {
    path: "/SignIn",
    component: SignIn,
    allowedRoles: ["Admin", "CUSTOMER", "SERVICE_PROVIDER"],
  },
];
