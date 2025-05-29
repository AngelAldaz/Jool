"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  useEffect(() => {
    try {
      // Process authentication data from hash fragment
      const userData = authService.processAuthHash();
      
      if (userData) {
        // Forzar una pequeña espera para asegurar que los datos se guarden correctamente
        setTimeout(() => {
          // Verificar que los datos de autenticación estén guardados
          if (authService.isAuthenticated()) {
            // Redirección con reemplazo de historial para evitar problemas de navegación
            window.location.href = '/';
          } else {
            setError('Error al guardar los datos de autenticación. Por favor, intente nuevamente.');
          }
        }, 500);
      } else {
        setError('Error procesando la autenticación. Por favor, intente nuevamente.');
      }
    } catch (error) {
      setError(error.message || 'Error de autenticación desconocido');
    }
  }, [router]);
  
  // Si hay un error, mostrar mensaje
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-red-600">Error de Autenticación</h2>
          <div className="flex items-start mt-4 mb-6 bg-red-50 p-4 rounded-lg border-l-4 border-red-500">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-5a1 1 0 10-2 0v5z" clipRule="evenodd" />
            </svg>
            <p className="text-red-700">{error}</p>
          </div>
          <button 
            onClick={() => router.push('/login')}
            className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Volver a intentar
          </button>
        </div>
      </div>
    );
  }
  
  // Mostrar indicador de carga mientras se procesa la autenticación
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600">Completando autenticación...</p>
      </div>
    </div>
  );
} 