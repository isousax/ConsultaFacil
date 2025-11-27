import { create } from 'zustand';
import { authService } from '../services/authService';
import { handleApiError } from '../services/api';
import type { 
  User, 
  RegisterRequest, 
  LoginRequest,
  ChangePasswordRequest,
  UpdateProfileRequest,
} from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpiresAt: number | null; // timestamp in milliseconds
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  autoRefreshTimer: number | null;

  // Actions
  register: (data: RegisterRequest) => Promise<void>;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshTokens: () => Promise<void>;
  loadStoredAuth: () => Promise<void>;
  changePassword: (data: ChangePasswordRequest) => Promise<void>;
  updateProfile: (data: UpdateProfileRequest) => Promise<void>;
  refreshProfile: () => Promise<void>;
  clearError: () => void;
  scheduleTokenRefresh: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  refreshToken: null,
  tokenExpiresAt: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to prevent premature redirects
  error: null,
  autoRefreshTimer: null,

  register: async (data: RegisterRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.register(data);

      // Calculate expiration timestamp
      const expiresAt = Date.now() + response.expires_in * 1000;

      // Store in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('token_expires_at', expiresAt.toString());
      localStorage.setItem('pending_verification_email', data.email);

      // Fetch full user profile
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: response.access_token,
        refreshToken: response.refresh_token,
        tokenExpiresAt: expiresAt,
        isAuthenticated: true,
        isLoading: false,
      });

      // Schedule token refresh
      get().scheduleTokenRefresh();
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  login: async (data: LoginRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.login(data);

      // Calculate expiration timestamp
      const expiresAt = Date.now() + response.expires_in * 1000;

      // Store in localStorage
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('token_expires_at', expiresAt.toString());
      
      // Store remember preference - if true, keep session after browser close
      if (data.remember) {
        localStorage.setItem('remember_me', 'true');
      } else {
        localStorage.removeItem('remember_me');
      }

      // Fetch full user profile
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));

      set({
        user,
        token: response.access_token,
        refreshToken: response.refresh_token,
        tokenExpiresAt: expiresAt,
        isAuthenticated: true,
        isLoading: false,
      });

      // Schedule token refresh
      get().scheduleTokenRefresh();
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true });
    try {
      // Clear auto-refresh timer
      const { autoRefreshTimer } = get();
      if (autoRefreshTimer) {
        clearTimeout(autoRefreshTimer);
      }

      await authService.logout();

      // Clear localStorage
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('user');
      localStorage.removeItem('remember_me');

      set({
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
        autoRefreshTimer: null,
      });
    } catch {
      // Even if logout fails, clear local state
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_expires_at');
      localStorage.removeItem('user');
      localStorage.removeItem('remember_me');
      set({Storage.removeItem('user');
      set({
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: false,
        autoRefreshTimer: null,
      });
    }
  },

  refreshTokens: async () => {
    const { refreshToken } = get();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refresh({ refresh_token: refreshToken });

      // Calculate new expiration timestamp
      const expiresAt = Date.now() + response.expires_in * 1000;

      // Update tokens in localStorage (with rotation)
      localStorage.setItem('auth_token', response.access_token);
      localStorage.setItem('refresh_token', response.refresh_token);
      localStorage.setItem('token_expires_at', expiresAt.toString());
      localStorage.setItem('user', JSON.stringify(response.user));

      set({
        user: response.user,
        token: response.access_token,
        refreshToken: response.refresh_token,
        tokenExpiresAt: expiresAt,
      });

      // Schedule next refresh
      get().scheduleTokenRefresh();
    } catch (error) {
      // Refresh failed, logout user
      console.error('Token refresh failed:', error);
      get().logout();
      throw error;
    }
  },

  scheduleTokenRefresh: () => {
    const { tokenExpiresAt, autoRefreshTimer } = get();
    
    // Clear existing timer
    if (autoRefreshTimer) {
      clearTimeout(autoRefreshTimer);
    }

    if (!tokenExpiresAt) {
      return;
    }

    // Refresh 2 minutes before expiration
    const refreshTime = tokenExpiresAt - Date.now() - 2 * 60 * 1000;
    
    if (refreshTime > 0) {
      const timer = setTimeout(() => {
        get().refreshTokens().catch(console.error);
      }, refreshTime);

      set({ autoRefreshTimer: timer });
    } else {
      // Token already expired or about to expire, refresh immediately
      get().refreshTokens().catch(console.error);
    }
  },

  loadStoredAuth: async () => {
    const token = localStorage.getItem('auth_token');
    const refreshToken = localStorage.getItem('refresh_token');
    const userStr = localStorage.getItem('user');
    const expiresAtStr = localStorage.getItem('token_expires_at');
    const rememberMe = localStorage.getItem('remember_me') === 'true';

    if (!token || !refreshToken || !userStr) {
      set({ 
        user: null,
        token: null,
        refreshToken: null,
        tokenExpiresAt: null,
        isAuthenticated: false, 
        isLoading: false 
      });
      return;
    }

    const tokenExpiresAt = expiresAtStr ? parseInt(expiresAtStr, 10) : null;
    const user = JSON.parse(userStr) as User;

    // Check if token is expired or about to expire
    const now = Date.now();
    const isExpired = tokenExpiresAt && tokenExpiresAt < now;
    const isAboutToExpire = tokenExpiresAt && tokenExpiresAt - now < 5 * 60 * 1000; // 5 minutes

    if (isExpired || isAboutToExpire) {
      // Only try to refresh if user chose "remember me"
      if (rememberMe) {
        try {
          set({ 
            isLoading: true,
            user,
            token,
            refreshToken,
            tokenExpiresAt,
          });
          await get().refreshTokens();
          set({ isAuthenticated: true, isLoading: false });
        } catch {
          // Refresh failed, clear auth
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_at');
          localStorage.removeItem('user');
          localStorage.removeItem('remember_me');
          set({
            user: null,
            token: null,
            refreshToken: null,
            tokenExpiresAt: null,
            isAuthenticated: false,
            isLoading: false,
          });
        }
      } else {
        // Token expired and user didn't want to be remembered, clear auth
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('token_expires_at');
        localStorage.removeItem('user');
        set({
          user: null,
          token: null,
          refreshToken: null,
          tokenExpiresAt: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    } else {
      // Token is still valid
      set({ 
        user,
        token,
        refreshToken,
        tokenExpiresAt,
        isAuthenticated: true, 
        isLoading: false 
      });
      get().scheduleTokenRefresh();
    }
  },

  changePassword: async (data: ChangePasswordRequest) => {
    set({ isLoading: true, error: null });
    try {
      await authService.changePassword(data);
      set({ isLoading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authService.updateProfile(data);
      localStorage.setItem('user', JSON.stringify(response.user));
      set({ user: response.user, isLoading: false });
    } catch (error) {
      const errorMessage = handleApiError(error);
      set({ isLoading: false, error: errorMessage });
      throw error;
    }
  },

  refreshProfile: async () => {
    try {
      const user = await authService.getProfile();
      localStorage.setItem('user', JSON.stringify(user));
      set({ user });
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  },

  clearError: () => set({ error: null }),
}));
