const BASE_URL = 'http://localhost:8080';

const endpoints = {
  auth: {
    register: `${BASE_URL}/Auth/register`,
    login: `${BASE_URL}/Auth/login`
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
  }
};

export default endpoints;
