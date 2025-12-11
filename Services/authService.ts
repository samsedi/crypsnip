import axios from "axios";

// ✅ FIX 1: Clean URL (No extra text inside the quotes)
const API_URL = 'http://10.86.44.114:8080/auth';

export interface RegisterData {
    fullName: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
}

const register = async (userData: RegisterData): Promise<string> => {
    try {
        const response = await axios.post<string>(`${API_URL}/signup`, userData);
        return response.data;
    } catch (error: any) {
        // ✅ FIX 2: Fixed typo 'reponse' -> 'response'
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error("Could not connect to backend. Check your IP");
    }
}; // ✅ FIX 3: Closed the register function here

const login = async (userData: LoginData): Promise<AuthResponse> => {
    try {
        // We use <AuthResponse> because the backend returns JSON { "token": "..." }
        const response = await axios.post<AuthResponse>(`${API_URL}/login`, userData);
        return response.data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            throw new Error(error.response.data);
        }
        throw new Error("Login Failed. Please check your credentials.");
    }
};

const sendOtp=async ():Promise<string>=>{
    try{
        const response= await
    }

}

export default {
    register,
    login
};