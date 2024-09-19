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
  Typography,
  CircularProgress,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Pagination,
  InputAdornment,
} from '@mui/material';
import { Search } from '@mui/icons-material';
import { getAdminCategoriesAPI, addCategoryAPI, editCategoryAPI } from '../../Services/allAPI';
import { toast } from 'react-toastify';


interface Category {
  _id: string;
  name: string;
  description: string;
}

const AdCategory: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openAddModal, setOpenAddModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [newCategoryName, setNewCategoryName] = useState<string>('');
  const [newCategoryDescription, setNewCategoryDescription] = useState<string>('');
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [page, setPage] = useState(1);
  const [categoriesPerPage] = useState(5);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('adtoken');
        if (!token) throw new Error('No token found');

        const response = await getAdminCategoriesAPI(token);
        setCategories(response);
        setFilteredCategories(response);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredCategories(categories);
    } else {
      const filtered = categories.filter((category) =>
        category.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCategories(filtered);
    }
  };

  const handleAddCategory = async () => {
    if (/\s/.test(newCategoryName)) {
      toast.error('Category name should not contain spaces');
      return;
    }

    try {
      const token = localStorage.getItem('adtoken');
      if (!token) throw new Error('No token found');

      await addCategoryAPI(
        { name: newCategoryName, description: newCategoryDescription },
        token
      );

      toast.success('Category added successfully!');
      handleCloseAddModal();

      // Refresh categories list
      const response = await getAdminCategoriesAPI(token);
      setCategories(response);
      setFilteredCategories(response);
    } catch (err: any) {
      console.error('Error adding category:', err);

      if (err) {
        toast.error('Category already exists');
      } else {
        toast.error('Failed to add category');
      }
    }
  };

  const handleEditCategory = async () => {
    if (/\s/.test(newCategoryName)) {
      toast.error('Category name should not contain spaces');
      return;
    }

    try {
      if (!currentCategory) return;
      const token = localStorage.getItem('adtoken');
      if (!token) throw new Error('No token found');

      await editCategoryAPI(currentCategory._id, {
        name: newCategoryName,
        description: newCategoryDescription,
      }, token);

      toast.success('Category updated successfully!');
      handleCloseEditModal();

      // Refresh categories list
      const response = await getAdminCategoriesAPI(token);
      setCategories(response);
      setFilteredCategories(response);
    } catch (err: any) {
      console.error('Error editing category:', err);
      toast.error('Failed to edit category');
    }
  };

  const handleOpenAddModal = () => setOpenAddModal(true);
  const handleCloseAddModal = () => {
    setOpenAddModal(false);
    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  const handleOpenEditModal = (category: Category) => {
    setCurrentCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryDescription(category.description);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setCurrentCategory(null);
    setNewCategoryName('');
    setNewCategoryDescription('');
  };

  const indexOfLastCategory = page * categoriesPerPage;
  const indexOfFirstCategory = indexOfLastCategory - categoriesPerPage;
  const currentCategories = filteredCategories.slice(indexOfFirstCategory, indexOfLastCategory);
  const totalPages = Math.ceil(filteredCategories.length / categoriesPerPage);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
      <h1 className="text-3xl font-bold text-gray-700">Category Management</h1>
      <Box display="flex" alignItems="center">
          <Button variant="contained" color="primary" onClick={handleOpenAddModal} sx={{ mr: 2 }}>
            Add Category
          </Button>
          <TextField
            placeholder="Search Category..."
            variant="outlined"
            size="small"

            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
            }}
            className="w-80 bg-white rounded-md shadow-sm"

          />
        </Box>
      </Box>
      <TableContainer
        component={Paper}
        elevation={3}
        sx={{ borderRadius: 2, overflow: 'hidden', boxShadow: 3 }}
      >
        <Table sx={{ minWidth: 650 }}>
          <TableHead sx={{ bgcolor: 'gray.800' }}>
            <TableRow>
              {['#', 'Category Name', 'Description', 'Actions'].map((header) => (
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
            {currentCategories.length > 0 ? (
              currentCategories.map((category, index) => (
                <TableRow
                  key={category._id}
                  className="hover:bg-gray-100"
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {indexOfFirstCategory + index + 1}
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {category.name}
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    {category.description}
                  </TableCell>
                  <TableCell className="text-center" sx={{ fontSize: '16px', padding: '12px' }}>
                    <Button variant="contained" color="secondary" onClick={() => handleOpenEditModal(category)}>
                      Edit
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  No categories found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={4}>
        <Pagination
          count={totalPages}
          page={page}
          onChange={(_e, value) => setPage(value)}
          color="primary"
        />
      </Box>

      {/* Add Category Modal */}
      <Dialog open={openAddModal} onClose={handleCloseAddModal}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent>
          <TextField
            label="Category Name"
            fullWidth
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            margin="normal"
          />
          <TextField
            label="Category Description"
            fullWidth
            value={newCategoryDescription}
            onChange={(e) => setNewCategoryDescription(e.target.value)}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddModal} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddCategory} color="primary">
            Add
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Category Modal */}
      {currentCategory && (
        <Dialog open={openEditModal} onClose={handleCloseEditModal}>
          <DialogTitle>Edit Category</DialogTitle>
          <DialogContent>
            <TextField
              label="Category Name"
              fullWidth
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              margin="normal"
            />
            <TextField
              label="Category Description"
              fullWidth
              value={newCategoryDescription}
              onChange={(e) => setNewCategoryDescription(e.target.value)}
              margin="normal"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditModal} color="primary">
              Cancel
            </Button>
            <Button onClick={handleEditCategory} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default AdCategory;
