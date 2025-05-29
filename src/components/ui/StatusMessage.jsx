"use client";
import { useState, useEffect } from 'react';

/**
 * Tipos de mensajes de estado
 * @typedef {'error'|'success'|'info'|'warning'} MessageType
 */

/**
 * Componente para mostrar mensajes de estado
 * 
 * @param {Object} props - Propiedades del componente
 * @param {string} props.message - Mensaje a mostrar
 * @param {MessageType} [props.type='info'] - Tipo de mensaje
 * @param {boolean} [props.autoClose=false] - Si el mensaje debe cerrarse automáticamente
 * @param {number} [props.duration=5000] - Duración en ms antes de cerrar (si autoClose=true)
 * @param {function} [props.onClose] - Función a ejecutar al cerrar el mensaje
 * @returns {JSX.Element|null} Componente de mensaje o null si no hay mensaje
 */
export default function StatusMessage({ 
  message, 
  type = 'info', 
  autoClose = false,
  duration = 5000,
  onClose
}) {
  const [visible, setVisible] = useState(true);
  
  // Configurar el autoclose si está habilitado
  useEffect(() => {
    if (autoClose && visible) {
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [autoClose, duration, visible, onClose]);
  
  // Si no hay mensaje o no es visible, no renderizar nada
  if (!message || !visible) return null;
  
  // Configurar las clases según el tipo de mensaje
  const typeStyles = {
    error: 'bg-red-100 text-red-800 border-red-300',
    success: 'bg-green-100 text-green-800 border-green-300',
    info: 'bg-blue-100 text-blue-800 border-blue-300',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-300'
  };
  
  // Íconos según el tipo
  const typeIcons = {
    error: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
      </svg>
    ),
    success: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
      </svg>
    ),
    info: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
      </svg>
    ),
    warning: (
      <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
    )
  };
  
  // Manejar el cierre del mensaje
  const handleClose = () => {
    setVisible(false);
    if (onClose) onClose();
  };
  
  return (
    <div 
      className={`${typeStyles[type] || typeStyles.info} border px-4 py-3 rounded relative mb-4`}
      role="alert"
    >
      <div className="flex items-center">
        {typeIcons[type]}
        <span className="block sm:inline">{message}</span>
      </div>
      
      <button
        className="absolute top-0 bottom-0 right-0 px-4 py-3"
        onClick={handleClose}
      >
        <svg
          className="fill-current h-5 w-5"
          role="button"
          viewBox="0 0 20 20"
        >
          <path
            d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"
          />
        </svg>
      </button>
    </div>
  );
} 