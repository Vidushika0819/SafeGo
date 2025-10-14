// Authentication utility functions
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return false;
  }
  
  try {
    // Basic check if token exists and user data is valid JSON
    JSON.parse(user);
    return true;
  } catch (error) {
    // If user data is corrupted, clear storage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return false;
  }
};

export const getCurrentUser = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};