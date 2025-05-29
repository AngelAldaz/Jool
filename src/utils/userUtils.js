/**
 * Extrae de forma segura el ID de usuario de un objeto de usuario
 * Compatible con diferentes formatos (camelCase o snake_case)
 * @param {Object} user - Objeto con datos de usuario
 * @returns {string|number|null} ID de usuario o null si no se encuentra
 */
export const getUserId = (user) => {
  if (!user) return null;
  return user.id || user.user_id || null;
};

/**
 * Extrae el nombre completo del usuario
 * @param {Object} user - Objeto con datos de usuario
 * @returns {string} Nombre completo o placeholder si no se encuentra
 */
export const getFullName = (user) => {
  if (!user) return "Usuario";
  
  const firstName = user.firstName || user.first_name || "";
  const lastName = user.lastName || user.last_name || "";
  
  if (!firstName && !lastName) return "Usuario";
  return `${firstName} ${lastName}`.trim();
};

/**
 * Extrae el nombre de usuario a partir del email
 * @param {Object} user - Objeto con datos de usuario
 * @returns {string} Nombre de usuario o placeholder
 */
export const getUsername = (user) => {
  if (!user || !user.email) return "usuario";
  return user.email.split('@')[0];
};

/**
 * Comprueba si el usuario actual es el propietario de un recurso
 * @param {Object} user - Usuario actual
 * @param {Object} resource - Recurso a comprobar (pregunta, respuesta, etc.)
 * @returns {boolean} True si el usuario es propietario
 */
export const isOwner = (user, resource) => {
  if (!user || !resource) return false;
  
  const userId = getUserId(user);
  const resourceUserId = resource.user_id || resource.userId;
  
  return userId && userId.toString() === resourceUserId?.toString();
}; 