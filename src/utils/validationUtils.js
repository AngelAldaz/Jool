/**
 * Valida que un string no esté vacío después de eliminar espacios
 * @param {string} str - String a validar
 * @returns {boolean} True si el string es válido
 */
export const isValidString = (str) => {
  return typeof str === 'string' && str.trim() !== '';
};

/**
 * Valida una dirección de correo electrónico
 * @param {string} email - Email a validar
 * @returns {boolean} True si el email es válido
 */
export const isValidEmail = (email) => {
  if (!isValidString(email)) return false;
  
  // Expresión regular para validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Valida una contraseña
 * @param {string} password - Contraseña a validar
 * @returns {Object} Objeto con resultado de validación y mensajes
 */
export const validatePassword = (password) => {
  if (!isValidString(password)) {
    return { isValid: false, message: 'La contraseña no puede estar vacía' };
  }
  
  if (password.length < 8) {
    return { 
      isValid: false, 
      message: 'La contraseña debe tener al menos 8 caracteres' 
    };
  }
  
  // Verificar si tiene al menos un número
  if (!/\d/.test(password)) {
    return { 
      isValid: false, 
      message: 'La contraseña debe contener al menos un número' 
    };
  }
  
  // Verificar si tiene al menos una letra mayúscula
  if (!/[A-Z]/.test(password)) {
    return { 
      isValid: false, 
      message: 'La contraseña debe contener al menos una letra mayúscula' 
    };
  }
  
  return { isValid: true, message: 'Contraseña válida' };
};

/**
 * Valida un objeto de datos contra un esquema
 * @param {Object} data - Datos a validar
 * @param {Object} schema - Esquema de validación {campo: función de validación}
 * @returns {Object} Objeto con errores por campo, vacío si todo es válido
 */
export const validateObject = (data, schema) => {
  const errors = {};
  
  Object.entries(schema).forEach(([field, validator]) => {
    const value = data[field];
    const result = validator(value);
    
    if (!result.isValid) {
      errors[field] = result.message;
    }
  });
  
  return errors;
}; 