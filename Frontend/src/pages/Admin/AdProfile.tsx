import React, { useState } from 'react';
import AdHeader from '../../components/Admin/AdHeader';
import { Button, TextField, CircularProgress } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { updateAdminProfileAPI } from "../../Services/allAPI"; // Adjust path as needed
import { SERVER_URL } from "../../Services/serverURL"; // Adjust path as needed
import { toast } from "react-toastify";

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
    reqBody.append("profileImage", profileImage instanceof File ? profileImage : profileImagePreview);

    if (token) {
      setLoading(true);
      try {
        const reqHeader = {
          "Content-Type": profileImage instanceof File ? "multipart/form-data" : "application/json",
          "Authorization": `Bearer ${token}`
        };
        const result = await updateAdminProfileAPI(reqBody, reqHeader);

        if (result._id) {
          toast.success("Profile updated successfully");
          // Handle successful update (e.g., redirect or update local state)
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
      <div className="min-h-screen bg-gray-100 flex flex-col">
        <div className="flex-grow flex justify-center items-center py-12 px-4">
          <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6 space-y-6">
            <div className="flex justify-center mb-6">
              <label className="relative cursor-pointer">
                <input 
                  type="file"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <div
                  style={{ backgroundImage: profileImagePreview ? `url(${profileImagePreview})` : `url(${SERVER_URL}/uploads/${profileImagePreview})` }}
                  className="w-32 h-32 rounded-full bg-gray-200 bg-cover bg-center flex justify-center items-center border-2 border-gray-300"
                >
                  <AddAPhotoIcon className="text-gray-500" fontSize="large" />
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
              sx={{ backgroundColor: "#f5f5f5" }} // Optional: to visually indicate non-editability
            />
            <Button
              onClick={handleUpdate}
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              disabled={loading} // Disable the button while loading
            >
              {loading ? <CircularProgress size={24} /> : "Update"}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdProfile;
