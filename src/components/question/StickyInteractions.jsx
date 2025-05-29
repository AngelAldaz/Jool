"use client";
import Image from "next/image";
import { useState } from "react";

export default function StickyInteractions({ views, responses, stars, liked }) {
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [starCount, setStarCount] = useState(stars);

  return (
    <div className="sticky top-4 z-10 bg-white rounded-4xl shadow-card p-3 ">
      <div className="flex gap-6 items-center justify-center">
        <div className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors">
          <Image src="/views.svg" alt="Views" width={25} height={25} />
          <span className="text-xs md:text-sm font-medium">{views} views</span>
        </div>
        <a
          href="/question#answers"
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
        >
          <Image src="/comment.svg" alt="Responses" width={25} height={25} />
          <span className="text-xs md:text-sm font-medium">
            {responses} responses
          </span>
        </a>
        <a
          href=""
          className="flex items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
          onMouseEnter={() => setIsStarHovered(true)}
          onMouseLeave={() => setIsStarHovered(false)}
          onClick={(e) => {
            e.preventDefault();
            setStarCount(isLiked ? starCount - 1 : starCount + 1);
            setIsLiked(!isLiked);
          }}
        >
          <Image
            src={isStarHovered || isLiked ? "/starFill.svg" : "/starNoFill.svg"}
            alt="Stars"
            width={25}
            height={25}
          />
          <span className="text-xs md:text-sm font-medium">
            {starCount} stars
          </span>
        </a>
      </div>
    </div>
  );
}
