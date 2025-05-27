"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import ReturnButton from "@/components/ReturnButton";
import MDEditor from "@uiw/react-md-editor";
import { isLoggedIn, getCurrentUser } from "@/infrastructure/authService";
import { createQuestion, getQuestionsByUser, deleteQuestion } from "@/infrastructure/questionService";

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
    ontent: "",
    hashtags: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  // Estados para eliminar preguntas
  const [deletingQuestion, setDeletingQuestion] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  
  // Cargar datos del usuario cuando se monta el componente
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error("No se encontraron datos del usuario");
        }
        
        setUser(currentUser);
        
        // Cargar preguntas del usuario
        try {
          const questions = await getQuestionsByUser(currentUser.user_id);
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

  // Función para manejar cambios en los hashtags
  const handleHashtagsChange = (e) => {
    setNewQuestion(prev => ({
      ...prev,
      hashtags: e.target.value
    }));
  };

  // Función para manejar el envío de la nueva pregunta
  const handleSubmitQuestion = async (e) => {
    e.preventDefault();

    if (!newQuestion.title.trim() || !newQuestion.content.trim()) {
      setSubmitMessage("Por favor, completa todos los campos obligatorios.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const hashtagList = newQuestion.hashtags
        .split(",")
        .map(tag => tag.trim())
        .filter(tag => tag !== "")
        .map(tag => ({ name: tag }));
      
      // Crear objeto de pregunta
      const questionData = {
        title: newQuestion.title,
        content: newQuestion.content,
        user_id: user.user_id,
        hashtags: hashtagList
      };
      
      console.log("Enviando pregunta:", questionData);
      
      // Enviar pregunta al servidor
      const createdQuestion = await createQuestion(questionData);
      console.log("Pregunta creada:", createdQuestion);
      
      setSubmitMessage("¡Pregunta creada correctamente!");
      
      // Limpiar el formulario
      setNewQuestion({
        title: "",
        content: "",
        hashtags: ""
      });
      
      // Actualizar la lista de preguntas del usuario
      const updatedQuestions = await getQuestionsByUser(user.user_id);
      setUserQuestions(updatedQuestions);
    } catch (error) {
      console.error("Error al crear pregunta:", error);
      setSubmitMessage(`Error al enviar la pregunta: ${error.message}`);
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
        // Actualizar la lista de preguntas
        const updatedQuestions = await getQuestionsByUser(user.user_id);
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

  // Mostrar un mensaje de carga mientras se obtienen los datos
  if (loading) {
    return (
      <>
        <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
          <ReturnButton />
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Mostrar un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <>
        <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
          <ReturnButton />
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Formatear fecha a formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <>
      <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        <ReturnButton />
        
        {/* Información del perfil */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <h1 className="text-2xl md:text-3xl font-bold mb-4">Perfil de Usuario</h1>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src="https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg" 
                alt="Avatar" 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-xl font-bold">{user.first_name} {user.last_name}</h2>
                <p className="text-gray-600">@{user.email.split('@')[0]}</p>
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
                Hashtags (separados por comas)
              </label>
              <input
                type="text"
                id="hashtags"
                value={newQuestion.hashtags}
                onChange={handleHashtagsChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="react, javascript, programación"
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
                <p
                  className={`text-sm ${
                    submitMessage.includes("Error")
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {submitMessage}
                </p>
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
                    <div className="flex space-x-2">
                      {question.hashtags && question.hashtags.map(tag => (
                        <span 
                          key={tag.hashtag_id} 
                          className="bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-600"
                        >
                          #{tag.name}
                        </span>
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
    </>
  );
} 