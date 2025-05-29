"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ReturnButton from "@/components/layout/ReturnButton";
import { getCurrentUser } from "@/services/authService";
import { getQuestionsByUser, deleteQuestion } from "@/services/questionService";
import AuthGuard from "@/components/auth/AuthGuard";
import Avatar from "@/components/ui/Avatar";
import HashtagBadge from "@/components/ui/HashtagBadge";
import StatusMessage from "@/components/ui/StatusMessage";
import { FullPageLoading } from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/dateUtils";
import { getUserId, getUsername } from "@/utils/userUtils";
import Link from "next/link";

export default function Profile() {
  const router = useRouter();
  
  // Estados para el usuario y las preguntas
  const [user, setUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para eliminar preguntas
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Cargar datos del usuario cuando se monta el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error("No se encontraron datos del usuario");
        }
        
        console.log("Datos de usuario cargados:", currentUser);
        setUser(currentUser);
        
        // Verificar que el ID de usuario exista
        const userId = getUserId(currentUser);
        if (!userId) {
          console.error("ID de usuario no encontrado en los datos del usuario:", currentUser);
          throw new Error("No se pudo determinar el ID del usuario");
        }
        
        // Cargar preguntas del usuario usando el ID correcto
        try {
          console.log("Obteniendo preguntas para el usuario con ID:", userId);
          const questions = await getQuestionsByUser(userId);
          setUserQuestions(questions || []);
        } catch (questionsError) {
          console.error("Error al cargar preguntas del usuario:", questionsError);
          // No mostrar error fatal, solo establecer array vacío de preguntas
          setUserQuestions([]);
        }
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        setError(error.message || "Error al cargar datos del usuario");
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, [router]);

  // Función para manejar la eliminación de preguntas
  const handleDeleteQuestion = async (questionId, e) => {
    // Evitar que el click se propague al div contenedor
    e.stopPropagation();
    
    // Si ya estamos confirmando eliminar esta pregunta
    if (confirmDelete === questionId) {
      try {
        setDeletingQuestion(true);
        await deleteQuestion(questionId);
        
        // Obtener el ID de usuario de manera segura
        const userId = getUserId(user);
        
        // Actualizar la lista de preguntas
        const updatedQuestions = await getQuestionsByUser(userId);
        setUserQuestions(updatedQuestions || []);
        setConfirmDelete(null);
      } catch (error) {
        console.error("Error al eliminar pregunta:", error);
      } finally {
        setDeletingQuestion(false);
      }
    } else {
      // Mostrar confirmación
      setConfirmDelete(questionId);
    }
  };

  // Cancelar eliminación
  const handleCancelDelete = (e) => {
    e.stopPropagation();
    setConfirmDelete(null);
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return <FullPageLoading text="Cargando perfil..." />;
  }

  // Si hay error, mostrar mensaje
  if (error) {
    return (
      <AuthGuard>
        <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
          <ReturnButton />
          <StatusMessage message={error} type="error" />
        </main>
        <Footer />
      </AuthGuard>
    );
  }

  return (
    <AuthGuard>
      <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        <ReturnButton />
        
        {/* Información del perfil */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Perfil de Usuario</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar user={user} size="xl" />
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold">
                  {user.first_name || user.firstName} {user.last_name || user.lastName}
                </h2>
                <p className="text-gray-600">@{getUsername(user)}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Correo electrónico</p>
                  <p>{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Preguntas publicadas</p>
                  <p>{userQuestions.length}</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        {/* Listado de preguntas del usuario */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl md:text-2xl font-bold">Mis preguntas</h2>
            <Link href="/new-question">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Nueva pregunta
              </button>
            </Link>
          </div>
          
          {userQuestions.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                Aún no has publicado ninguna pregunta
              </p>
              <Link href="/new-question">
                <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Crear mi primera pregunta
                </button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {userQuestions.map(question => (
                <div 
                  key={question.question_id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer relative"
                  onClick={() => router.push(`/question?id=${question.question_id}`)}
                >
                  <div className="absolute top-2 right-2">
                    {confirmDelete === question.question_id ? (
                      <div className="flex space-x-2" onClick={e => e.stopPropagation()}>
                        <button
                          className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                          onClick={(e) => handleDeleteQuestion(question.question_id, e)}
                          disabled={deletingQuestion}
                        >
                          {deletingQuestion ? "Eliminando..." : "Confirmar"}
                        </button>
                        <button
                          className="bg-gray-300 text-gray-700 px-2 py-1 rounded text-xs"
                          onClick={handleCancelDelete}
                          disabled={deletingQuestion}
                        >
                          Cancelar
                        </button>
                      </div>
                    ) : (
                      <button
                        className="bg-white hover:bg-red-50 text-red-500 p-1 rounded-full border border-gray-200 hover:border-red-200 transition-colors shadow-sm"
                        onClick={(e) => handleDeleteQuestion(question.question_id, e)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                  <h3 className="font-bold text-lg mb-2 pr-8">{question.title}</h3>
                  <p className="text-gray-600 line-clamp-2">{question.content}</p>
                  <div className="flex justify-between items-center mt-3">
                    <div className="flex flex-wrap gap-2">
                      {question.hashtags && question.hashtags.map(tag => (
                        <HashtagBadge
                          key={typeof tag === 'object' ? tag.hashtag_id : tag}
                          tag={tag}
                          size="sm"
                        />
                      ))}
                    </div>
                    <p className="text-sm text-gray-500">{formatDate(question.date)}</p>
                  </div>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                    <span>👁️ {question.views || 0} vistas</span>
                    <span>💬 {question.response_count || 0} respuestas</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
    </AuthGuard>
  );
} 