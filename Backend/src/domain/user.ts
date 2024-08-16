export interface User {
    [x: string]: any;
    username: string;
    email: string;
    password: string;
    profileImage: string;
    otp?: string;
    otpVerified?: boolean; 
    is_verified: number; 
    isBlocked?: boolean; // Add this property
    role: string; // Add role field
}
