"use client";
import Image from "next/image";
import { useState } from "react";

export default function AnswerInfo({ userImage, user, time, stars, liked }) {
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(liked);
  const [starCount, setStarCount] = useState(stars);
  return (
    <div className="flex flex-row md:flex-col items-center gap-2 justify-between md:justify-normal">
      <div className="flex flex-col items-center gap-2">
        <img
          src={userImage}
          alt={user}
          width={50}
          height={50}
          className="rounded-full"
        />
        <p className="font-medium tracking-wide text-sm md:text-base text-center">
          {user}
        </p>
      </div>
      <a
        href=""
        className="flex flex-col items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
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
          width={40}
          height={40}
        />
        <span className="text-xs md:text-sm font-medium">{starCount}</span>
      </a>
      {/* <p className="text-primary font-light text-sm md:text-base text-center">
        {time}
      </p> */}
    </div>
  );
}
