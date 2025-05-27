"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import AnswerInfo from "./AnswerInfo";
import { getCurrentUser } from "@/infrastructure/authService";

export default function Answer({
  responseId,
  userImage,
  user,
  time,
  stars,
  markdownContent,
  correct,
  userId,
  onDelete
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  
  // Verificar si el usuario actual es el autor de la respuesta
  const currentUser = getCurrentUser();
  const isAuthor = currentUser && userId && currentUser.user_id === userId;

  const handleDeleteClick = () => {
    setShowConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(responseId);
      // No necesitamos hacer nada más aquí, la página se actualizará después de la eliminación
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      setIsDeleting(false);
      setShowConfirm(false);
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
  };

  return (
    <section
      className={`rounded-4xl p-6 md:p-8 ${
        correct ? "bg-green-50 border-2 border-green-200" : "bg-white "
      } shadow-sm flex flex-col md:flex-row gap-4 text-primary relative`}
    >
      <AnswerInfo
        userImage={userImage}
        user={user}
        time={time}
        stars={stars}
        liked={false}
      />
      <div className="flex flex-col gap-4 break-all w-full">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
        
        {/* Solo mostrar el botón de eliminar si es el autor Y NO es la mejor respuesta */}
        {isAuthor && !correct && (
          <div className="absolute top-4 right-4">
            {!showConfirm ? (
              <button
                onClick={handleDeleteClick}
                className="bg-white hover:bg-gray-50 text-red-500 p-2 rounded-full shadow-sm hover:shadow transition-all"
                title="Eliminar respuesta"
                disabled={isDeleting}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >
                <svg className="MuiSvgIcon-root" focusable="false" viewBox="0 0 24 24" aria-hidden="true" style={{ width: 20, height: 20 }}>
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path>
                </svg>
              </button>
            ) : (
              <div className="flex items-center gap-2 bg-white p-2 rounded shadow-md">
                <span className="text-sm">¿Eliminar respuesta?</span>
                <button
                  onClick={handleConfirmDelete}
                  className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 disabled:opacity-50"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Eliminando..." : "Sí"}
                </button>
                <button
                  onClick={handleCancelDelete}
                  className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs hover:bg-gray-400"
                  disabled={isDeleting}
                >
                  No
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
