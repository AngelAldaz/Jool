"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/infrastructure/authService';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState('');
  
  useEffect(() => {
    console.log('Auth callback page loaded, processing hash...');
    if (window.location.hash) {
      console.log('Hash detected:', window.location.hash);
    } else {
      console.log('No hash found in URL');
    }
    
    // Process authentication data from hash fragment
    const userData = authService.processAuthHash();
    
    if (userData) {
      console.log('Authentication successful, user data:', userData);
      
      // Forzar una pequeña espera para asegurar que los datos se guarden correctamente
      setTimeout(() => {
        // Verificar que los datos de autenticación estén guardados
        if (authService.isAuthenticated()) {
          console.log('Verificación de autenticación exitosa, redirigiendo...');
          
          // Redirección con reemplazo de historial para evitar problemas de navegación
          window.location.href = '/';
        } else {
          console.error('Verificación de autenticación falló a pesar de tener datos de usuario');
          setError('Error al guardar los datos de autenticación. Por favor, intente nuevamente.');
        }
      }, 500);
    } else {
      console.error('Failed to process authentication data');
      setError('Error procesando la autenticación. Por favor, intente nuevamente.');
    }
  }, [router]);
  
  // If there's an error, show message
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-bold text-center text-red-600">Error de Autenticación</h2>
          <p className="text-center">{error}</p>
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
  
  // Show loading indicator while processing authentication
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        <p className="text-gray-600">Completando autenticación...</p>
      </div>
    </div>
  );
} 