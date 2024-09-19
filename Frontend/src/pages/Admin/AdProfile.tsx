import React, { useState, useEffect } from 'react';
import { Button, TextField, CircularProgress, Avatar } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { updateAdminProfileAPI } from "../../Services/allAPI"; 
import { toast } from "react-toastify";
import AdHeader from '../../components/Admin/AdHeader';

interface UserProfile {
  profileImage: File | string;
  username: string;
  email: string;
}

function AdProfile() {
  const [profileImagePreview, setProfileImagePreview] = useState<string>("");
  const [userProfile, setUserProfile] = useState<UserProfile>({
    profileImage: "",
    username: JSON.parse(localStorage.getItem("admin") || "{}")?.username || "",
    email: JSON.parse(localStorage.getItem("admin") || "{}")?.email || ""
  });
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch previous image from localStorage (assuming it's a URL)
  useEffect(() => {
    const previousProfileImage = JSON.parse(localStorage.getItem("admin") || "{}")?.profileImage;
    if (previousProfileImage) {
      setProfileImagePreview(previousProfileImage);
    }
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setUserProfile(prev => ({
        ...prev,
        profileImage: file
      }));
    }
  };

  const handleFieldChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async () => {
    const { username, profileImage } = userProfile;
    const token = localStorage.getItem("adtoken");

    if (!username) {
      toast.warning("Please fill the form completely!");
      return;
    }

    const reqBody = new FormData();
    reqBody.append("username", username);
    reqBody.append("profileImage", profileImage instanceof File ? profileImage : "");

    if (token) {
      setLoading(true);
      try {
        const reqHeader = {
          "Content-Type": profileImage instanceof File ? "multipart/form-data" : "application/json",
          "Authorization": `Bearer ${token}`
        };
        const result = await updateAdminProfileAPI(reqBody, reqHeader);
        console.log(result);
        

        if (result._id) {
          toast.success("Profile updated successfully");
        } else {
          toast.info(result.response);
        }
      } catch (err) {
        console.log(err);
        toast.error("An error occurred while updating your profile.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <AdHeader />
      <div className="w-full max-w-md bg-gradient-to-br from-indigo-50 via-purple-100 to-pink-100 rounded-lg shadow-xl p-8 space-y-6 mx-auto mt-10">
        <div className="flex justify-center mb-6 relative">
          <label className="relative cursor-pointer">
            <input 
              type="file"
              className="hidden"
              onChange={handleImageChange}
            />
            <div className="relative">
              {profileImagePreview ? (
                <Avatar
                  src={profileImagePreview}
                  alt="Admin Profile"
                  className="w-32 h-32 border-4 border-white shadow-md"
                  sx={{ width: 128, height: 128 }}
                />
              ) : (
                <Avatar sx={{ width: 128, height: 128, bgcolor: '#e0e0e0' }} />
              )}
              <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tr from-blue-500 to-blue-300 rounded-full border-2 border-white flex justify-center items-center shadow-lg">
                <AddAPhotoIcon className="text-white" />
              </div>
            </div>
          </label>
        </div>

        <TextField
          name="username"
          value={userProfile.username}
          onChange={handleFieldChange}
          type="text"
          className="w-full"
          label="Username"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          sx={{ backgroundColor: "#ffffff" }} 
        />

        <TextField
          name="email"
          value={userProfile.email}
          type="text"
          className="w-full"
          label="Email"
          variant="outlined"
          InputLabelProps={{ shrink: true }}
          InputProps={{ readOnly: true }}
          sx={{ backgroundColor: "#f5f5f5" }} 
        />

        <Button
          onClick={handleUpdate}
          fullWidth
          variant="contained"
          color="primary"
          size="large"
          disabled={loading}
          sx={{ borderRadius: '25px' }}
        >
          {loading ? <CircularProgress size={24} /> : "Update Profile"}
        </Button>
      </div>
    </>
  );
}

export default AdProfile;
