/**
 * Service to handle localStorage operations in a centralized way
 */

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not available
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Get the current user data from localStorage
 * @returns {Object|null} User data or null if not logged in
 */
export const getUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Store user data in localStorage
 * @param {Object} userData - The user data to store
 */
export const setUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  if (userData.token?.accessToken) {
    localStorage.setItem("token", userData.token.accessToken);
  }
};

/**
 * Remove user data from localStorage (logout)
 */
export const clearUser = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

/**
 * Create authentication headers with the token
 * @returns {Object} Headers object with Authorization if token exists
 */
export const createAuthHeaders = () => {
  const token = getToken();
  if (!token) {
    return { "Content-Type": "application/json" };
  }
  
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if the user is authenticated
 */
export const isAuthenticated = () => {
  return !!getToken();
};

export default {
  getToken,
  getUser,
  setUser,
  clearUser,
  createAuthHeaders,
  isAuthenticated
}; 