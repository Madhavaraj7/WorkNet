import React, { useState, useEffect, useContext } from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import EngineeringIcon from "@mui/icons-material/Engineering";
import Avatar from "@mui/material/Avatar";
import { Badge, Button, Divider } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ReviewsIcon from "@mui/icons-material/Reviews";
import ReportIcon from "@mui/icons-material/Report";
import MessageIcon from "@mui/icons-material/Message";
import Person4Icon from "@mui/icons-material/Person4";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { tokenAuthenticationContext } from '../../ContextAPI/AdminAuth';
import { io } from "socket.io-client";
import { getUnreadMessagesCount } from "../../Services/allAPI";

// Initialize socket connection
// const socket = io("https://worknet.onrender.com");
const socket = io("http://localhost:3000"); // for localhost


const drawerWidth = 240;

const Drawer = styled(MuiDrawer)(({ theme }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  "& .MuiDrawer-paper": {
    width: drawerWidth,
    backgroundColor: "#2D3748",
    padding: theme.spacing(2),
  },
}));

const AppBar = styled(MuiAppBar)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  backgroundColor: "#1F2937",
  color: "#FFFFFF",
  padding: theme.spacing(1, 2),
  boxShadow: theme.shadows[10],
  marginLeft: drawerWidth,
  width: `calc(100% - ${drawerWidth}px)`,
}));

const AdHeader: React.FC = () => {
  const navigate = useNavigate();
  const [activeIcon, setActiveIcon] = useState<string>("home");
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const authContext = useContext(tokenAuthenticationContext);

  const handleIconClick = (iconName: string) => {
    setActiveIcon(iconName);
    navigate("/ad" + iconName);
  };

  const handleLogout = () => {
    if (authContext) {
      toast.success("Logged Out Successfully");
      localStorage.removeItem("admin");
      localStorage.removeItem("adtoken");
      authContext.setIsAuthorized(false);
      authContext.setAdmin(undefined);
      setTimeout(() => {
        navigate("/admin");
      }, 2000);
    }
  };

  const token = localStorage.getItem("adtoken") || '';

  const fetchUnreadCount = async () => {
    try {
      if (authContext?.admin?._id) {
        const response = await getUnreadMessagesCount(authContext.admin._id, token);
        setUnreadCount(response.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });
  
    fetchUnreadCount();
  
    socket.on("unreadCount", (data) => {
      console.log("Unread count received:", data);
      setUnreadCount(data.unreadCount);
    });
  
    return () => {
      socket.off("unreadCount");
    };
  }, [authContext?.admin?._id]);

  useEffect(() => {
    if (authContext?.admin?._id) {
      socket.emit('userOnline', authContext.admin._id); 
    }
  }, [authContext?.admin?._id]);

  return (
    <Box>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar className="flex justify-between items-center">
          <div className="flex items-center">
            <EngineeringIcon fontSize="large" className="text-teal-400" />
            <Link to="/adHome" className="text-2xl font-bold hover:text-teal-400">WORKNET</Link>
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
      <Drawer variant="permanent">
        <Box className="flex flex-col items-center py-5">
          <Avatar
            src={authContext?.admin?.profileImage}
            alt="Admin Profile"
            sx={{ width: 100, height: 100, border: "4px solid #3B82F6" }}
          />
          <Typography
            variant="h6"
            className="mt-4 text-white"
            style={{ fontWeight: 600 }}
          >
            {authContext?.admin?.username}
          </Typography>
          <Typography variant="body2" className="text-gray-400">
            Admin
          </Typography>
        </Box>
        <Divider />
        <List>
          {[ 
            "home", "users", "workers", "Category", "reviews", "revenue", "messages", "profile"
          ].map((icon) => (
            <React.Fragment key={icon}>
              <div
                onClick={() => handleIconClick(icon)}
                className="flex items-center px-4 py-2 cursor-pointer hover:bg-gray-700 transition-colors"
                style={{
                  color: activeIcon === icon ? "#3B82F6" : "#FFFFFF",
                }}
              >
                {icon === "home" && <HomeIcon className="me-3" fontSize="large" />}
                {icon === "users" && <PeopleAltIcon className="me-3" fontSize="large" />}
                {icon === "workers" && <PeopleAltIcon className="me-3" fontSize="large" />}
                {icon === "Category" && <BarChartIcon className="me-3" fontSize="large" />}
                {icon === "reviews" && <ReviewsIcon className="me-3" fontSize="large" />}
                {icon === "revenue" && <ReportIcon className="me-3" fontSize="large" />}
                {icon === "messages" && (
                  <Badge badgeContent={unreadCount} color="error">
                    <MessageIcon className="me-3" fontSize="large" />
                  </Badge>
                )}
                {icon === "profile" && <Person4Icon className="me-3" fontSize="large" />}
                <Typography className="font-semibold">{icon}</Typography>
              </div>
            </React.Fragment>
          ))}
        </List>
      </Drawer>
    </Box>
  );
};

export default AdHeader;
