/**
 * Service to handle localStorage operations in a centralized way
 */

import Cookies from 'js-cookie';
import { TOKEN_COOKIE, USER_DATA_KEY } from './constants';

/**
 * Get the authentication token from localStorage
 * @returns {string|null} The auth token or null if not available
 */
export const getToken = () => {
  return Cookies.get(TOKEN_COOKIE);
};

/**
 * Gets the current user data from localStorage
 * @returns {Object|null} - User data or null if not set
 */
export const getUser = () => {
  if (typeof window === 'undefined') return null;
  
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    if (!userData) {
      // Intentar con el formato antiguo como fallback
      const oldUserData = localStorage.getItem("user");
      return oldUserData ? JSON.parse(oldUserData) : null;
    }
    return JSON.parse(userData);
  } catch (error) {
    console.error("Error al recuperar datos de usuario:", error);
    return null;
  }
};

/**
 * Sets the user data in localStorage and token in cookies
 * @param {Object} userData - User data including token
 */
export const setUser = (userData) => {
  if (!userData) return;

  // Si hay token, guardarlo en cookies
  if (userData.token) {
    // Calcular fecha de expiración (24 horas desde ahora)
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    
    Cookies.set(TOKEN_COOKIE, userData.token, {
      expires: expiryDate,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });

    console.log('Token guardado en cookies:', !!userData.token);
  }

  // Guardar datos de usuario en localStorage
  localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  console.log('Datos de usuario guardados en localStorage');
};

/**
 * Clears all user data from storage (logout)
 */
export const clearUser = () => {
  // Eliminar token de cookies
  Cookies.remove(TOKEN_COOKIE);
  
  // Eliminar datos de usuario de localStorage
  localStorage.removeItem(USER_DATA_KEY);
  localStorage.removeItem("user"); // Eliminamos también el formato antiguo por si acaso
  
  console.log('Sesión de usuario eliminada');
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
  if (typeof window === 'undefined') return false;

  const token = Cookies.get(TOKEN_COOKIE);
  if (!token) return false;

  return true;
};

export default {
  getToken,
  getUser,
  setUser,
  clearUser,
  createAuthHeaders,
  isAuthenticated
}; 