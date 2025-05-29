"use client";

/**
 * Componente para mostrar un indicador de carga
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.size='md'] - Tamaño del spinner: 'sm', 'md', 'lg'
 * @param {string} [props.color='blue'] - Color del spinner: 'blue', 'gray', 'white'
 * @param {string} [props.text] - Texto a mostrar debajo del spinner
 * @param {string} [props.className] - Clases adicionales
 * @returns {JSX.Element} Componente de LoadingSpinner
 */
export default function LoadingSpinner({ 
  size = 'md', 
  color = 'blue',
  text,
  className = ''
}) {
  // Configurar tamaños
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-12 w-12 border-2',
    lg: 'h-16 w-16 border-3',
  };
  
  // Configurar colores
  const colorClasses = {
    blue: 'border-blue-500',
    gray: 'border-gray-500',
    white: 'border-white',
  };
  
  const spinnerSize = sizeClasses[size] || sizeClasses.md;
  const spinnerColor = colorClasses[color] || colorClasses.blue;
  
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div 
        className={`animate-spin rounded-full ${spinnerSize} border-t-transparent border-b-transparent ${spinnerColor}`}
      />
      {text && (
        <p className="mt-3 text-gray-600 text-sm">{text}</p>
      )}
    </div>
  );
}

/**
 * Componente para mostrar una pantalla de carga a pantalla completa
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} [props.text='Cargando...'] - Texto a mostrar
 * @returns {JSX.Element} Componente de FullPageLoading
 */
export function FullPageLoading({ text = 'Cargando...' }) {
  return (
    <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 text-center">
        <LoadingSpinner size="lg" text={text} />
      </div>
    </div>
  );
} 