"use client";
import { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

// Componente que utiliza useSearchParams
function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMessage, setErrorMessage] = useState('Error durante la autenticación');
  
  useEffect(() => {
    // Get error message from query params
    const error = searchParams.get('error');
    if (error) {
      setErrorMessage(decodeURIComponent(error));
    }
  }, [searchParams]);

  return (
    <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold text-center text-red-600">Error de Autenticación</h2>
      <p className="text-center">{errorMessage}</p>
      <button 
        onClick={() => router.push('/login')}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
      >
        Volver a intentar
      </button>
    </div>
  );
}

// Componente principal con Suspense
export default function AuthError() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <Suspense fallback={
        <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-xl shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      }>
        <ErrorContent />
      </Suspense>
    </div>
  );
} 