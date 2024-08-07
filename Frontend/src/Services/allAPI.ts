import { commonAPI } from "./CommonAPI";
import { SERVER_URL } from "./serverURL";

// SignUp API
export const SignUpAPI = async (reqBody: any, reqHeader: { "Content-Type": string } | undefined) => {
    return await commonAPI("POST", `${SERVER_URL}/signup`, reqBody, reqHeader);
}

// Login API
export const LoginAPI = async (reqBody: any) => {
    return await commonAPI("POST", `${SERVER_URL}/login`, reqBody);
}

// Verify OTP API
export const VerifyOTPAPI = async (otp: string) => {
    return await commonAPI("POST", `${SERVER_URL}/verifyOtp`, { otp });
}
