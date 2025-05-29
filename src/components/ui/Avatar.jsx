"use client";
import { useState } from 'react';
import { getFullName } from '@/utils/userUtils';

/**
 * Componente de Avatar que muestra la imagen de perfil del usuario o sus iniciales
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Objeto de usuario
 * @param {string} [props.size='md'] - Tamaño del avatar: 'sm', 'md', 'lg' o 'xl'
 * @param {string} [props.className] - Clases adicionales
 * @returns {JSX.Element} Componente de Avatar
 */
export default function Avatar({ user, size = 'md', className = '' }) {
  const [imageError, setImageError] = useState(false);
  
  // Determinar las clases de tamaño
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-sm',
    lg: 'w-16 h-16 text-base',
    xl: 'w-24 h-24 text-xl'
  };
  
  const avatarSize = sizeClasses[size] || sizeClasses.md;
  
  // Obtener las iniciales del usuario
  const getInitials = () => {
    const name = getFullName(user);
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Determinar si mostrar imagen o iniciales
  const hasValidImage = user?.hasImage || user?.has_image;
  const imageUrl = hasValidImage ? `https://api.example.com/users/${user.id || user.user_id}/avatar` : null;
  
  // Si tiene imagen y no hay error, mostrar la imagen
  if (imageUrl && !imageError) {
    return (
      <div 
        className={`${avatarSize} rounded-full overflow-hidden flex items-center justify-center bg-gray-200 ${className}`}
      >
        <img 
          src={imageUrl}
          alt={getFullName(user)}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }
  
  // Si no tiene imagen o hubo un error, mostrar las iniciales
  return (
    <div 
      className={`${avatarSize} rounded-full flex items-center justify-center bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold ${className}`}
    >
      {getInitials()}
    </div>
  );
} 