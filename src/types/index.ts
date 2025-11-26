// Types for User and Authentication
export interface User {
  id: string;
  email: string;
  full_name: string;
  display_name?: string | null;
  phone: string;
  birth_date?: string | null;
  role: 'user' | 'admin';
  email_confirmed: boolean;
  created_at: string;
  session_version: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  birth_date?: string | null;
}

export interface LoginRequest {
  email: string;
  password: string;
  remember_me?: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number; // segundos
  remember_me: boolean;
  user: {
    id: string;
    email: string;
    role: 'user' | 'admin';
  };
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string; // novo refresh token (rotation)
  token_type: string;
  expires_in: number;
  user: User; // dados completos do usuário
}

export interface VerifyEmailRequest {
  token: string; // UUID
}

export interface ResendVerificationRequest {
  email: string;
}

export interface RequestPasswordResetRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string; // UUID
  new_password: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

export interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: 'user' | 'admin';
  sessionVersion: number;
  iss: string;
  aud: string;
  exp: number;
  jti: string;
}

export interface UpdateProfileRequest {
  full_name: string;
  display_name?: string | null;
  phone: string;
  birth_date?: string | null;
}

// Backward compatibility aliases
export type SignupRequest = RegisterRequest;
export type AuthResponse = LoginResponse;

// Types for Codes
export type CodeStatus = 'pending' | 'confirmed' | 'error' | 'not_found';

export interface Code {
  id: string;
  code: string;
  name?: string; // Nome/descrição opcional para identificar o código
  status: CodeStatus;
  lastUpdated: string;
  createdAt: string;
  userId: string;
}

export interface AddCodeRequest {
  codes: Array<{ code: string; name?: string }>; // Array de códigos com nomes opcionais
}

export interface AddCodeResponse {
  success: boolean;
  added: Code[];
  invalid: string[];
  message: string;
}

export interface CodesListResponse {
  codes: Code[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface CodesListParams {
  page?: number;
  limit?: number;
  status?: CodeStatus | 'all';
}

export interface DeleteCodeResponse {
  success: boolean;
  message: string;
}

export interface UpdateNowResponse {
  success: boolean;
  updated: Code[];
  message: string;
}

// Error Types (baseado na API)
export interface ErrorResponse {
  error: string;
  field?: string;
}

export interface AuthError {
  error: string;
  code: string;
  reason?: 'expired' | 'invalid_signature' | 'revoked' | 'invalid_issuer' | 'invalid_audience' | 'malformed';
}

export interface RateLimitError {
  error: string;
  code: string;
  retry_after_seconds: number;
}

// Generic API error (backward compatibility)
export interface ApiError {
  message: string;
  code?: string;
  errors?: Record<string, string[]>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
