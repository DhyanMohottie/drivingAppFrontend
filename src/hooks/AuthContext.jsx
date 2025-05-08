import React, { createContext, useContext, useState, useEffect } from 'react';
import { instructorService } from '../services/instructorService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already logged in (on component mount)
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      // You could validate the token here or decode it to get user info
      // For now, we'll just set a placeholder user object
      setUser({
        isLoggedIn: true,
        isAdmin: true, // Assuming this is an admin dashboard
      });
    }
    setLoading(false);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await instructorService.login(email, password);
      if(response.error) {
        setError(response.error);
        console.error(response.error);
        return null;
      }
      setUser({
        isLoggedIn: true,
        isAdmin: true, // You might want to get this from the response
        ...response.instructor,
      });
      setError(null);
      return response;
    } catch (err) {
      setError('Login failed');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('accessToken');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};