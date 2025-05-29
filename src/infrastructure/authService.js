import axios from 'axios';
import Cookies from 'js-cookie';
import endpoints from "./configAPI";
import { setUser, clearUser, getUser, getToken, isAuthenticated } from "./storageService";
import { TOKEN_COOKIE, EXPIRY_COOKIE, USER_DATA_KEY } from './constants';

/**
 * Attempts to login a user with the provided credentials
 * @param {string} email - User's email
 * @param {string} password - User's password
 * @returns {Promise<Object>} - User data including token if successful
 */
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(endpoints.auth.login, { email, password });
    
    if (response.data && response.data.token) {
      // Save token to cookies
      Cookies.set(TOKEN_COOKIE, response.data.token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });
      
      // Save expiration
      Cookies.set(EXPIRY_COOKIE, new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString());
      
      // Save user data
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(response.data.user));
      
      return response.data;
    }
    
    throw new Error('Invalid response from server');
  } catch (error) {
    console.error('Login error:', error);
    throw error.response?.data?.message 
      ? new Error(error.response.data.message) 
      : new Error('Error al iniciar sesión. Verifique sus credenciales.');
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
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(EXPIRY_COOKIE);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Gets the authorization header for API requests
 * @returns {Object} - Headers object with Authorization
 */
export const authHeader = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Microsoft Authentication Service
export const authService = {
  // Initiates Microsoft authentication flow
  loginWithMicrosoft: async () => {
    try {
      const response = await axios.get(`${endpoints.auth.microsoftLogin}`);
      console.log('Respuesta del endpoint de login de Microsoft:', response.data);
      const { redirect_url } = response.data;
      
      // Redirect user to Microsoft login page
      window.location.href = redirect_url;
    } catch (error) {
      console.error('Error iniciando autenticación con Microsoft:', error);
      throw error;
    }
  },

  // Process and save authentication data from hash fragment
  processAuthHash: () => {
    if (typeof window === 'undefined' || !window.location.hash) return null;
    
    try {
      // Extract and decode data from hash (remove initial #)
      const encodedData = window.location.hash.substring(1);
      const jsonStr = decodeURIComponent(encodedData);
      const authData = JSON.parse(jsonStr);
      
      // Log the token obtained from Microsoft authentication
      console.log('Token obtenido de Microsoft:', authData.token);
      
      // Comprobar que tenemos la estructura esperada
      if (!authData.token || !authData.token.accessToken || !authData.token.expiresAt) {
        console.error('Estructura de token inválida:', authData);
        return null;
      }
      
      const tokenValue = authData.token.accessToken;
      const expiryDate = new Date(authData.token.expiresAt);
      
      console.log('Guardando token:', {
        value: tokenValue ? tokenValue.substring(0, 10) + '...' : null,
        expiry: expiryDate
      });
      
      // Save token in cookies
      Cookies.set(TOKEN_COOKIE, tokenValue, {
        expires: expiryDate,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax'
      });
      
      // Save expiration date
      Cookies.set(EXPIRY_COOKIE, authData.token.expiresAt);
      
      // Verificar que el token se ha guardado correctamente
      const savedToken = Cookies.get(TOKEN_COOKIE);
      const savedExpiry = Cookies.get(EXPIRY_COOKIE);
      
      console.log('Token guardado correctamente:', !!savedToken, 'Expiry guardado:', !!savedExpiry);
      
      // Save user data in localStorage with consistent structure
      // Ensure we save both id and user_id for compatibility
      const userData = {
        id: authData.user_id,
        user_id: authData.user_id, // Duplicate for compatibility
        email: authData.email,
        first_name: authData.first_name,
        firstName: authData.first_name, // Add both formats for compatibility
        last_name: authData.last_name,
        lastName: authData.last_name, // Add both formats for compatibility
        isActive: authData.is_active,
        is_active: authData.is_active, // Add both formats for compatibility
        hasImage: authData.has_image,
        has_image: authData.has_image, // Add both formats for compatibility
        phone: authData.phone
      };
      
      localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
      console.log('Datos de usuario guardados en localStorage:', userData);
      
      // Clear hash from URL to prevent data exposure
      window.history.replaceState(null, '', window.location.pathname);
      
      return userData;
    } catch (error) {
      console.error('Error procesando datos de autenticación:', error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    if (typeof window === 'undefined') return false;
    
    try {
      const token = Cookies.get(TOKEN_COOKIE);
      const expiry = Cookies.get(EXPIRY_COOKIE);
      
      console.log('Verificando autenticación - Token:', !!token, 'Expiry:', !!expiry);
      
      if (!token || !expiry) {
        console.log('No se encontró token o fecha de expiración');
        return false;
      }
      
      // Check if token has expired
      const expiryDate = new Date(expiry);
      const isValid = expiryDate > new Date();
      
      console.log('Token expira en:', expiryDate, 'Es válido:', isValid);
      
      // Verificar también que tengamos datos de usuario
      const userData = localStorage.getItem(USER_DATA_KEY);
      if (!userData) {
        console.log('No se encontraron datos de usuario en localStorage');
        return false;
      }
      
      return isValid;
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      return false;
    }
  },

  // Get current token
  getToken: () => {
    return Cookies.get(TOKEN_COOKIE);
  },

  // Get user data from localStorage
  getUserData: () => {
    if (typeof window === 'undefined') return null;
    
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  }
};

export default {
  loginUser,
  registerUser,
  isLoggedIn,
  getCurrentUser,
  getAuthToken,
  logout,
  authHeader,
  authService
}; 