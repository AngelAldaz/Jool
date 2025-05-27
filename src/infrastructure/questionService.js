import endpoints from "./configAPI";
import { authHeader } from "./authService";

/**
 * Fetches all questions from the API
 * @returns {Promise<Array>} Array of question objects
 */
export const getAllQuestions = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getAll, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
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

    const data = await response.json();
    console.log("Questions received from server:", data);
    return data;
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getById(id), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
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

    const data = await response.json();
    console.log("Question detail received from server:", data);
    return data;
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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

    return await response.json();
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Sending response data to server:", responseData);

    const response = await fetch(endpoints.responses.create, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
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

    const data = await response.json();
    console.log("Response created successfully:", data);
    return data;
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    console.log("Deleting response with ID:", responseId);

    const response = await fetch(endpoints.responses.delete(responseId), {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getByHashtag(hashtagName), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
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

    return await response.json();
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
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(endpoints.questions.getByUserId(userId), {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
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

    return await response.json();
  } catch (error) {
    console.error(`Error fetching questions for user ${userId}:`, error);
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
  getQuestionsByUser
}; 