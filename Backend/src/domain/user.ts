export interface User {
    username: string;
    email: string;
    password: string;
    profileImage: string;
    otp?: string;
    otpVerified?: boolean; // To mark if the user's email is verified
}
