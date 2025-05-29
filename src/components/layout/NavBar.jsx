"use client";
import SearchBar from "../form/SearchBar";
import UserButton from "../auth/UserButton";
import FilterButtons from "../form/FilterButtons";
import Link from "next/link";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function NavBar({ onFilterChange, onSearch }) {
  const pathname = usePathname();
  const isNewQuestionPage = pathname === '/new-question';
  const [scrolled, setScrolled] = useState(false);
  
  // Detectar scroll para aplicar efectos
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleFilterChange = (filter) => {
    if (onFilterChange) {
      onFilterChange(filter);
    }
  };

  const handleSearch = (query) => {
    if (onSearch) {
      onSearch(query);
    }
  };

  return (
    <section className={`flex flex-col gap-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto px-0 pt-5 md:pt-6 sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'pb-3' : 'pb-1'}`}>
      {/* Logo para móviles */}
      <div className="flex justify-between items-center md:hidden">
        <Link href="/" className="block">
        <img
          src="/JOOL.svg"
          alt="Jool Logo"
            className="h-16 drop-shadow-md hover:drop-shadow-xl transition-all duration-300"
        />
      </Link>
        <UserButton />
      </div>
      
      {/* Barra de navegación principal */}
      <div className="flex flex-col gap-5 w-full">
        {/* Contenedor de búsqueda y usuario para escritorio */}
        <div className="flex items-center w-full">
          <div className="hidden md:flex items-center mr-4">
          <UserButton />
          </div>
          <div className="w-full transform hover:scale-[1.01] transition-transform duration-300">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
        
        {/* Contenedor de botones de acción y filtros */}
        <div className="flex justify-between md:justify-end items-center gap-4">
          {/* Botón de nueva pregunta */}
          {!isNewQuestionPage && (
            <div className="py-2 px-2 rounded-full bg-gradient-to-r from-primary to-[#384a64] flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 hover:from-[#1e2a3d] hover:to-primary transform hover:translate-y-[-2px]">
              <Link href="/new-question">
                <button className="py-1 px-3 rounded-full font-bold transition-all duration-200 text-white hover:shadow-lg text-sm flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Preguntar
                </button>
              </Link>
            </div>
          )}
          
          {/* Filtros */}
          <div className="flex transform hover:scale-[1.02] transition-transform duration-300">
        <FilterButtons onFilterChange={handleFilterChange} />
          </div>
        </div>
      </div>
    </section>
  );
}
