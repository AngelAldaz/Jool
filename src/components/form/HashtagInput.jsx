"use client";
import { useState, useRef, useEffect } from 'react';
import HashtagBadge from "../ui/HashtagBadge";

/**
 * Componente para entrada de hashtags con dropdown
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Array<string>} props.selectedTags - Array de tags seleccionados
 * @param {function} props.onAddTag - Función para añadir un tag
 * @param {function} props.onRemoveTag - Función para eliminar un tag
 * @param {Array<Object>} [props.availableTags=[]] - Lista de tags disponibles
 * @param {boolean} [props.isLoading=false] - Si está cargando los tags disponibles
 * @param {string} [props.placeholder="Buscar o escribir hashtag"] - Placeholder para el input
 * @returns {JSX.Element} Componente de HashtagInput
 */
export default function HashtagInput({
  selectedTags,
  onAddTag,
  onRemoveTag,
  availableTags = [],
  isLoading = false,
  placeholder = "Buscar o escribir hashtag"
}) {
  const [inputValue, setInputValue] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  
  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current && 
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Manejar cambio en el input
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    if (e.target.value.trim()) {
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };
  
  // Filtrar tags disponibles según el input
  const filteredTags = inputValue.trim()
    ? availableTags.filter(tag => 
        tag.name.toLowerCase().includes(inputValue.toLowerCase())
      )
    : [];
  
  // Verificar si el tag ya existe en las opciones
  const tagExistsInOptions = inputValue.trim() && 
    availableTags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase());
  
  // Verificar si el tag ya está seleccionado
  const tagAlreadySelected = inputValue.trim() &&
    selectedTags.includes(inputValue.trim());
  
  // Manejar selección de un tag
  const handleSelectTag = (tagName) => {
    if (!selectedTags.includes(tagName)) {
      onAddTag(tagName);
    }
    setInputValue('');
    setShowDropdown(false);
  };
  
  // Manejar creación de un nuevo tag
  const handleCreateTag = () => {
    if (inputValue.trim() && !tagAlreadySelected) {
      onAddTag(inputValue.trim());
      setInputValue('');
      setShowDropdown(false);
    }
  };
  
  // Manejar keydown en el input
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      handleCreateTag();
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };
  
  return (
    <div className="space-y-2">
      {/* Tags seleccionados */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2">
          {selectedTags.map(tag => (
            <div key={tag} className="flex items-center">
              <HashtagBadge tag={tag} interactive={false} />
              <button 
                type="button"
                onClick={() => onRemoveTag(tag)}
                className="ml-1 text-gray-500 hover:text-red-500"
                aria-label={`Eliminar hashtag ${tag}`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
      
      {/* Input y dropdown */}
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => inputValue.trim() && setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />
        
        {showDropdown && (
          <div 
            ref={dropdownRef}
            className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-lg max-h-60 overflow-y-auto"
          >
            {isLoading ? (
              <div className="flex justify-center items-center p-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <ul>
                {filteredTags.length > 0 ? (
                  filteredTags.map(tag => (
                    <li 
                      key={tag.hashtag_id}
                      onClick={() => handleSelectTag(tag.name)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      #{tag.name} 
                      {tag.used_count > 0 && (
                        <span className="text-gray-500 text-sm ml-2">
                          ({tag.used_count} {tag.used_count === 1 ? 'uso' : 'usos'})
                        </span>
                      )}
                    </li>
                  ))
                ) : (
                  <li className="px-4 py-2 text-gray-500">
                    No se encontraron coincidencias
                  </li>
                )}
                
                {inputValue.trim() && !tagExistsInOptions && !tagAlreadySelected && (
                  <li 
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer border-t border-gray-200"
                    onClick={handleCreateTag}
                  >
                    Crear: <span className="font-bold">#{inputValue.trim()}</span>
                  </li>
                )}
                
                {tagAlreadySelected && (
                  <li className="px-4 py-2 text-gray-500">
                    Este hashtag ya está seleccionado
                  </li>
                )}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
} 