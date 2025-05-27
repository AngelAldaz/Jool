import endpoints from "./configAPI";
import { setUser, clearUser, getUser, getToken, isAuthenticated } from "./storageService";

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
    
    // Store user data and token using storageService
    console.log(userData);
    setUser(userData);
    
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
    console.log("Sending registration data to API:", userData);
    
    const response = await fetch(endpoints.auth.register, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.log("Error response from API:", errorText);
      
      try {
        // Intentar parsear como JSON
        const errorData = JSON.parse(errorText);
        
        // Si es un objeto JSON válido, devolverlo como string para que la UI lo pueda procesar
        throw new Error(JSON.stringify(errorData));
      } catch (parseError) {
        // Si no es JSON válido, devolver el texto original
        if (parseError instanceof SyntaxError) {
          throw new Error(errorText || `Registration error: ${response.statusText}`);
        } else {
          // Si el error ocurrió después de parsear correctamente, propagar ese error
          throw parseError;
        }
      }
    }

    // Manejar respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía del servidor al registrar usuario');
      return null;
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON al registrar usuario:', parseError);
      return null;
    }
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
  return isAuthenticated();
};

/**
 * Gets the current user data from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  return getUser();
};

/**
 * Gets the current authentication token
 * @returns {string|null} - The auth token or null if not logged in
 */
export const getAuthToken = () => {
  return getToken();
};

/**
 * Logs out the current user
 */
export const logout = () => {
  clearUser();
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
  getAuthToken,
  logout,
  authHeader
}; 