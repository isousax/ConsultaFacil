import apiClient from './api';
import type {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  VerifyEmailRequest,
  ResendVerificationRequest,
  RequestPasswordResetRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  User,
  UpdateProfileRequest,
} from '../types';

export const authService = {
  // Register new user
  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/register', data);
    return response.data;
  },

  // Login
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/auth/login', data);
    return response.data;
  },

  // Logout
  logout: async (refreshToken: string): Promise<void> => {
    await apiClient.post('/auth/logout', { refresh_token: refreshToken });
  },

  // Refresh access token
  refresh: async (data: RefreshTokenRequest): Promise<RefreshTokenResponse> => {
    const response = await apiClient.post<RefreshTokenResponse>('/auth/refresh', data);
    return response.data;
  },

  // Resend email verification
  resendVerification: async (data: ResendVerificationRequest): Promise<{ ok: boolean; message: string; retry_after?: number }> => {
    const response = await apiClient.post<{ ok: boolean; message: string; retry_after?: number }>('/auth/resend-verification', data);
    return response.data;
  },

  // Helper to resend verification email (simplified)
  resendVerificationEmail: async (email: string): Promise<{ ok: boolean; message: string; retry_after?: number }> => {
    return authService.resendVerification({ email });
  },

  // Confirm email with token
  confirmVerification: async (data: VerifyEmailRequest): Promise<{ ok: boolean; message: string }> => {
    const response = await apiClient.post<{ ok: boolean; message: string }>('/auth/confirm-verification', data);
    return response.data;
  },

  // Request password reset
  requestPasswordReset: async (data: RequestPasswordResetRequest): Promise<{ ok: boolean; message: string }> => {
    const response = await apiClient.post<{ ok: boolean; message: string }>('/auth/request-reset', data);
    return response.data;
  },

  // Reset password with token
  resetPassword: async (data: ResetPasswordRequest): Promise<{ ok: boolean; message: string }> => {
    const response = await apiClient.post<{ ok: boolean; message: string }>('/auth/reset-password', data);
    return response.data;
  },

  // Change password (authenticated)
  changePassword: async (data: ChangePasswordRequest): Promise<{ ok: boolean; message: string }> => {
    const response = await apiClient.post<{ ok: boolean; message: string }>('/auth/change-password', data);
    return response.data;
  },

  // Get current user profile
  getProfile: async (): Promise<User> => {
    const response = await apiClient.get<User>('/auth/me');
    return response.data;
  },

  // Update user profile
  updateProfile: async (data: UpdateProfileRequest): Promise<{ ok: boolean; message: string; user: User }> => {
    const response = await apiClient.put<{ ok: boolean; message: string; user: User }>('/auth/profile', data);
    return response.data;
  },

  // Introspect token (validate)
  introspectToken: async (token?: string): Promise<{ valid: boolean; payload?: any; reason?: string }> => {
    const response = await apiClient.post<{ valid: boolean; payload?: any; reason?: string }>(
      '/auth/introspect',
      token ? { token } : undefined
    );
    return response.data;
  },
};
