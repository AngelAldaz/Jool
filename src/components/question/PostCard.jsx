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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    <div className="rounded-4xl p-6 bg-white shadow-card">
      <section className="flex flex-col md:flex-row justify-between">
        <section className="bg-background rounded-xl p-5 w-full md:w-3/5">
          <h1 className="text-xl md:text-2xl font-semibold text-text break-words line-clamp-2">
            {question.title}
          </h1>
        </section>
        <div className="flex gap-1 items-center">
          {/* Versión desktop - visible en pantallas medianas y grandes */}
          <div className="hidden md:flex gap-1 items-center">
            <div className="flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-colors">
              <Image src="/views.svg" alt="Views" width={30} height={30} />
              <span className="text-xs md:text-sm font-medium text-center">
                {question.views || 0} views
              </span>
            </div>
            <div
              className="flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-colors"
            >
              <Image
                src="/comment.svg"
                alt="Responses"
                width={30}
                height={30}
              />
              <span className="text-xs md:text-sm font-medium text-center">
                {question.response_count || 0} responses
              </span>
            </div>
            <a
              href=""
              className="flex flex-col items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
              onMouseEnter={() => setIsStarHovered(true)}
              onMouseLeave={() => setIsStarHovered(false)}
              onClick={handleStarClick}
            >
              <Image
                src={
                  isStarHovered || isLiked ? "/starFill.svg" : "/starNoFill.svg"
                }
                alt="Stars"
                width={30}
                height={30}
              />
              <span className="text-xs md:text-sm font-medium text-center">
                {starCount} stars
              </span>
            </a>
          </div>
        </div>
      </section>
      
      <section className="mt-4">
        <p className="text-justify font-light text-primary line-clamp-2 overflow-hidden">
          {question.content}
        </p>
      </section>
      
      <section className="flex gap- mt-5 flex-wrap">
        {question.hashtags && question.hashtags.map((hashtag) => (
          <HashtagBadge 
            key={typeof hashtag === 'object' ? hashtag.hashtag_id : hashtag} 
            tag={hashtag} 
            size="md"
          />
        ))}
      </section>
      
      {/* Información inferior: fecha, estadísticas móvil y enlace */}
      <section className="mt-5 pt-3 flex justify-between items-center border-t border-gray-100">
        <p className="text-primary font-light">{getTimeAgo(question.date)}</p>
        
        {/* Versión móvil - Estadísticas inline */}
        <div className="md:hidden flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Image src="/views.svg" alt="Views" width={20} height={20} />
            <span className="text-xs font-medium">{question.views || 0}</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Image src="/comment.svg" alt="Responses" width={20} height={20} />
            <span className="text-xs font-medium">{question.response_count || 0}</span>
          </div>
          
          <a 
            href=""
            className="flex items-center gap-1"
            onClick={handleStarClick}
          >
            <Image
              src={isLiked ? "/starFill.svg" : "/starNoFill.svg"}
              alt="Stars"
              width={20}
              height={20}
            />
            <span className="text-xs font-medium">{starCount}</span>
          </a>
          
          <Link href={`/question?id=${question.question_id}`}>
            <Image src="/goto_link.svg" alt="Ver pregunta" width={24} height={24} />
          </Link>
        </div>
        
        {/* Versión desktop - Solo enlace para ver la pregunta */}
        <div className="hidden md:block">
          <Link href={`/question?id=${question.question_id}`}>
            <Image src="/goto_link.svg" alt="Ver pregunta" width={30} height={30} />
          </Link>
        </div>
      </section>
    </div>
  );
}
