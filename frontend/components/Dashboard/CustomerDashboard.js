// Customer Dashboard provides the template for each page
// It is a drawer that contains the navigation bar and the content of the page

//import statements
import * as React from "react";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import Container from "@mui/material/Container";
import Link from "next/link";
import AddBoxIcon from "@mui/icons-material/AddBox";
import HistoryIcon from "@mui/icons-material/History";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import AccountCircleRoundedIcon from "@mui/icons-material/AccountCircleRounded";
import InboxIcon from "@mui/icons-material/MoveToInbox";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import LogoutIcon from "@mui/icons-material/Logout";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import ListItemIcon from "@mui/material/ListItemIcon";
import HomeIcon from "@mui/icons-material/Home";
import BarChartIcon from "@mui/icons-material/BarChart";
import IconButton from "@mui/material/IconButton";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Home from "./CustomerHome";
import { Dialog } from "@mui/material";
import { DialogTitle } from "@mui/material";
import { DialogContent } from "@mui/material";
import { DialogContentText } from "@mui/material";
import { DialogActions } from "@mui/material";
import { Button } from "@mui/material";
import Cookies from "js-cookie";
import {
  Experimental_CssVarsProvider as CssVarsProvider, useColorScheme
} from "@mui/material/styles";

//drawer and sidebar styling
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

//Drawer object
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
      width: theme.spacing(0),
      [theme.breakpoints.up("sm")]: {
        width: theme.spacing(9),
      },
    }),
  },
}));

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

//main dashboard function
//props contains the page content
export default function CustomerDash(props) {
  //drawer and sidebar state
  const [open, setOpen] = React.useState(true);
  const toggleDrawer = () => {
    setOpen(!open);
  };

  //functionality for opening the sidebar
  const [newOpen, setnewOpen] = React.useState(true);
  const handleClick = () => {
    setnewOpen(!newOpen);
  };

  //functionality for the logout dialog
  const [confirmLogout, setConfirmLogout] = React.useState(false);

  //functionality for the home button
  const [home, setHomeWindow] = React.useState(false);

  //router functionality
  const router = useRouter();
  const homePath = "/Customer";


  useEffect(() => {
    if (homePath === router.pathname) setHomeWindow(true);
  }, []);

  //functionality for the logout button
  const openDialog = async () => {
    setConfirmLogout(true);
  };

  //functionality for closing dialog
  const handleClose = () => {
    setConfirmLogout(false);
  };

  //logs out the user and redirects to the login page
  const logoutUser = async () => {
    Cookies.remove("JWT");
    router.push("/SignIn");
  };

  return (
    <CssVarsProvider>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />
        <AppBar position="absolute" open={open}>
          <Toolbar
            sx={{
              pr: "24px", // keep right padding when drawer closed
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
              Dashboard
            </Typography>
            <ModeToggle />
            <IconButton color="inherit">
              <Link href="/Customer/account" color="inherit">
                {
                  <AccountCircleRoundedIcon
                    style={{ color: "#FFFFFF" }}
                    fontSize="large"
                  />
                }
              </Link>
            </IconButton>
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
              <Link href="/Customer" passHref legacyBehavior color="inherit">
                <ListItemButton>
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                  <ListItemText primary="Home" />
                </ListItemButton>
              </Link>
              <Divider sx={{ my: 1 }} />
              <ListItemButton onClick={handleClick}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary="Requests" />
                {newOpen ? <ExpandLess /> : <ExpandMore />}
              </ListItemButton>
              <Collapse in={newOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link
                    href="/Customer/NewRequest"
                    passHref
                    legacyBehavior
                    color="inherit"
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <AddBoxIcon />
                      </ListItemIcon>
                      <ListItemText primary="New Request" />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
              <Collapse in={newOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link
                    href="/Customer/CurrentRequest"
                    passHref
                    legacyBehavior
                    color="inherit"
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <ContentPasteIcon />
                      </ListItemIcon>
                      <ListItemText primary="Current Requests" />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
              <Collapse in={newOpen} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  <Link
                    href="/Customer/PastRequests"
                    passHref
                    legacyBehavior
                    color="inherit"
                  >
                    <ListItemButton sx={{ pl: 4 }}>
                      <ListItemIcon>
                        <HistoryIcon />
                      </ListItemIcon>
                      <ListItemText primary="Past Requests" />
                    </ListItemButton>
                  </Link>
                </List>
              </Collapse>
              <Link
                href="/Customer/account"
                passHref
                legacyBehavior
                color="inherit"
              >
                <ListItemButton>
                  <ListItemIcon>
                    <AccountCircleRoundedIcon />
                  </ListItemIcon>
                  <ListItemText primary="Account Details" />
                </ListItemButton>
              </Link>
              <Link
                href="/Customer/Report"
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
            {props.children ? props.children : <Home />}
          </Container>
        </Box>
      </Box>
      <Dialog
        open={confirmLogout}
        onClose={handleClose}
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

//export default withAuth(CustomerDash, ["ROLE_CUSTOMER"]);
