import { commonAPI } from "./CommonAPI";
import { SERVER_URL } from "./serverURL";

import axios from 'axios';

const api = axios.create({
  baseURL: `${SERVER_URL}/api/users`, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader: { "Content-Type": string } | undefined) => {
    return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
}

// Login API
export const LoginAPI = async (reqBody: any) => {
    return await commonAPI("POST", `${SERVER_URL}/login`, reqBody);
}

// Google Api
export const GoogleLoginAPI=async(reqBody: any)=>{
  return await commonAPI("POST",`${SERVER_URL}/googleLogin`,reqBody,)
}

// verfy otp Api
export const verifyOtp = async (data: any) => {
    return api.post('/verifyOtp', data);
  };

// update User Profile
export const updateUserProfileAPI=async(reqBody: any,reqHeader: { "Content-Type": string; } | undefined)=>{
  return await commonAPI("PUT",`${SERVER_URL}/profile`,reqBody,reqHeader)
}