"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { getCurrentUser } from "@/services/authService";

export default function Answer({
  response,
  formatDate,
  onDelete,
  isDeleting: parentIsDeleting
}) {
  const [showConfirm, setShowConfirm] = useState(false);
  const [localIsDeleting, setLocalIsDeleting] = useState(false);
  
  // Extraer datos de la respuesta
  const responseId = response?.response_id;
  const userId = response?.user_id;
  const user = response?.user_name || "Usuario";
  const userImage = response?.user_image || "https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg";
  const time = formatDate ? formatDate(response?.date) : "";
  const content = response?.content || "";
  const isDeleting = parentIsDeleting || localIsDeleting;
  const isBestAnswer = response?.is_best_answer || false;
  
  // Verificar si el usuario actual es el autor de la respuesta
  const currentUser = getCurrentUser();
  const isAuthor = currentUser && userId && currentUser.user_id === userId;

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setLocalIsDeleting(true);
    try {
      await onDelete(responseId);
      // La página se actualizará después de la eliminación exitosa
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      setLocalIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <div className={`p-6 rounded-2xl shadow-md border relative overflow-hidden ${
      isBestAnswer 
        ? "bg-green-50 border-2 border-green-300" 
        : "bg-white border-gray-100"
    }`}>
      <div className="flex items-start gap-4">
        {/* Información del usuario y tiempo */}
        <div className="flex-shrink-0">
          <img
            src={userImage}
            alt={user}
            width={48}
            height={48}
            className="rounded-full border-2 border-white shadow-sm"
          />
        </div>
        
        <div className="flex-grow min-w-0">
          <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
            <div>
              <h3 className="font-bold text-gray-800 break-words">{user}</h3>
              <p className="text-sm text-gray-500">{time}</p>
            </div>
          </div>
          
          {/* Mejor respuesta badge */}
          {isBestAnswer && (
            <div className="mb-3 inline-flex items-center gap-1 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 flex-shrink-0">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"></path>
                <path d="m9 12 2 2 4-4"></path>
              </svg>
              <span>Mejor respuesta</span>
            </div>
          )}
          
          {/* Contenido de la respuesta */}
          <div className="prose max-w-none prose-p:text-gray-700 prose-a:text-primary break-words overflow-hidden">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        </div>
      </div>
      
      {/* Botón de eliminar para el autor (no se muestra si es la mejor respuesta) */}
      {isAuthor && !isBestAnswer && (
        <div className="absolute top-4 right-4 z-10">
          {!showConfirm ? (
            <button
              onClick={handleDeleteClick}
              className="bg-white hover:bg-red-50 text-red-500 p-2 rounded-full shadow-sm hover:shadow transition-all"
              title="Eliminar respuesta"
              disabled={isDeleting}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
            </button>
          ) : (
            <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-md border border-gray-100">
              <span className="text-sm text-gray-700">¿Eliminar?</span>
              <button
                onClick={handleConfirmDelete}
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? "..." : "Sí"}
              </button>
              <button
                onClick={handleCancelDelete}
                className="bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-300"
                disabled={isDeleting}
              >
                No
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
