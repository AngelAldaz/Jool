const BASE_URL = 'https://159.65.178.199:8443';

const endpoints = {
  auth: {
    register: `${BASE_URL}/Auth/register`,
    login: `${BASE_URL}/Auth/login`,
    microsoftLogin: `${BASE_URL}/Auth/login-microsoft`,
    microsoftCallback: `${BASE_URL}/Auth/microsoft-callback`
  },
  hashtags: {
    getAll: `${BASE_URL}/Hashtags`,
    create: `${BASE_URL}/Hashtags`,
    getById: (id) => `${BASE_URL}/Hashtags/${id}`,
    update: (id) => `${BASE_URL}/Hashtags/${id}`,
    delete: (id) => `${BASE_URL}/Hashtags/${id}`
  },
  questions: {
    getAll: `${BASE_URL}/Questions`,
    create: `${BASE_URL}/Questions`,
    getById: (id) => `${BASE_URL}/Questions/${id}`,
    update: (id) => `${BASE_URL}/Questions/${id}`,
    delete: (id) => `${BASE_URL}/Questions/${id}`,
    getByUserId: (userId) => `${BASE_URL}/Questions/user/${userId}`,
    getByHashtag: (hashtagName) => `${BASE_URL}/Questions/hashtag/${hashtagName}`
  },
  responses: {
    getAll: `${BASE_URL}/Responses`,
    create: `${BASE_URL}/Responses`,
    getById: (id) => `${BASE_URL}/Responses/${id}`,
    update: (id) => `${BASE_URL}/Responses/${id}`,
    delete: (id) => `${BASE_URL}/Responses/${id}`
  }
};

export default endpoints;
