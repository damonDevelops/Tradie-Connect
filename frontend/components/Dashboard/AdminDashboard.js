// Main dashboard for admin users
// Provides the template (sidebar, header, etc.) for the admin dashboard
// takes props from children to display the content

// import statements
import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import Link from "next/link";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import BuildIcon from "@mui/icons-material/Build";
import AdminHome from "./AdminHome";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";
import withAuth from "../../components/router/withAuth";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import {
  Experimental_CssVarsProvider as CssVarsProvider,
  experimental_extendTheme as extendTheme,
  useColorScheme,
} from "@mui/material/styles";

//styling for the drawer and appbar
const drawerWidth = 240;
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

//Drawer styling
const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  "& .MuiDrawer-paper": {
    position: "relative",
    whiteSpace: "nowrap",
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
    boxSizing: "border-box",
    ...(!open && {
      overflowX: "hidden",
      transition: theme.transitions.create("width", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      width: theme.spacing(7),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

//custom theme for admin dashboard
const theme = extendTheme({
  palette: {
    primary: {
      main: "#43a047",
    },
    secondary: {
      main: "#c5e1a5",
    },
  },
});

//function that returns the light/dark mode button and edits the pages current theme
function ModeToggle() {
  const { mode, setMode } = useColorScheme();
  return (
    <IconButton
      onClick={() => {
        setMode(mode === "light" ? "dark" : "light");
      }}
      color="inherit"
    >
      {mode === "dark" ? (
        <Brightness7Icon fontSize="large" />
      ) : (
        <Brightness4Icon fontSize="large" />
      )}
    </IconButton>
  );
}

function AdminDash(props) {
  //state variables for logout
  const [confirmLogout, setConfirmLogout] = React.useState(false);
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //function to open the logout dialog
  const openDialog = async () => {
    setConfirmLogout(true);
  };

  //function to close the logout dialog
  const handleClose = () => {
    setConfirmLogout(false);
  };

  //router and home path for admin
  const router = useRouter();
  const homePath = "/Service-Provider";

  //function to logout the user
  const logoutUser = async () => {
    Cookies.remove("JWT");
    router.push("/SignIn");
  };

  //content
  return (
    <CssVarsProvider theme={theme}>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", 
            }}
          >
            <IconButton
              edge="start"
              color="inherit"
              aria-label="open drawer"
              onClick={toggleDrawer}
              sx={{
                marginRight: "36px",
                ...(open && { display: "none" }),
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              component="h1"
              variant="h6"
              color="inherit"
              noWrap
              sx={{ flexGrow: 1 }}
            >
              Admin Dashboard
            </Typography>
            <ModeToggle />
            <IconButton color="inherit" onClick={openDialog}>
              {<LogoutIcon style={{ color: "#FFFFFF" }} fontSize="large" />}
            </IconButton>
          </Toolbar>
        </AppBar>
        <Drawer variant="permanent" open={open}>
          <Toolbar
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              px: [1],
            }}
          >
            <IconButton onClick={toggleDrawer}>
              <ChevronLeftIcon />
            </IconButton>
          </Toolbar>
          <Divider />
          <List component="nav">
            <React.Fragment>
              <Link href="/Admin" passHref legacyBehavior color="inherit">
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
              <Divider sx={{ my: 1 }} />
              <Link
                href="/Admin/Customers"
                passHref
                legacyBehavior
                color="inherit"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Customers" />
                </ListItemButton>
              </Link>
              <Link
                href="/Admin/ServiceProviders"
                passHref
                legacyBehavior
                color="inherit"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <BuildIcon />
                  </ListItemIcon>
                  <ListItemText primary="Service Providers" />
                </ListItemButton>
              </Link>
              <Link
                href="/Admin/Requests"
                passHref
                legacyBehavior
                color="inherit"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <InboxIcon />
                  </ListItemIcon>
                  <ListItemText primary="Requests" />
                </ListItemButton>
              </Link>
              <Link
                href="/Admin/Reports"
                passHref
                legacyBehavior
                color="inherit"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <BarChartIcon />
                  </ListItemIcon>
                  <ListItemText primary="Reports" />
                </ListItemButton>
              </Link>
            </React.Fragment>
            <Divider sx={{ my: 1 }} />
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            {/* {home ? <Home /> : props.children} */}
            {props.children ? props.children : <AdminHome />}
          </Container>
        </Box>
      </Box>
      <Dialog
        open={confirmLogout}
        //onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle
          style={{
            backgroundColor: "inherit",
            color: "inherit",
          }}
          id="alert-dialog-title"
        >
          {"Are you sure you want to log out?"}
        </DialogTitle>
        <DialogContent
          style={{
            backgroundColor: "inherit",
          }}
        >
          <DialogContentText
            style={{
              backgroundColor: "inherit",
              color: "inherit",
            }}
            id="alert-dialog-description"
          >
            Logging out will end your session and you will be required to log
            back in. Are you sure you want to log out?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          style={{
            backgroundColor: "inherit",
          }}
        >
          <Button autoFocus onClick={logoutUser}>
            Logout
          </Button>
          <Button autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </CssVarsProvider>
  );
}

export default withAuth(AdminDash, ["ROLE_SYSTEM_ADMIN"]); // make sure to remove customer



