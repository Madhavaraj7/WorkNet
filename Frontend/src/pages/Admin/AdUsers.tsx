import React, { useState, useEffect } from 'react';
import { getAllUsersAPI, blockUserAPI, unblockUserAPI } from '../../Services/allAPI';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Avatar,
  TextField,
  IconButton,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  CircularProgress,
  Box,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { toast} from 'react-toastify';

interface User {
  _id: string;
  username: string;
  email: string;
  profileImage: string;
  isBlocked: boolean;
}

const AdUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem('adtoken');
        if (!token) throw new Error('No token found');
        
        const response = await getAllUsersAPI(token);
        setUsers(response);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUsers();
  }, []);

  const handleOpenDialog = (user: User) => {
    setCurrentUser(user);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentUser(null);
  };

  const handleConfirmAction = async () => {
    if (currentUser) {
      try {
        const token = localStorage.getItem('adtoken');
        if (!token) throw new Error('No token found');

        // Update the UI optimistically
        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === currentUser._id ? { ...user, isBlocked: !currentUser.isBlocked } : user
          )
        );

        // Call the appropriate API based on the current status
        if (currentUser.isBlocked) {
          await unblockUserAPI(currentUser._id, token);
          toast.success('User unblocked successfully');
        } else {
          await blockUserAPI(currentUser._id, token);
          toast.success('User blocked successfully');
        }

      } catch (err) {
        console.error('Failed to update user status', err);
        setError('Failed to update user status');
      } finally {
        handleCloseDialog();
      }
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography variant="h6" color="error" align="center">
        {error}
      </Typography>
    );
  }

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="mb-6">
      <h1 className="text-3xl font-bold text-gray-700">User Mangement</h1>

      </div>
      <div className="flex justify-between items-center mb-4">
        
        <TextField
          label="Search Users"
          variant="outlined"
          size="small"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            endAdornment: (
              <IconButton>
                <SearchIcon />
              </IconButton>
            ),
          }}
          className="w-80 bg-white rounded-md shadow-sm"
        />
      </div>
      <TableContainer component={Paper} className="shadow-md rounded-lg">
        <Table>
          <TableHead>
            <TableRow>
              <TableCell className="font-semibold">#</TableCell>
              <TableCell className="font-semibold">User Photo</TableCell>
              <TableCell className="font-semibold">Username</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow key={user._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <Avatar
                      alt={user.username}
                      src={user.profileImage}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleOpenDialog(user)}
                      variant="contained"
                      color={user.isBlocked ? 'success' : 'error'}
                      className="text-white"
                    >
                      {user.isBlocked ? 'Unblock' : 'Block'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No users found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Confirmation Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
      >
        <DialogTitle>{currentUser?.isBlocked ? 'Unblock User' : 'Block User'}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {currentUser?.isBlocked ? 'unblock' : 'block'} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      {/* Toast Container */}
    </div>
  );
}

export default AdUsers;
