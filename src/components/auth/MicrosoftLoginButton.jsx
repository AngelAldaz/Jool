import React from 'react';
import { authService } from '@/services/authService';

const MicrosoftLoginButton = ({ className, text = 'Continuar con Microsoft' }) => {
  const handleLogin = async () => {
    try {
      console.log('Iniciando proceso de autenticación con Microsoft...');
      await authService.loginWithMicrosoft();
    } catch (error) {
      console.error('Error al iniciar sesión con Microsoft:', error);
      // Manejar el error según necesidades de la UI
    }
  };

  return (
    <button 
      type="button"
      onClick={handleLogin}
      className={className || "w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"}
    >
      <span>👨‍💻</span>
      {text}
    </button>
  );
};

export default MicrosoftLoginButton; 