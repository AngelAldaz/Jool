"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ReturnButton from "@/components/layout/ReturnButton";
import MDEditor from "@uiw/react-md-editor";
import { getCurrentUser } from "@/services/authService";
import { createQuestion, getQuestionsByUser, deleteQuestion } from "@/services/questionService";
import { getAllHashtags } from "@/services/hashtagService";
import AuthGuard from "@/components/auth/AuthGuard";
import Avatar from "@/components/ui/Avatar";
import HashtagInput from "@/components/form/HashtagInput";
import HashtagBadge from "@/components/ui/HashtagBadge";
import StatusMessage from "@/components/ui/StatusMessage";
import LoadingSpinner, { FullPageLoading } from "@/components/ui/LoadingSpinner";
import { formatDate } from "@/utils/dateUtils";
import { getUserId, getUsername } from "@/utils/userUtils";

export default function Profile() {
  const router = useRouter();
  
  // Estados para el usuario y las preguntas
  const [user, setUser] = useState(null);
  const [userQuestions, setUserQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados para el formulario de nueva pregunta
  const [newQuestion, setNewQuestion] = useState({
    title: "",
    content: "",
    hashtags: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitMessageType, setSubmitMessageType] = useState("info");
  
  // Estados para hashtags
  const [availableHashtags, setAvailableHashtags] = useState([]);
  const [hashtagsLoading, setHashtagsLoading] = useState(false);
  
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

  // Cargar hashtags disponibles al montar el componente
  useEffect(() => {
    const fetchHashtags = async () => {
      setHashtagsLoading(true);
      try {
        const hashtags = await getAllHashtags();
        setAvailableHashtags(hashtags || []);
      } catch (error) {
        console.error("Error al cargar hashtags:", error);
        // No mostrar error fatal, simplemente seguir con array vacío
        setAvailableHashtags([]);
      } finally {
        setHashtagsLoading(false);
      }
    };

    fetchHashtags();
  }, []);

  // Función para manejar cambios en el título
  const handleTitleChange = (e) => {
    setNewQuestion(prev => ({
      ...prev,
      title: e.target.value
    }));
  };

  // Función para manejar cambios en el contenido (Markdown)
  const handleContentChange = (value) => {
    setNewQuestion(prev => ({
      ...prev,
      content: value
    }));
  };

  // Función para añadir un hashtag a la pregunta
  const handleAddHashtag = (hashtagName) => {
    if (!newQuestion.hashtags.includes(hashtagName)) {
      setNewQuestion(prev => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagName]
      }));
    }
  };

  // Función para remover un hashtag de la pregunta
  const handleRemoveHashtag = (hashtagToRemove) => {
    setNewQuestion(prev => ({
      ...prev,
      hashtags: prev.hashtags.filter(tag => tag !== hashtagToRemove)
    }));
  };

  // Función para manejar el envío de la nueva pregunta
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      setSubmitMessage("Por favor, completa todos los campos obligatorios.");
      setSubmitMessageType("warning");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      // Obtener el ID de usuario de manera segura
      const userId = getUserId(user);
      if (!userId) {
        throw new Error("No se pudo determinar el ID del usuario");
      }
      
      // Crear objeto de pregunta con el ID correcto
      const questionData = {
        title: newQuestion.title,
        content: newQuestion.content,
        user_id: userId,
        hashtags: newQuestion.hashtags
      };
      
      console.log("Enviando pregunta:", questionData);
      
      // Enviar pregunta al servidor
      const createdQuestion = await createQuestion(questionData);
      console.log("Pregunta creada:", createdQuestion);
      
      setSubmitMessage("¡Pregunta creada correctamente!");
      setSubmitMessageType("success");
      
      // Limpiar el formulario
      setNewQuestion({
        title: "",
        content: "",
        hashtags: []
      });
      
      // Actualizar la lista de preguntas del usuario
      const updatedQuestions = await getQuestionsByUser(userId);
      setUserQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error al crear pregunta:", error);
      setSubmitMessage(`Error al enviar la pregunta: ${error.message}`);
      setSubmitMessageType("error");
    } finally {
      setIsSubmitting(false);
    }
  };

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
        
        {/* Formulario para nueva pregunta */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Crear nueva pregunta</h2>
          
          <form onSubmit={handleSubmitQuestion} className="space-y-4">
            <div>
              <label 
                htmlFor="title" 
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Título de la pregunta
              </label>
              <input
                type="text"
                id="title"
                value={newQuestion.title}
                onChange={handleTitleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Escribe un título descriptivo"
                required
              />
            </div>
            
            <div data-color-mode="light">
              <label
                htmlFor="content"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contenido de la pregunta (puedes usar Markdown)
              </label>
              <MDEditor
                id="content"
                value={newQuestion.content}
                onChange={handleContentChange}
              />
            </div>
            
            <div>
              <label
                htmlFor="hashtags"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Hashtags
              </label>
              
              <HashtagInput
                selectedTags={newQuestion.hashtags}
                onAddTag={handleAddHashtag}
                onRemoveTag={handleRemoveHashtag}
                availableTags={availableHashtags}
                isLoading={hashtagsLoading}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || !newQuestion.title.trim() || !newQuestion.content.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
              >
                {isSubmitting ? "Enviando..." : "Publicar pregunta"}
              </button>

              {submitMessage && (
                <StatusMessage 
                  message={submitMessage} 
                  type={submitMessageType}
                  onClose={() => setSubmitMessage("")}
                />
              )}
            </div>
          </form>
        </section>
        
        {/* Listado de preguntas del usuario */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Mis preguntas</h2>
          
          {userQuestions.length === 0 ? (
            <p className="text-gray-500 text-center py-6">
              Aún no has publicado ninguna pregunta
            </p>
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