"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function AuthGuard({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isAuth, setIsAuth] = useState(false);
  
  useEffect(() => {
    // Verificar autenticación
    const checkAuth = () => {
      const authenticated = authService.isAuthenticated();
      console.log('AuthGuard - Estado de autenticación:', authenticated);
      
      if (!authenticated) {
        console.log('AuthGuard - Usuario no autenticado, redirigiendo a login');
        router.replace('/login');
      } else {
        console.log('AuthGuard - Usuario autenticado, mostrando contenido protegido');
        setIsAuth(true);
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [router]);
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-6 text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    );
  }
  
  return isAuth ? children : null;
} 