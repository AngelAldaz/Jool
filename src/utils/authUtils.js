import Cookies from 'js-cookie';
import { TOKEN_COOKIE, EXPIRY_COOKIE, USER_DATA_KEY } from '@/services/constants';

/**
 * Normaliza los datos de usuario para mantener compatibilidad entre formatos
 * @param {Object} userData - Datos del usuario a normalizar
 * @returns {Object} Datos normalizados
 */
export const normalizeUserData = (userData) => {
  if (!userData) return null;
  
  return {
    // Guardar ID con ambos formatos
    id: userData.id || userData.user_id,
    user_id: userData.user_id || userData.id,
    
    // Datos de usuario
    email: userData.email,
    
    // Guardar nombre con ambos formatos
    first_name: userData.first_name || userData.firstName,
    firstName: userData.firstName || userData.first_name,
    last_name: userData.last_name || userData.lastName,
    lastName: userData.lastName || userData.last_name,
    
    // Otros datos
    isActive: userData.isActive || userData.is_active,
    is_active: userData.is_active || userData.isActive,
    hasImage: userData.hasImage || userData.has_image,
    has_image: userData.has_image || userData.hasImage,
    phone: userData.phone
  };
};

/**
 * Guarda un token JWT en cookies
 * @param {string} token - Token a guardar
 * @param {Date|string} expiryDate - Fecha de expiración
 * @returns {boolean} True si se guardó correctamente
 */
export const saveTokenToCookies = (token, expiryDate) => {
  if (!token) return false;
  
  try {
    // Convertir a Date si es un string
    const expiry = typeof expiryDate === 'string' 
      ? new Date(expiryDate) 
      : expiryDate;
    
    // Guardar token
    Cookies.set(TOKEN_COOKIE, token, {
      expires: expiry,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Lax'
    });
    
    // Guardar fecha de expiración como string ISO
    Cookies.set(EXPIRY_COOKIE, expiry.toISOString());
    
    return true;
  } catch (error) {
    console.error('Error al guardar token en cookies:', error);
    return false;
  }
};

/**
 * Guarda los datos del usuario en localStorage
 * @param {Object} userData - Datos del usuario a guardar
 * @returns {boolean} True si se guardó correctamente
 */
export const saveUserToLocalStorage = (userData) => {
  if (!userData) return false;
  
  try {
    // Normalizar datos antes de guardar
    const normalizedData = normalizeUserData(userData);
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(normalizedData));
    return true;
  } catch (error) {
    console.error('Error al guardar usuario en localStorage:', error);
    return false;
  }
};

/**
 * Obtiene el token JWT de las cookies
 * @returns {string|null} Token o null si no existe
 */
export const getTokenFromCookies = () => {
  return Cookies.get(TOKEN_COOKIE);
};

/**
 * Obtiene la fecha de expiración del token
 * @returns {Date|null} Fecha de expiración o null
 */
export const getTokenExpiryDate = () => {
  const expiry = Cookies.get(EXPIRY_COOKIE);
  return expiry ? new Date(expiry) : null;
};

/**
 * Obtiene los datos del usuario de localStorage
 * @returns {Object|null} Datos del usuario o null
 */
export const getUserFromLocalStorage = () => {
  try {
    const userData = localStorage.getItem(USER_DATA_KEY);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('Error al recuperar usuario de localStorage:', error);
    return null;
  }
};

/**
 * Elimina toda la información de autenticación
 */
export const clearAuthData = () => {
  Cookies.remove(TOKEN_COOKIE);
  Cookies.remove(EXPIRY_COOKIE);
  localStorage.removeItem(USER_DATA_KEY);
};

/**
 * Verifica si el token es válido y no ha expirado
 * @returns {boolean} True si el token es válido
 */
export const isTokenValid = () => {
  try {
    const token = getTokenFromCookies();
    const expiry = getTokenExpiryDate();
    
    if (!token || !expiry) {
      return false;
    }
    
    return expiry > new Date();
  } catch (error) {
    console.error('Error al verificar validez del token:', error);
    return false;
  }
}; 