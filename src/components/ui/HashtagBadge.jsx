"use client";
import { useRouter } from 'next/navigation';

/**
 * Componente para mostrar un hashtag como badge
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string|Object} props.tag - Nombre del hashtag o objeto con información
 * @param {boolean} [props.interactive=true] - Si el hashtag es clickeable
 * @param {string} [props.size='md'] - Tamaño del badge: 'sm', 'md' o 'lg'
 * @param {string} [props.className] - Clases adicionales
 * @returns {JSX.Element} Componente de HashtagBadge
 */
export default function HashtagBadge({ 
  tag, 
  interactive = true, 
  size = 'md',
  className = '' 
}) {
  const router = useRouter();
  
  // Determinar el nombre del hashtag
  const tagName = typeof tag === 'object' ? tag.name : tag;
  
  // Clases según el tamaño
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };
  
  const badgeSize = sizeClasses[size] || sizeClasses.md;
  
  // Clases base para todos los badges
  const baseClasses = `inline-flex items-center rounded-full ${badgeSize} font-medium`;
  
  // Clases para badges interactivos y no interactivos
  const styleClasses = interactive
    ? 'bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors'
    : 'bg-gray-100 text-gray-600';
  
  // Manejar click en el hashtag
  const handleClick = (e) => {
    if (!interactive) return;
    
    e.stopPropagation(); // Evitar propagación si está dentro de otro elemento clickeable
    router.push(`/hashtag/${tagName}`);
  };
  
  return (
    <span 
      className={`${baseClasses} ${styleClasses} ${className}`} 
      onClick={handleClick}
    >
      #{tagName}
    </span>
  );
} 