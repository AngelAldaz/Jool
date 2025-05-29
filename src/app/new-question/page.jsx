"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import ReturnButton from "@/components/layout/ReturnButton";
import MDEditor from "@uiw/react-md-editor";
import { getCurrentUser } from "@/services/authService";
import { createQuestion } from "@/services/questionService";
import { getAllHashtags } from "@/services/hashtagService";
import AuthGuard from "@/components/auth/AuthGuard";
import HashtagInput from "@/components/form/HashtagInput";
import StatusMessage from "@/components/ui/StatusMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { getUserId } from "@/utils/userUtils";

export default function NewQuestion() {
  const router = useRouter();
  
  // Estados para el usuario
  const [user, setUser] = useState(null);
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
  
  // Cargar datos del usuario cuando se monta el componente
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const currentUser = getCurrentUser();
        if (!currentUser) {
          throw new Error("No se encontraron datos del usuario");
        }
        
        setUser(currentUser);
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar datos del usuario:", error);
        setError(error.message || "Error al cargar datos del usuario");
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Cargar hashtags disponibles al montar el componente
  useEffect(() => {
    const fetchHashtags = async () => {
      setHashtagsLoading(true);
      try {
        const hashtags = await getAllHashtags();
        setAvailableHashtags(hashtags || []);
      } catch (error) {
        console.error("Error al cargar hashtags:", error);
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
      
      // Enviar pregunta al servidor
      const createdQuestion = await createQuestion(questionData);
      
      setSubmitMessage("¡Pregunta creada correctamente!");
      setSubmitMessageType("success");
      
      // Redireccionar a la página de la pregunta después de 1.5 segundos
      setTimeout(() => {
        router.push(`/question?id=${createdQuestion.question_id}`);
      }, 1500);
    } catch (error) {
      console.error("Error al crear pregunta:", error);
      setSubmitMessage(`Error al enviar la pregunta: ${error.message}`);
      setSubmitMessageType("error");
      setIsSubmitting(false);
    }
  };

  // Si está cargando, mostrar spinner
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner text="Cargando..." />
      </div>
    );
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
        
        {/* Formulario para nueva pregunta */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">Crear nueva pregunta</h1>
          
          <form onSubmit={handleSubmitQuestion} className="space-y-6">
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
                height={300}
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
              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => router.push('/profile')}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors hover:cursor-pointer"
                >
                  Volver al perfil
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !newQuestion.title.trim() || !newQuestion.content.trim()}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
                >
                  {isSubmitting ? "Enviando..." : "Publicar pregunta"}
                </button>
              </div>

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
      </main>
      <Footer />
    </AuthGuard>
  );
} 