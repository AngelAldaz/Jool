import endpoints from "./configAPI";

/**
 * Attempts to login a user with the provided credentials
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data including token if successful
 */
export const loginUser = async (email, password) => {
  try {
    const response = await fetch(endpoints.auth.login, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      // First try to get the error text
      const errorText = await response.text();

      try {
        // Try to parse it as JSON
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail || errorData.message || `Authentication error: ${response.status}`
        );
      } catch (parseError) {
        // If it's not JSON, use the text directly
        throw new Error(
          errorText || `Authentication error: ${response.statusText}`
        );
      }
    }

    // Parse the user data including token
    const userData = await response.json();
    
    // Store user data and token in localStorage
    console.log(userData);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userData.token.accessToken);
    
    return userData;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

/**
 * Registers a new user with the provided information
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} - Created user data
 */
export const registerUser = async (userData) => {
  try {
    const response = await fetch(endpoints.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(
          errorData.detail || errorData.message || `Registration error: ${response.status}`
        );
      } catch (parseError) {
        throw new Error(
          errorText || `Registration error: ${response.statusText}`
        );
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

/**
 * Checks if a user is currently logged in
 * @returns {boolean} - True if user is logged in
 */
export const isLoggedIn = () => {
  return !!localStorage.getItem("token");
};

/**
 * Gets the current user data from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Gets the current authentication token
 * @returns {string|null} - The auth token or null if not logged in
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Logs out the current user
 */
export const logout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
};

/**
 * Gets the authorization header for API requests
 * @returns {Object} - Headers object with Authorization
 */
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export default {
  loginUser,
  registerUser,
  isLoggedIn,
  getCurrentUser,
  getToken,
  logout,
  authHeader
}; 