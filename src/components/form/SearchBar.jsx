"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function SearchBar({ onSearch }) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  return (
    <div className="py-1 px-4 rounded-full bg-primary flex items-center w-full">
      <Link href="/">
        <img
          src="/JOOL.svg"
          alt="Jool Logo"
          className="hidden md:block h-14"
        />
      </Link>
      <form onSubmit={handleSubmit} className="flex items-center rounded-full bg-background pr-4 h-1/2 w-full">
        <input
          type="text"
          placeholder="Buscar"
          className="flex-grow p-4 text-xl text-text bg-transparent focus:outline-none min-w-0"
          value={searchQuery}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
        />
        <button 
          type="submit" 
          className="flex-shrink-0 w-5 h-5 relative hover:opacity-80 transition-opacity"
          aria-label="Buscar"
        >
          <Image
            src="/search.svg"
            alt="Search"
            width={20}
            height={20}
            className="w-full h-full"
          />
        </button>
      </form>
    </div>
  );
}
