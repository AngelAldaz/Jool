import endpoints from "./configAPI";
import { authHeader, isLoggedIn } from "./authService";

/**
 * Fetches all questions from the API
 * @returns {Promise<Array>} Array of question objects
 */
export const getAllQuestions = async () => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getAll, {
      method: "GET",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error fetching questions: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error fetching questions: ${response.statusText}`);
      }
    }

    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía del servidor para preguntas');
      return [];
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      const data = JSON.parse(responseText);
      console.log("Questions received from server:", data);
      return data;
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON de preguntas:', parseError);
      return [];
    }
  } catch (error) {
    console.error("Error fetching questions:", error);
    throw error;
  }
};

/**
 * Fetches a specific question by ID
 * @param {number} id - Question ID
 * @returns {Promise<Object>} Question object
 */
export const getQuestionById = async (id) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getById(id), {
      method: "GET",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error fetching question: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error fetching question: ${response.statusText}`);
      }
    }

    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log(`Respuesta vacía del servidor para la pregunta ${id}`);
      return null;
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      const data = JSON.parse(responseText);
      console.log("Question detail received from server:", data);
      return data;
    } catch (parseError) {
      console.error(`Error al parsear respuesta JSON de la pregunta ${id}:`, parseError);
      return null;
    }
  } catch (error) {
    console.error(`Error fetching question ${id}:`, error);
    throw error;
  }
};

/**
 * Creates a new question
 * @param {Object} questionData - Question data
 * @returns {Promise<Object>} Created question
 */
export const createQuestion = async (questionData) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.create, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(questionData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error creating question: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error creating question: ${response.statusText}`);
      }
    }

    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía al crear pregunta');
      return null;
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON al crear pregunta:', parseError);
      return null;
    }
  } catch (error) {
    console.error("Error creating question:", error);
    throw error;
  }
};

/**
 * Creates a new response to a question
 * @param {Object} responseData - Response data including content, question_id, and user_id
 * @returns {Promise<Object>} Created response
 */
export const createResponse = async (responseData) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    console.log("Sending response data to server:", responseData);

    const response = await fetch(endpoints.responses.create, {
      method: "POST",
      headers: authHeader(),
      body: JSON.stringify(responseData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error creating response: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error creating response: ${response.statusText}`);
      }
    }

    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log('Respuesta vacía al crear respuesta');
      return null;
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      const data = JSON.parse(responseText);
      console.log("Response created successfully:", data);
      return data;
    } catch (parseError) {
      console.error('Error al parsear respuesta JSON al crear respuesta:', parseError);
      return null;
    }
  } catch (error) {
    console.error("Error creating response:", error);
    throw error;
  }
};

/**
 * Deletes a response by ID
 * @param {number} responseId - The ID of the response to delete
 * @returns {Promise<void>}
 */
export const deleteResponse = async (responseId) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    console.log("Deleting response with ID:", responseId);

    const response = await fetch(endpoints.responses.delete(responseId), {
      method: "DELETE",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error deleting response: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error deleting response: ${response.statusText}`);
      }
    }

    console.log("Response deleted successfully");
    return;
  } catch (error) {
    console.error("Error deleting response:", error);
    throw error;
  }
};

/**
 * Gets questions by a specific hashtag
 * @param {string} hashtagName - Hashtag name
 * @returns {Promise<Array>} Array of question objects
 */
export const getQuestionsByHashtag = async (hashtagName) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getByHashtag(hashtagName), {
      method: "GET",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error fetching questions by hashtag: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error fetching questions by hashtag: ${response.statusText}`);
      }
    }

    // Manejar el caso de respuesta vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log(`No se encontraron preguntas para el hashtag ${hashtagName}`);
      return [];
    }
    
    try {
      // Intentar parsear la respuesta como JSON
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Error al parsear respuesta JSON para hashtag ${hashtagName}:`, parseError);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching questions with hashtag ${hashtagName}:`, error);
    throw error;
  }
};

/**
 * Gets questions by a specific user
 * @param {number} userId - User ID
 * @returns {Promise<Array>} Array of question objects
 */
export const getQuestionsByUser = async (userId) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getByUserId(userId), {
      method: "GET",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error fetching user questions: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error fetching user questions: ${response.statusText}`);
      }
    }

    // Verificar si la respuesta está vacía
    const responseText = await response.text();
    if (!responseText || responseText.trim() === '') {
      console.log(`No questions found for user ${userId}`);
      return [];
    }

    // Parsear la respuesta solo si contiene datos
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.error(`Error parsing response for user ${userId}:`, parseError);
      return [];
    }
  } catch (error) {
    console.error(`Error fetching questions for user ${userId}:`, error);
    throw error;
  }
};

/**
 * Deletes a question by ID
 * @param {number} questionId - The ID of the question to delete
 * @returns {Promise<void>}
 */
export const deleteQuestion = async (questionId) => {
  try {
    if (!isLoggedIn()) {
      throw new Error("Authentication required");
    }

    console.log("Deleting question with ID:", questionId);

    const response = await fetch(endpoints.questions.delete(questionId), {
      method: "DELETE",
      headers: authHeader()
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error response from server:", errorText);
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Error deleting question: ${response.status}`);
      } catch (parseError) {
        throw new Error(errorText || `Error deleting question: ${response.statusText}`);
      }
    }

    console.log("Question deleted successfully");
    return;
  } catch (error) {
    console.error("Error deleting question:", error);
    throw error;
  }
};

export default {
  getAllQuestions,
  getQuestionById,
  createQuestion,
  createResponse,
  deleteResponse,
  getQuestionsByHashtag,
  getQuestionsByUser,
  deleteQuestion
}; 