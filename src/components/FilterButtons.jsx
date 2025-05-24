"use client";
import { useState } from "react";

export default function FilterButtons() {
  // Estado para rastrear qué filtro está seleccionado actualmente
  const [activeFilter, setActiveFilter] = useState("Nuevo");

  // Opciones de filtros disponibles
  const filterOptions = ["Nuevo", "Sin responder", "Popular"];

  // Función para manejar el clic en los botones
  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  return (
    <div className="py-2 px-2 rounded-full bg-primary flex w-fit gap-2">
      {filterOptions.map((filter) => (
        <button
          key={filter}
          className={`hover:cursor-pointer py-1 px-3 rounded-full font-bold transition-all duration-200 ${
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
