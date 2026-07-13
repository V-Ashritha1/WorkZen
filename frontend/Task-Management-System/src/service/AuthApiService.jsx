import axios from "axios";

// In production, set VITE_API_BASE_URL (e.g. https://your-backend.onrender.com)
// as a build-time env var. Falls back to localhost for local dev.
const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'}/api/auth`;

const authApiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Combine username and password into a single object for loginApi
const loginCredentials = (username, password) => ({ username, password });

export const registerApi = (user) => authApiClient.post('/register', user);

export const loginApi = (username, password) =>
  authApiClient.post('/login', loginCredentials(username, password));

export const saveLoggedUser = (userId, username, role, token) => {
  sessionStorage.setItem('activeUserId', userId);
  sessionStorage.setItem('authenticatedUser', username);
  sessionStorage.setItem('role', role);
  localStorage.setItem('token', token);
};

// The frontend now holds a signed JWT instead of a base64'd username:password
// pair. The token itself carries the user's identity; the backend verifies
// its signature on every request rather than trusting anything the client sends.
export const getToken = () => localStorage.getItem('token');
export const getAuthHeader = () => `Bearer ${getToken()}`;

export const isUserLoggedIn = () => !!sessionStorage.getItem('authenticatedUser') && !!getToken();

export const getLoggedInUserId = () => sessionStorage.getItem('activeUserId');
export const getLoggedInUser = () => sessionStorage.getItem('authenticatedUser');

export const logout = () => {
  localStorage.clear();
  sessionStorage.clear();
};

export const isAdminUser = () => sessionStorage.getItem('role') === 'ROLE_ADMIN'; // Strict comparison for role check
