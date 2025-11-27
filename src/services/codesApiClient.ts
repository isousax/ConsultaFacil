import axios from 'axios';
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';

const CODES_API_BASE_URL = 'https://consultafacil-codes.pixelaria.com.br';
const AUTH_API_BASE_URL = 'https://auth.pixelaria.com.br';

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

// Create axios instance for codes API
const codesApiClient: AxiosInstance = axios.create({
  baseURL: CODES_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Response interceptor to handle errors
codesApiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Handle 401 (unauthorized) - try to refresh token first
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (!isRefreshing) {
        isRefreshing = true;
        originalRequest._retry = true;

        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
          // No refresh token, redirect to login
          isRefreshing = false;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_at');
          localStorage.removeItem('user');
          window.location.href = '/login';
          return Promise.reject(error);
        }

        try {
          // Try to refresh the token using the auth API
          const response = await axios.post(`${AUTH_API_BASE_URL}/api/refresh`, {
            refresh_token: refreshToken,
          });

          const { access_token, refresh_token: newRefreshToken, expires_in, user } = response.data;

          // Update tokens in localStorage
          const expiresAt = Date.now() + expires_in * 1000;
          localStorage.setItem('auth_token', access_token);
          localStorage.setItem('refresh_token', newRefreshToken);
          localStorage.setItem('token_expires_at', expiresAt.toString());
          localStorage.setItem('user', JSON.stringify(user));

          // Update the Authorization header with new token
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access_token}`;
          }

          isRefreshing = false;
          onTokenRefreshed(access_token);

          // Retry the original request with new token
          return codesApiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear auth and redirect to login
          isRefreshing = false;
          localStorage.removeItem('auth_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('token_expires_at');
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
            resolve(codesApiClient(originalRequest));
          });
        });
      }
    }

    // Handle other errors
    return Promise.reject(error);
  }
);

export default codesApiClient;
