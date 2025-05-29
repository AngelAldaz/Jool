import axios from 'axios';
import endpoints from "./configAPI";
import { 
  saveTokenToCookies, 
  saveUserToLocalStorage, 
  getTokenFromCookies, 
  getUserFromLocalStorage, 
  isTokenValid, 
  clearAuthData,
  normalizeUserData
} from '@/utils/authUtils';

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
      // Guardar token en cookies
      const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 día
      saveTokenToCookies(response.data.token, expiryDate);
      
      // Guardar datos de usuario en localStorage
      saveUserToLocalStorage(response.data.user);
      
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
  return isTokenValid();
};

/**
 * Gets the current user data from localStorage
 * @returns {Object|null} - User data or null if not logged in
 */
export const getCurrentUser = () => {
  return getUserFromLocalStorage();
};

/**
 * Gets the current authentication token
 * @returns {string|null} - The auth token or null if not logged in
 */
export const getAuthToken = () => {
  return getTokenFromCookies();
};

/**
 * Logs out the current user
 */
export const logout = () => {
  clearAuthData();
};

/**
 * Gets the authorization header for API requests
 * @returns {Object} - Headers object with Authorization
 */
export const authHeader = () => {
  const token = getAuthToken();
  return token 
    ? { 
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      } 
    : { 'Content-Type': 'application/json' };
};

// Servicio de autenticación de Microsoft
export const authService = {
  // Inicia el flujo de autenticación de Microsoft
  loginWithMicrosoft: async () => {
    try {
      const response = await axios.get(`${endpoints.auth.microsoftLogin}`);
      const { redirect_url } = response.data;
      
      // Redireccionar al usuario a la página de login de Microsoft
      window.location.href = redirect_url;
    } catch (error) {
      throw error;
    }
  },

  // Valida si el correo pertenece al Tecnológico de Mérida
  isValidInstitutionalEmail: (email) => {
    if (!email) return false;
    return email.toLowerCase().endsWith('@merida.tecnm.mx');
  },

  // Procesa y guarda los datos de autenticación del fragmento hash
  processAuthHash: () => {
    if (typeof window === 'undefined' || !window.location.hash) return null;
    
    try {
      // Extraer y decodificar datos del hash (quitar el # inicial)
      const encodedData = window.location.hash.substring(1);
      const jsonStr = decodeURIComponent(encodedData);
      const authData = JSON.parse(jsonStr);
      
      // Validar el dominio del correo
      if (!authService.isValidInstitutionalEmail(authData.email)) {
        // Limpiar el hash de la URL para prevenir exposición de datos
        window.history.replaceState(null, '', window.location.pathname);
        const errorMsg = `Acceso denegado: El correo ${authData.email} no pertenece al dominio @merida.tecnm.mx. Solo se permite acceso con correos institucionales del Tecnológico de Mérida.`;
        throw new Error(errorMsg);
      }
      
      // Comprobar que tenemos la estructura esperada
      if (!authData.token || !authData.token.accessToken || !authData.token.expiresAt) {
        return null;
      }
      
      // Guardar token en cookies
      const tokenValue = authData.token.accessToken;
      const expiryDate = new Date(authData.token.expiresAt);
      
      const tokenSaved = saveTokenToCookies(tokenValue, expiryDate);
      
      if (!tokenSaved) {
        return null;
      }
      
      // Preparar datos de usuario
      const userData = {
        id: authData.user_id,
        email: authData.email,
        first_name: authData.first_name,
        last_name: authData.last_name,
        is_active: authData.is_active,
        has_image: authData.has_image,
        phone: authData.phone
      };
      
      // Guardar datos de usuario en localStorage
      const userSaved = saveUserToLocalStorage(userData);
      
      if (!userSaved) {
        return null;
      }
      
      // Limpiar el hash de la URL para prevenir exposición de datos
      window.history.replaceState(null, '', window.location.pathname);
      
      return normalizeUserData(userData);
    } catch (error) {
      throw error; // Re-lanzar el error para que pueda ser manejado por la página de login
    }
  },

  // Verificar si el usuario está autenticado
  isAuthenticated: isTokenValid,

  // Obtener el token actual
  getToken: getTokenFromCookies,

  // Obtener datos de usuario desde localStorage
  getUserData: getUserFromLocalStorage
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