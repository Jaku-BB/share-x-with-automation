import { apiRequest } from './api';

export interface User {
  userId: string;
  username: string;
  email: string;
}

export interface AuthResponse {
  message: string;
  userId: string;
  username: string;
}

// Sprawdza czy użytkownik jest zalogowany poprzez wywołanie API
export const checkAuthStatus = async (): Promise<User | null> => {
  try {
    const response = await apiRequest('/api/users/profile');
    const userData = await response.json();
    return {
      userId: userData.userId,
      username: userData.username,
      email: userData.email,
    };
  } catch (error) {
    return null;
  }
};

// Wylogowuje użytkownika poprzez API
export const logout = async (): Promise<void> => {
  try {
    await apiRequest('/api/users/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout error:', error);
  }
}; 