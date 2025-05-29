"use client";
import Image from "next/image";
import { useState } from "react";
import Link from "next/link";
import HashtagBadge from "../ui/HashtagBadge";
import { getTimeAgo } from "@/utils/dateUtils";

export default function PostCard({ question }) {
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [starCount, setStarCount] = useState(question?.views || 0);
  const [isHovered, setIsHovered] = useState(false);

  // Función para manejar el click en estrella
  const handleStarClick = (e) => {
    e.preventDefault();
    setStarCount(isLiked ? starCount - 1 : starCount + 1);
    setIsLiked(!isLiked);
  };

  if (!question) {
    return null; // Don't render if no question data
  }

  return (
    <div 
      className={`rounded-4xl p-6 bg-white shadow-card transition-all duration-300 ${
        isHovered ? 'shadow-xl transform -translate-y-1 border-l-4 border-primary' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="bg-background rounded-xl p-5 relative">
        <div className="flex justify-between items-start">
          <h1 className="text-xl md:text-2xl font-bold text-text pr-12 break-words bg-gradient-to-r from-primary to-[#384a64] bg-clip-text text-transparent">
            {question.title}
          </h1>
          
          {/* Botón de más información en posición absoluta */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 md:block">
            <Link href={`/question?id=${question.question_id}`} className="bg-primary rounded-full p-2 shadow-md hover:bg-[#1e2a3d] transition-colors transform hover:rotate-12 hover:scale-110 inline-block">
              <Image src="/goto_link.svg" alt="Ver pregunta" width={24} height={24} className="filter brightness-0 invert" />
            </Link>
          </div>
        </div>
      </div>
      
      <section className="mt-4">
        <p className="text-justify font-light text-primary line-clamp-2 overflow-hidden">
          {question.content}
        </p>
      </section>
      
      <section className="flex gap-2 mt-5 flex-wrap">
        {question.hashtags && question.hashtags.map((hashtag) => (
          <HashtagBadge 
            key={typeof hashtag === 'object' ? hashtag.hashtag_id : hashtag} 
            tag={hashtag} 
            size="md"
          />
        ))}
      </section>
      
      {/* Información inferior: fecha, estadísticas ahora tanto en móvil como en desktop */}
      <section className="mt-5 pt-3 flex justify-between items-center border-t border-gray-200 bg-gradient-to-r from-transparent via-gray-100 to-transparent py-2 rounded-b-xl -mb-3 -mx-2 px-3">
        <p className="text-primary font-light">{getTimeAgo(question.date)}</p>
        
        {/* Versión móvil - Estadísticas inline */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
            <Image src="/views.svg" alt="Views" width={20} height={20} />
            <span className="text-xs font-medium">{question.views || 0}</span>
          </div>
          
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1">
            <Image src="/comment.svg" alt="Responses" width={20} height={20} />
            <span className="text-xs font-medium">{question.response_count || 0}</span>
          </div>
          
          <a 
            href=""
            className={`flex items-center gap-1 bg-gray-100 rounded-full px-2 py-1 ${isLiked ? 'bg-gray-200' : ''}`}
            onClick={handleStarClick}
          >
            <Image
              src={isLiked ? "/starFill.svg" : "/starNoFill.svg"}
              alt="Stars"
              width={20}
              height={20}
              className={isLiked ? 'animate-pulse' : ''}
            />
            <span className="text-xs font-medium">{starCount}</span>
          </a>
          
          <Link href={`/question?id=${question.question_id}`} className="bg-primary rounded-full p-1.5 shadow-md hover:bg-[#1e2a3d] transition-colors">
            <Image src="/goto_link.svg" alt="Ver pregunta" width={20} height={20} className="filter brightness-0 invert" />
          </Link>
        </div>
        
        {/* Versión desktop - Estadísticas ahora en la parte inferior */}
        <div className="hidden md:flex gap-1 items-center">
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
            <Image src="/views.svg" alt="Views" width={20} height={20} className="drop-shadow" />
            <span className="text-xs md:text-sm font-medium">
              {question.views || 0} views
            </span>
          </div>
          <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1">
            <Image
              src="/comment.svg"
              alt="Responses"
              width={20}
              height={20}
              className="drop-shadow"
            />
            <span className="text-xs md:text-sm font-medium">
              {question.response_count || 0} responses
            </span>
          </div>
          <a
            href=""
            className={`flex items-center gap-1 bg-gray-100 rounded-full px-3 py-1 ${isLiked ? 'bg-gray-200' : ''}`}
            onMouseEnter={() => setIsStarHovered(true)}
            onMouseLeave={() => setIsStarHovered(false)}
            onClick={handleStarClick}
          >
            <Image
              src={
                isStarHovered || isLiked ? "/starFill.svg" : "/starNoFill.svg"
              }
              alt="Stars"
              width={20}
              height={20}
              className={`${isLiked ? 'animate-pulse' : ''} drop-shadow`}
            />
            <span className="text-xs md:text-sm font-medium">
              {starCount} stars
            </span>
          </a>
        </div>
      </section>
    </div>
  );
}