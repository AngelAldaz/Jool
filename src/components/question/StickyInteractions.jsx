"use client";
import Image from "next/image";
import { useState } from "react";

export default function StickyInteractions({ question }) {
  // Extraer los datos del objeto question
  const views = question?.views || 0;
  const responses = question?.responses?.length || 0;
  const stars = question?.stars || 0;
  
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [starCount, setStarCount] = useState(stars);

  return (
    <div className="flex flex-wrap gap-3 items-center justify-center">
      <div className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary flex-shrink-0">
          <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">{views} vistas</span>
      </div>
      
      <div className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5 text-primary flex-shrink-0">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">
          {responses} respuestas
        </span>
      </div>
      
      <button
        className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        onMouseEnter={() => setIsStarHovered(true)}
        onMouseLeave={() => setIsStarHovered(false)}
        onClick={() => {
          setStarCount(isLiked ? starCount - 1 : starCount + 1);
          setIsLiked(!isLiked);
        }}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          className="w-5 h-5 flex-shrink-0"
          fill={isStarHovered || isLiked ? "#183153" : "none"}
          stroke={isStarHovered || isLiked ? "#183153" : "currentColor"}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
        <span className="text-xs md:text-sm font-medium whitespace-nowrap">
          {starCount} estrellas
        </span>
      </button>
    </div>
  );
}
