import React, { useEffect, useState } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Modal,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  TextField,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import BlockIcon from '@mui/icons-material/Block';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import { getAllUsersAPI, blockUserAPI, unblockUserAPI } from '../../Services/allAPI';
import { toast } from 'react-toastify';

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

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
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>([]);

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
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        paddingLeft: { xs: 2, md: 10 },
        paddingTop: { xs: 2, md: 10 },
        paddingRight: { xs: 2, md: 3 },
      }}
    >
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-700">User Management</h1>
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

      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'gray.800' }}>
            <TableRow>
              {['#', 'User Photo', 'Username', 'Email', 'Actions'].map((header) => (
                <TableCell
                  key={header}
                  className="text-white font-semibold text-center"
                  sx={{ fontSize: '16px', padding: '12px' }}
                >
                  {header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <TableRow
                  key={user._id}
                  className="hover:bg-gray-100"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {index + 1}
                  </TableCell>
                  <TableCell className="text-center">
                    <Avatar
                      alt={user.username}
                      src={user.profileImage}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {user.username}
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {user.email}
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    <Button
                      onClick={() => handleOpenDialog(user)}
                      variant="contained"
                      color={user.isBlocked ? 'success' : 'error'}
                      startIcon={user.isBlocked ? <CheckCircleOutlineIcon /> : <BlockIcon />}
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

      {/* Dialog for Block/Unblock Confirmation */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{currentUser?.isBlocked ? 'Unblock User' : 'Block User'}</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to {currentUser?.isBlocked ? 'unblock' : 'block'} this user?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmAction} color="secondary">
            {currentUser?.isBlocked ? 'Unblock' : 'Block'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Modal for Viewing Images */}
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box
          sx={{
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            position: 'relative',
          }}
        >
          <IconButton
            onClick={() => setCurrentImageIndex((prevIndex) => Math.max(prevIndex - 1, 0))}
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowBackIosNewIcon />
          </IconButton>
          <img
            src={currentImages[currentImageIndex]}
            alt="User"
            style={{ width: '500px', height: 'auto' }}
          />
          <IconButton
            onClick={() => setCurrentImageIndex((prevIndex) => Math.min(prevIndex + 1, currentImages.length - 1))}
            sx={{
              position: 'absolute',
              top: '50%',
              right: 0,
              transform: 'translateY(-50%)',
            }}
          >
            <ArrowForwardIosIcon />
          </IconButton>
        </Box>
      </Modal>
    </Box>
  );
};

export default AdUsers;
