"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import QuestionHeading from "@/components/QuestionHeading";
import ReturnButton from "@/components/ReturnButton";
import StickyInteractions from "@/components/StickyInteractions";
import ReactMarkdown from "react-markdown";
import Answer from "@/components/Answer";
import MDEditor from "@uiw/react-md-editor";
import { getQuestionById, createResponse, deleteResponse } from "@/infrastructure/questionService";
import { isLoggedIn, getCurrentUser } from "@/infrastructure/authService";

export default function QuestionDetail() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");
  
  // Estados para la pregunta y carga
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para el formulario de nueva respuesta
  const [newResponse, setNewResponse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  
  // Estado para eliminar respuestas
  const [deletingResponse, setDeletingResponse] = useState(false);

  // Cargar la pregunta cuando se monta el componente
  useEffect(() => {
    // Verificar si el usuario está autenticado
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Verificar si hay un ID de pregunta
    if (!questionId) {
      router.push("/");
      return;
    }

    fetchQuestionDetails();
  }, [questionId, router]);

  // Función para obtener los detalles de la pregunta
  const fetchQuestionDetails = async () => {
    try {
      setLoading(true);
      const data = await getQuestionById(questionId);
      console.log("Pregunta cargada:", data);
      setQuestion(data);
    } catch (error) {
      console.error("Error fetching question:", error);
      setError(error.message || "Error al cargar la pregunta");
      // Si hay un error de autenticación, redireccionar al login
      if (error.message.includes("Authentication") || error.message.includes("401")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  // Formatear fecha a formato legible
  const formatDate = (dateString) => {
    if (!dateString) return "Hace un momento";
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Hoy";
    if (diffDays === 1) return "Ayer";
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    if (diffDays < 365) return `Hace ${Math.floor(diffDays / 30)} meses`;
    return `Hace ${Math.floor(diffDays / 365)} años`;
  };

  // Función para manejar el envío de la nueva respuesta
  const handleSubmitResponse = async (e) => {
    e.preventDefault();

    if (!newResponse.trim()) {
      setSubmitMessage("Por favor, escribe una respuesta antes de enviar.");
      return;
    }

    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const currentUser = getCurrentUser();
      
      if (!currentUser || !currentUser.user_id) {
        throw new Error("Usuario no autenticado");
      }
      
      // Crear objeto de respuesta
      const responseData = {
        content: newResponse,
        question_id: parseInt(questionId),
        user_id: currentUser.user_id
      };
      
      console.log("Enviando respuesta:", responseData);
      
      // Enviar respuesta al servidor
      const createdResponse = await createResponse(responseData);
      console.log("Respuesta creada:", createdResponse);
      
      setSubmitMessage("¡Respuesta enviada correctamente!");
      setNewResponse(""); // Limpiar el formulario
      
      // Actualizar la pregunta para mostrar la nueva respuesta
      await fetchQuestionDetails();
    } catch (error) {
      console.error("Error al crear respuesta:", error);
      setSubmitMessage(`Error al enviar la respuesta: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Función para manejar la eliminación de respuestas
  const handleDeleteResponse = async (responseId) => {
    if (!responseId) return;
    
    try {
      setDeletingResponse(true);
      await deleteResponse(responseId);
      // Actualizar la pregunta para reflejar los cambios
      await fetchQuestionDetails();
      return true;
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      return false;
    } finally {
      setDeletingResponse(false);
    }
  };

  // Mostrar un mensaje de carga mientras se obtiene la pregunta
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

  // Mostrar un mensaje si no se encuentra la pregunta
  if (!question) {
    return (
      <>
        <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
          <ReturnButton />
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-600">Pregunta no encontrada</h3>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        <ReturnButton />
        <div className="relative space-y-6">
          <StickyInteractions
            views={question.views || 0}
            responses={question.response_count || 0}
            stars={question.views || 0} // Usar views como stars por ahora
            liked={false}
          />
          <section className="rounded-4xl p-6 md:p-8 bg-white shadow-card flex flex-col gap-4">
            <QuestionHeading 
              user={question.user_name || "Usuario"} 
              userImage={"https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg"} // Imagen por defecto
              time={formatDate(question.date)} 
            />
            <section className="bg-background rounded-xl p-5">
              <h1 className="text-xl md:text-2xl font-bold text-text break-words">
                {question.title}
              </h1>
            </section>
            <div className="flex flex-col gap-4">
              <ReactMarkdown>{question.content}</ReactMarkdown>
            </div>
          </section>
        </div>

        {/* Respuestas */}
        {question.responses && question.responses.length > 0 && (
          <>
            {/* Mostrar la respuesta más reciente como "Mejor Respuesta" */}
            <h1 className="text-xl md:text-2xl font-bold" id="answers">
              Mejor Respuesta
            </h1>
            {/* Ordenar por fecha (más reciente primero) y mostrar solo la primera */}
            {[...question.responses]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 1)
              .map((response) => (
                <Answer
                  key={response.response_id}
                  responseId={response.response_id}
                  userId={response.user_id}
                  userImage={"https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg"}
                  user={response.user_name || "Usuario"}
                  time={formatDate(response.date)}
                  stars={response.likes || 0}
                  markdownContent={response.content}
                  correct={true}
                  onDelete={handleDeleteResponse}
                />
              ))}

            {/* Mostrar todas las respuestas */}
            <h1 className="text-xl md:text-2xl font-bold">
              {question.response_count || 0} Respuestas
            </h1>
            {/* Ordenar por número de likes (más likes primero) */}
            {[...question.responses]
              .sort((a, b) => b.likes - a.likes)
              .map((response) => (
                <Answer
                  key={response.response_id}
                  responseId={response.response_id}
                  userId={response.user_id}
                  userImage={"https://images.dog.ceo/breeds/maltese/n02085936_6927.jpg"}
                  user={response.user_name || "Usuario"}
                  time={formatDate(response.date)}
                  stars={response.likes || 0}
                  markdownContent={response.content}
                  correct={false}
                  onDelete={handleDeleteResponse}
                />
              ))}
          </>
        )}

        {/* Formulario para nueva respuesta */}
        <section className="rounded-4xl p-6 md:p-8 bg-white shadow-sm">
          <h2 className="text-xl md:text-2xl font-bold mb-4">Tu respuesta</h2>
          <form onSubmit={handleSubmitResponse} className="space-y-4">
            <div data-color-mode="light">
              <label
                htmlFor="response-input"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Escribe tu respuesta (puedes usar Markdown)
              </label>
              <MDEditor value={newResponse} onChange={setNewResponse} />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                disabled={isSubmitting || !newResponse.trim()}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors hover:cursor-pointer"
              >
                {isSubmitting ? "Enviando..." : "Publicar respuesta"}
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
      </main>
      <Footer />
    </>
  );
}
