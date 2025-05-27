"use client";
import Image from "next/image";
import HashTag from "./Hashtag";
import { useState } from "react";
export default function PostCard() {
  const [isStarHovered, setIsStarHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [starCount, setStarCount] = useState(200);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Función para manejar el click en estrella
  const handleStarClick = (e) => {
    e.preventDefault();
    setStarCount(isLiked ? starCount - 1 : starCount + 1);
    setIsLiked(!isLiked);
  };
  return (
    <div className="rounded-4xl p-6 bg-white  shadow-card">
      <section className="flex flex-col md:flex-row justify-between">
        {/* Versión móvil - dropdown con tres puntos */}
        <div className="md:hidden relative ml-auto">
          {/* Alinear boton a la derecha */}
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="w-10 h-10 rounded-lg hover:bg-gray-50 transition-colors   "
            aria-label="Más opciones"
          >
            <Image src="/drop-down.svg" alt="Stars" width={30} height={30} />
          </button>

          {/* Dropdown menu */}
          {isDropdownOpen && (
            <>
              {/* Overlay para cerrar el dropdown */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setIsDropdownOpen(false)}
              />

              {/* Contenido del dropdown */}
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 py-2">
                {/* Views */}
                <div className="flex items-center gap-3 px-4 py-3 text-sm">
                  <Image src="/views.svg" alt="Views" width={20} height={20} />
                  <span className="font-medium">325 views</span>
                </div>

                {/* Responses */}
                <a
                  href=""
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Image
                    src="/comment.svg"
                    alt="Responses"
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">30 responses</span>
                </a>

                {/* Stars */}
                <a
                  href=""
                  className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition-colors"
                  onClick={(e) => {
                    handleStarClick(e);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Image
                    src={isLiked ? "/starFill.svg" : "/starNoFill.svg"}
                    alt="Stars"
                    width={20}
                    height={20}
                  />
                  <span className="font-medium">{starCount} stars</span>
                </a>
              </div>
            </>
          )}
        </div>
        {/* <h1 className="text-2xl font-semibold max-w-4xl text-text">
          Trouble shooting when using picam2.capture_array to take picture and
          put them into RAM
        </h1> */}
        <section className="bg-background rounded-xl p-5">
          <h1 className="text-xl md:text-2xl font-semibold text-text break-words">
            Trouble shooting when using picam2.capture_array to take picture and
            put them into RAM
          </h1>
        </section>
        <div className="flex gap-1 items-center">
          {/* Versión desktop - visible en pantallas medianas y grandes */}
          <div className="hidden md:flex gap-1 items-center">
            <div className="flex flex-col items-center gap-2 px-3 py-2 rounded-lg transition-colors">
              <Image src="/views.svg" alt="Views" width={30} height={30} />
              <span className="text-xs md:text-sm font-medium text-center">
                325 views
              </span>
            </div>
            <a
              href=""
              className="flex flex-col items-center gap-2 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors"
            >
              <Image
                src="/comment.svg"
                alt="Responses"
                width={30}
                height={30}
              />
              <span className="text-xs md:text-sm font-medium text-center">
                30 responses
              </span>
            </a>
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
      <section className="mt-1.5">
        <p className="text-justify  font-light text-primary">
          I am using my raspberry pi to try to complete the task, which is
          taking a picture in, then use the function get_angle to find the angle
          of reference of the blue dots in the picture. Then, turing the survo
          motor to aim the angle. However when I run my program I got this
          error:
        </p>
      </section>
      <section className="flex gap-2 mt-3">
        <HashTag>python</HashTag>
        <HashTag>raspberry-pi</HashTag>
      </section>
      <section className=" mt-2 flex justify-between items-center">
        <p className="text-primary font-light">Hace 6 días</p>
        {/* <p className="text-primary font-light">Comentarios: 30</p> */}
        <a href="/question">
          <Image src="/goto_link.svg" alt="Views" width={30} height={30} />
        </a>
      </section>
    </div>
  );
}
