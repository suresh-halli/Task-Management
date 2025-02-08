import React, { useState } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { auth } from "./firebase";
import MenuOpenIcon from '@mui/icons-material/MenuOpen';

const Appbar = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    auth.signOut();
    handleMenuClose();
  };

  return (
    <AppBar position="sticky" style={{backgroundColor:"#80c3ff", }}>
      <Toolbar>
        <Typography  variant="h6" sx={{ flexGrow: 1 }}>
          Task Manager
        </Typography>

        {user ? (
          <>
            <IconButton color="inherit" onClick={handleMenuOpen}>
              <MenuOpenIcon />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              keepMounted
            >
              <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>
                Profile
              </MenuItem>
              <MenuItem component={Link} to="/kanban" onClick={handleMenuClose}>
                Kanban Board
              </MenuItem>
              <MenuItem component={Link} to="/taskdetails" onClick={handleMenuClose}>
               Tasks
              </MenuItem>
              <MenuItem component={Link} to="/logs" onClick={handleMenuClose}>
                Logs
              </MenuItem>
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            </Menu>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Sign Up
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Appbar;
