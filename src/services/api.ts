import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError, ErrorResponse, AuthError, RateLimitError } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://cfauth.pixelaria.com.br';

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const subscribeTokenRefresh = (callback: (token: string) => void) => {
  refreshSubscribers.push(callback);
};

const onTokenRefreshed = (token: string) => {
  refreshSubscribers.forEach((callback) => callback(token));
  refreshSubscribers = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors and rate limiting
apiClient.interceptors.response.use(
  (response) => {
    // Handle rate limit headers (informational)
    const rateLimit = response.headers['x-ratelimit-limit'];
    const rateLimitRemaining = response.headers['x-ratelimit-remaining'];
    const rateLimitReset = response.headers['x-ratelimit-reset'];

    if (rateLimit && rateLimitRemaining) {
      console.debug('Rate Limit:', {
        limit: rateLimit,
        remaining: rateLimitRemaining,
        resetAt: rateLimitReset ? new Date(parseInt(rateLimitReset) * 1000).toISOString() : null,
      });
    }

    return response;
  },
  async (error: AxiosError<ErrorResponse | AuthError | RateLimitError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle rate limiting (429)
    if (error.response?.status === 429) {
      const rateLimitError = error.response.data as RateLimitError;
      const retryAfter = error.response.headers['retry-after'] || rateLimitError.retry_after_seconds || 60;
      
      console.warn(`Rate limit exceeded. Retry after ${retryAfter} seconds.`);
      
      // You can show a toast/notification here
      // For now, just reject with a friendly message
      return Promise.reject({
        ...error,
        message: `Muitas requisições. Aguarde ${retryAfter} segundos.`,
        retryAfter,
      });
    }

    // Handle 401 (unauthorized) - try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      const authError = error.response.data as AuthError;
      
      // Don't try to refresh if it's a login/register/refresh endpoint
      const isAuthEndpoint = originalRequest.url?.includes('/auth/login') || 
                            originalRequest.url?.includes('/auth/register') ||
                            originalRequest.url?.includes('/auth/refresh');
      
      if (isAuthEndpoint || authError.reason === 'revoked') {
        // Clear auth and redirect to login
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          localStorage.removeItem('auth_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Try to refresh the token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken } = response.data;
          
          // Update stored tokens
          localStorage.setItem('auth_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          
          // Update authorization header
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          isRefreshing = false;
          onTokenRefreshed(access_token);

          // Retry original request
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          isRefreshing = false;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // Another refresh is in progress, wait for it
        return new Promise((resolve) => {
          subscribeTokenRefresh((token: string) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            resolve(apiClient(originalRequest));
          });
        });
      }
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as ErrorResponse | AuthError | RateLimitError | ApiError | undefined;
    
    if (data && 'error' in data) {
      return data.error;
    }
    
    if (data && 'message' in data) {
      return data.message;
    }
    
    return error.message || 'Ocorreu um erro inesperado';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'Ocorreu um erro inesperado';
};

export default apiClient;
