import React, { useState, useEffect, useContext } from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import EngineeringIcon from "@mui/icons-material/Engineering";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReportIcon from "@mui/icons-material/Report";
import MessageIcon from "@mui/icons-material/Message";
import Person4Icon from "@mui/icons-material/Person4";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Badge, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import { toast } from "react-toastify";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { tokenAuthenticationContext } from '../../ContextAPI/TokenAuth'; // Adjust the import path as needed

const drawerWidth = 240;

const openedMixin = (theme: any) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
  backgroundColor: "#2D3748", // Dark gray
  boxShadow: theme.shadows[4],
});

const closedMixin = (theme: any) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
  backgroundColor: "#2D3748", // Dark gray
});

const DrawerHeader = styled("div")(({ theme }: any) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})<{ open?: boolean }>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#1F2937", // bg-gray-900
  color: "#FFFFFF", // text-white
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  padding: theme.spacing(1, 2), // py-4
  boxShadow: theme.shadows[10], // shadow-lg
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }: any) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface AdHeaderProps {}

const AdHeader: React.FC<AdHeaderProps> = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const [open, setOpen] = useState<boolean>(false);
  const [activeIcon, setActiveIcon] = useState<string>("home");
  const authContext = useContext(tokenAuthenticationContext);

  const handleIconClick = (iconName: string) => {
    setActiveIcon(iconName);
    navigate("/ad" + iconName);
  };

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (location.pathname === "/adhome") {
      setOpen(true);
      setActiveIcon("home");
    } else {
      setOpen(false);
      setActiveIcon(location.pathname.split("/").pop() || "home");
    }
  }, [location.pathname]);

  const handleLogout = () => {
    if (authContext) {
      toast.success("Logged Out Successfully");
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      authContext.setIsAuthorized(false);
      authContext.setUser(undefined);
      setTimeout(() => {
        navigate("/admin"); // Redirect to the admin login page
      }, 2000); // Delay to allow toast message to be visible
    }
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar className="flex justify-between items-center">
          <IconButton
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 2,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon style={{ color: "#FFFFFF" }} />
          </IconButton>
          <div className="flex items-center">
          <EngineeringIcon fontSize="large" className="text-teal-400" />
          <Link to="/adHome" className="text-2xl font-bold hover:text-teal-400">WorkNet</Link>
          </div>
          <div className="flex space-x-4">
            <Badge badgeContent={0} color="error">
              <NotificationsIcon
                onClick={() => handleIconClick("approve")}
                style={{
                  color: activeIcon === "approve" ? "#3B82F6" : "#FFFFFF",
                }}
                fontSize="large"
                className="cursor-pointer"
              />
            </Badge>
            <Button
              onClick={handleLogout}
              color="error"
              variant="contained"
              startIcon={<LogoutIcon />}
              style={{ textTransform: "none", color: "#FFFFFF" }}
            >
              LogOut
            </Button>
          </div>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon style={{ color: "#FFFFFF" }} />
            ) : (
              <ChevronLeftIcon style={{ color: "#FFFFFF" }} />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List className="mt-5">
          {[
            "home",
            "users",
            "analytics",
            "reviews",
            "report",
            "messages",
            "profile",
          ].map((icon) => (
            <React.Fragment key={icon}>
              <div
                onClick={() => handleIconClick(icon)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
                style={{ color: activeIcon === icon ? "#3B82F6" : "#FFFFFF" }}
              >
                {icon === "home" && (
                  <HomeIcon className="me-3" fontSize="large" />
                )}
                {icon === "users" && (
                  <PeopleAltIcon className="me-3" fontSize="large" />
                )}
                {icon === "analytics" && (
                  <BarChartIcon className="me-3" fontSize="large" />
                )}
                {icon === "reviews" && (
                  <ReviewsIcon className="me-3" fontSize="large" />
                )}
                {icon === "report" && (
                  <ReportIcon className="me-3" fontSize="large" />
                )}
                {icon === "messages" && (
                  <MessageIcon className="me-3" fontSize="large" />
                )}
                {icon === "profile" && (
                  <Person4Icon className="me-3" fontSize="large" />
                )}
                <Typography variant="h6">{icon}</Typography>
              </div>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default AdHeader;
