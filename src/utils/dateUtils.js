/**
 * Formatea una fecha ISO a un formato legible en español
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Fecha formateada
 */
export const formatDate = (dateString) => {
  if (!dateString) return "No disponible";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  } catch (error) {
    console.error("Error al formatear fecha:", error);
    return "Fecha inválida";
  }
};

/**
 * Obtiene el tiempo transcurrido desde una fecha hasta ahora en formato legible
 * @param {string} dateString - Fecha en formato ISO
 * @returns {string} Tiempo transcurrido
 */
export const getTimeAgo = (dateString) => {
  if (!dateString) return "Hace un tiempo";
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    
    if (diffInSeconds < 60) {
      return `Hace ${diffInSeconds} segundos`;
    }
    
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) {
      return `Hace ${diffInMinutes} minutos`;
    }
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) {
      return `Hace ${diffInHours} horas`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) {
      return `Hace ${diffInDays} días`;
    }
    
    const diffInMonths = Math.floor(diffInDays / 30);
    if (diffInMonths < 12) {
      return `Hace ${diffInMonths} meses`;
    }
    
    const diffInYears = Math.floor(diffInMonths / 12);
    return `Hace ${diffInYears} años`;
  } catch (error) {
    console.error("Error al calcular tiempo transcurrido:", error);
    return "Hace un tiempo";
  }
}; 