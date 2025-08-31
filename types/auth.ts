export interface User {
  _id: string;
  role: 'Doctor' | 'Patient' | 'Admin'; // Proper case for storage
  fullName: string;
  email: string;
  password: string;
  createdAt: Date;
  specialty?: string;
  licenseNumber?: string;
}

export interface UserProfile {
  id: string;
  role: string; // Flexible string to handle both cases
  email: string;
  name: string;
}

export interface LoginRequest {
  role: string; // Flexible string to handle both cases
  email: string;
  password: string;
}

export interface SignupRequest {
  role: string; // Flexible string to handle both cases
  fullName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  specialty?: string;
  licenseNumber?: string;
}

export interface AuthResponse {
  message: string;
  user?: UserProfile;
} 