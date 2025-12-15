import axios from "axios";

// ✅ FIX 1: ADDED PORT 8080
const API_URL = 'http://10.175.168.114:8080/auth';

// --- INTERFACES ---
export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface VerifyData {
    email: string;
    otp: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
    error?: string;
}

// --- FUNCTIONS ---

const register = async (userData: RegisterData): Promise<string> => {
    try {
        // We expect an AuthResponse object now (JSON)
        const response = await axios.post<AuthResponse>(`${API_URL}/signup`, userData);

        // ✅ FIX 2: Return the "message" field from the JSON
        return response.data.message || "Registration successful";
    } catch (error: any) {
        if (error.response && error.response.data) {
            // ✅ FIX 3: Check if the backend sent a JSON error message
            const serverError = error.response.data.error || error.response.data;
            // Convert object to string if needed
            throw new Error(typeof serverError === 'string' ? serverError : JSON.stringify(serverError));
        }
        throw new Error("Could not connect to backend. Check your IP and Port.");
    }
};

const login = async (userData: LoginData): Promise<AuthResponse> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, userData);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            const serverError = error.response.data.error || error.response.data;
            throw new Error(typeof serverError === 'string' ? serverError : "Login Failed");
        }
        throw new Error("Login Failed. Please check your credentials.");
    }
};

const verifyOtp = async (userData: VerifyData): Promise<string> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/verify`, userData);
        // ✅ FIX: Extract message
        return response.data.message || "Verification successful";
    } catch (error: any) {
        if (error.response && error.response.data) {
            const serverError = error.response.data.error || error.response.data;
            throw new Error(typeof serverError === 'string' ? serverError : "Verification Failed");
        }
        throw new Error("OTP Verification failed. Please try again.");
    }
};

const resendOtp = async (email: string): Promise<string> => {
    try {
        const response = await axios.post<AuthResponse>(`${API_URL}/resend-otp`, { email });
        // ✅ FIX: Extract message
        return response.data.message || "OTP Sent";
    } catch (error: any) {
        if (error.response && error.response.data) {
            const serverError = error.response.data.error || error.response.data;
            throw new Error(typeof serverError === 'string' ? serverError : "Failed to resend OTP");
        }
        throw new Error("Failed to resend OTP.");
    }
};

export default {
    register,
    login,
    verifyOtp,
    resendOtp
};