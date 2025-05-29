import axios from 'axios';
import { authService } from './authService';
import endpoints from './configAPI';

const api = axios.create({
  baseURL: endpoints.BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si recibimos un 401 Unauthorized, el token ha expirado
    if (error.response && error.response.status === 401) {
      authService.logout();
      // Redirigir a la página de login
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api; 