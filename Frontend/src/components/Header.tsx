import React, { useContext, useState, MouseEvent, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Avatar,
  Popper,
  Paper,
  ClickAwayListener,
  MenuItem,
  ListItemIcon,
} from "@mui/material";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EngineeringIcon from "@mui/icons-material/Engineering";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import Logout from "@mui/icons-material/Logout";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { tokenAuthenticationContext } from "../ContextAPI/TokenAuth";
import { toast } from "react-toastify";

const Header: React.FC = () => {
  const authContext = useContext(tokenAuthenticationContext);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [isAuthorized, setIsAuthorized] = useState<boolean>(false);
  const navigate = useNavigate();

  const { setUser, user }: any = authContext;

  if (!authContext) {
    throw new Error("useContext must be used within a TokenAuth provider");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && userData) {
      setIsAuthorized(true);
      setUser(JSON.parse(userData));
    } else {
      setIsAuthorized(false);
      setUser(null);
    }
  }, []);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMenuOpen = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setOpen(true);
  };

  const handleMenuClose = () => {
    setOpen(false);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    toast.success("Logout Successfully");
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("worker");

    setIsAuthorized(false);
    authContext.setIsAuthorized(false);
    setUser(null); // Ensure the user state is cleared
    handleMenuClose();
    navigate("/"); // Redirect to the home page or login page
  };

  const profileImageUrl = user?.profileImage;
  console.log(profileImageUrl);

  return (
    <header className="bg-gray-900 text-white py-4 fixed top-0 left-0 w-full z-50 shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center px-4">
        <div className="flex items-center space-x-2">
          <EngineeringIcon fontSize="large" className="text-teal-400" />
          <Link to="/" className="text-2xl font-bold hover:text-teal-400">
            WorkNet
          </Link>
        </div>
        <nav className="hidden md:flex space-x-6">
          <button
            onClick={() => scrollToSection("home")}
            className="hover:text-teal-400"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection("about")}
            className="hover:text-teal-400"
          >
            About
          </button>
          <button
            onClick={() => scrollToSection("services")}
            className="hover:text-teal-400"
          >
            Services
          </button>
          <button
            onClick={() => scrollToSection("Footer")}
            className="hover:text-teal-400"
          >
            Contact
          </button>
        </nav>
        <div className="flex items-center space-x-3">
          {isAuthorized ? (
            <div className="relative flex items-center space-x-2">
              <Avatar
                src={profileImageUrl}
                alt="Profile Picture"
                className="w-8 h-8 cursor-pointer border-2 border-teal-500"
                onClick={handleMenuOpen}
              />
              <Popper
                open={open}
                anchorEl={anchorEl}
                placement="bottom-end"
                disablePortal
              >
                <ClickAwayListener onClickAway={handleMenuClose}>
                  <Paper elevation={3} className="w-48">
                    <div className="flex flex-col">
                      <Button
                        variant="text"
                        onClick={handleProfileClick}
                        className="w-full text-left hover:bg-gray-200"
                      >
                        View Profile
                      </Button>
                      <Link to="/help">
                        <MenuItem onClick={handleMenuClose}>
                          <ListItemIcon>
                            <HelpOutlineIcon fontSize="small" />
                          </ListItemIcon>
                          Help
                        </MenuItem>
                      </Link>
                      <MenuItem onClick={handleLogoutClick}>
                        <ListItemIcon>
                          <Logout fontSize="small" />
                        </ListItemIcon>
                        Logout
                      </MenuItem>
                      
                    </div>
                  </Paper>
                </ClickAwayListener>
              </Popper>
              <Link to="/myBooking">
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-teal-500 hover:bg-teal-600 flex items-center space-x-1"
                >
                  <CalendarTodayIcon />
                  <span>Appointments</span>
                </Button>
              </Link>
              <Link to="/register">
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-teal-500 hover:bg-teal-600 flex items-center space-x-2"
                >
                  <PersonAddIcon />
                  <span>Register</span>
                </Button>
              </Link>
            
            </div>
          ) : (
            <>
              <Link to="/login">
                <Button
                  variant="outlined"
                  color="inherit"
                  className="border-teal-400 text-teal-400 hover:bg-teal-500 hover:text-white"
                >
                  Login
                </Button>
              </Link>
              <Link to="/signup">
                <Button
                  variant="contained"
                  color="primary"
                  className="bg-teal-500 hover:bg-teal-600 flex items-center space-x-2"
                >
                  <PersonAddIcon />
                  <span>Signup</span>
                </Button>
              </Link>
            </>
          )}
        </div>
        <button className="md:hidden text-white hover:text-teal-400">
          {/* Mobile menu button */}
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            ></path>
          </svg>
        </button>
      </div>
    </header>
  );
};

export default Header;
