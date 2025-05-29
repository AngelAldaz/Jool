import React, { useState } from 'react';
import { authService } from '@/services/authService';

const MicrosoftLoginButton = ({ className, text = 'Continuar con Microsoft' }) => {
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    try {
      setError(null);
      await authService.loginWithMicrosoft();
    } catch (error) {
      setError('Ocurrió un error al iniciar sesión. Por favor intenta de nuevo.');
    }
  };

  return (
    <div>
      <button 
        type="button"
        onClick={handleLogin}
        className={className || "w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"}
      >
        <span>👨‍💻</span>
        {text}
      </button>
      {error && (
        <div className="mt-2 text-sm text-red-600 text-center">
          {error}
        </div>
      )}
    </div>
  );
};

export default MicrosoftLoginButton; 