"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      // Check authentication
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Redirect to login if not authenticated
        router.replace('/login');
      } else {
        setLoading(false);
      }
    }, [router]);
    
    if (loading) {
      return (
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      );
    }
    
    return <WrappedComponent {...props} />;
  };
  
  return WithAuth;
};

export default withAuth; 