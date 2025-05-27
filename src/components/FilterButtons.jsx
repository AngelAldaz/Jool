"use client";
import { useState } from "react";

export default function FilterButtons({ onFilterChange }) {
  // Estado para rastrear qué filtro está seleccionado actualmente
  const [activeFilter, setActiveFilter] = useState("Nuevo");

  // Opciones de filtros disponibles
  const filterOptions = ["Nuevo", "Sin responder", "Popular"];

  // Función para manejar el clic en los botones
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
    
    // Si se proporcionó una función de cambio de filtro, llamarla con el filtro seleccionado
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  return (
    <div className="py-2 px-2 rounded-full bg-primary flex w-full md:w-fit gap-2 justify-center">
      {filterOptions.map((filter) => (
        <button
          key={filter}
          className={`hover:cursor-pointer py-1 px-3 rounded-full font-bold transition-all duration-200 text-xs sm:text-sm md:text-base ${
            activeFilter === filter
              ? "bg-background text-text shadow-xl" // Sombra mejorada para botón activo
              : "bg-primary text-white shadow hover:shadow-lg" // Sombra sutil para inactivos con hover
          }`}
          onClick={() => handleFilterClick(filter)}
        >
          {filter}
        </button>
      ))}
    </div>
  );
}
