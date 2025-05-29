import endpoints from './configAPI';
import { createAuthHeaders, isAuthenticated } from './storageService';

/**
 * Obtiene todos los hashtags disponibles del servidor
 * @returns {Promise<Array>} - Array de objetos hashtag
 */
export const getAllHashtags = async () => {
  try {
    if (!isAuthenticated()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.hashtags.getAll, {
      method: "GET",
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error fetching hashtags: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error fetching hashtags: ${response.statusText}`);
      }
    }
    
    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía del servidor para hashtags');
      return [];
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON:', parseError);
      return [];
    }
  } catch (error) {
    console.error('Error in getAllHashtags:', error);
    throw error;
  }
};

export default {
  getAllHashtags
}; 