import { commonAPI } from "./CommonAPI";
import { SERVER_URL } from "./serverURL";

import axios from 'axios';

const api = axios.create({
  baseURL: `${SERVER_URL}/api/users`, 
  headers: {
    'Content-Type': 'application/json',
  },
});
// Define a type for request headers that can include additional properties
type RequestHeaders = Record<string, string>;

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
};

// Login API
export const LoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/login`, reqBody);
};

// Google Api
export const GoogleLoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/googleLogin`, reqBody);
};

// Verify OTP API
export const verifyOtp = async (data: any) => {
  return api.post('/verifyOtp', data);
};

// Update User Profile
export const updateUserProfileAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  return await commonAPI("PUT", `${SERVER_URL}/profile`, reqBody, reqHeader);
};

// Forgot Password API
export const ForgotPasswordAPI = async (email: string) => {
  return await commonAPI("POST", `${SERVER_URL}/forgotPassword`, { email });
};

// Reset Password API
export const VerifyResetPasswordAPI = async (email: any, otp: any, newPassword: any) => {
  const reqBody = { email, otp, newPassword };
  return await commonAPI("POST", `${SERVER_URL}/resetPassword`, reqBody);
};

// Admin Login API
export const AdminLoginAPI = async (reqBody: any) => {
  return await commonAPI("POST", `${SERVER_URL}/adminLogin`, reqBody);
};

// Update Admin Profile
export const updateAdminProfileAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  return await commonAPI("PUT", `${SERVER_URL}/profile`, reqBody, reqHeader);
};

// Get All Users API
export const getAllUsersAPI = async (token: string) => {
  try {
    const response = await commonAPI('GET', `${SERVER_URL}/getAllUsers`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    console.log(response);
    
    return response 
  } catch (error) {
    throw new Error('Failed to fetch users');
  }
};

// Block User API
export const blockUserAPI = async (userId: string, token: string) => {
  return await axios.put(`${SERVER_URL}/blockUser/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const unblockUserAPI = async (userId: string, token: string) => {
  return await axios.put(`${SERVER_URL}/unblockUser/${userId}`, {}, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};


// Worker Registration API
export const registerWorkerAPI = async (reqBody: any, reqHeader?: RequestHeaders) => {
  return await commonAPI("POST", `${SERVER_URL}/register`, reqBody, reqHeader);
}

// Get All Workers API
export const getAdminAllworkersAPI = async (token: string) => {
  try {
    const response = await commonAPI('GET', `${SERVER_URL}/getAllWorkers`, undefined, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {
    throw new Error('Failed to fetch workers');
  }
};

// Update Worker Status API
export const updateStatusAPI = async (workerId: string, status: string, token: string) => {
  try {
    const response = await commonAPI('PUT', `${SERVER_URL}/updateWorkerStatus/${workerId}`, { status }, {
      Authorization: `Bearer ${token}`,
    });
    return response;
  } catch (error) {
    throw new Error('Failed to update worker status');
  }
};


// Block Worker API
export const blockWorkerAPI = async (workerId: string, token: string) => {
  return await commonAPI('PUT', `${SERVER_URL}/blockWorker/${workerId}`, {}, {
    Authorization: `Bearer ${token}`,
  });
};

// Unblock Worker API
export const unblockWorkerAPI = async (workerId: string, token: string) => {
  return await commonAPI('PUT', `${SERVER_URL}/unblockWorker/${workerId}`, {}, {
    Authorization: `Bearer ${token}`,
  });
};