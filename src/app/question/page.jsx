"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import QuestionHeading from "@/components/question/QuestionHeading";
import ReturnButton from "@/components/layout/ReturnButton";
import StickyInteractions from "@/components/question/StickyInteractions";
import ReactMarkdown from "react-markdown";
import Answer from "@/components/question/Answer";
import MDEditor from "@uiw/react-md-editor";
import { getUserId } from "@/utils/userUtils";
import { getQuestionById, createResponse, deleteResponse } from "@/services/questionService";
import { isLoggedIn, getCurrentUser } from "@/services/authService";
import { motion } from "framer-motion";

// Componente que usa useSearchParams envuelto para Suspense
function QuestionDetailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const questionId = searchParams.get("id");
  const isMounted = useRef(false);
  const dataFetchedRef = useRef(false);
  
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

  // Función para obtener los detalles de la pregunta
  const fetchQuestionDetails = async (forceRefresh = false) => {
    // Evitar doble ejecución en el montado inicial
    if (!forceRefresh && dataFetchedRef.current) {
      console.log('Evitando fetch duplicado');
      return;
    }
    
    console.log(`Ejecutando fetchQuestionDetails - ${new Date().toISOString()}`);
    
    try {
      setLoading(true);
      const data = await getQuestionById(questionId);
      console.log("Pregunta cargada:", data);
      setQuestion(data);
      dataFetchedRef.current = true;
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

    if (!isMounted.current) {
      // Primera vez que se monta
      isMounted.current = true;
      fetchQuestionDetails();
    } else if (dataFetchedRef.current) {
      // Si cambia el questionId después de ya haber cargado datos
      dataFetchedRef.current = false;
      fetchQuestionDetails();
    }
    
    // Cleanup function
    return () => {
      // Si el componente se desmonta, resetear el estado de fetch para futuros montajes
      if (!isMounted.current) {
        dataFetchedRef.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId]);

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
      // Aquí usamos forceRefresh=true para asegurar que se obtienen los datos actualizados
      await fetchQuestionDetails(true);
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
      // Usar forceRefresh=true para asegurar que se obtienen los datos actualizados
      await fetchQuestionDetails(true);
      return true;
    } catch (error) {
      console.error("Error al eliminar respuesta:", error);
      return false;
    } finally {
      setDeletingResponse(false);
    }
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  };

  // Mostrar un mensaje de carga mientras se obtiene la pregunta
  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto">
          <ReturnButton />
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 w-6 h-6 left-0 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-0 w-6 h-6 right-0 bg-[#384a64] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="absolute bottom-0 w-6 h-6 right-0 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <div className="absolute bottom-0 w-6 h-6 left-0 bg-[#384a64] rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Cargando pregunta...</p>
            <div className="w-48 h-1 mt-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-[#384a64] animate-pulse rounded-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Mostrar un mensaje de error si ocurrió algún problema
  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto">
          <ReturnButton />
          <motion.div 
            className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg shadow-md flex items-center min-h-[200px] justify-center"
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
          >
            <svg className="w-8 h-8 mr-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-lg font-bold text-red-800 mb-1">Error al cargar la pregunta</h3>
              <p>{error}</p>
              <button 
                onClick={() => fetchQuestionDetails(true)}
                className="mt-4 px-4 py-2 bg-white text-red-600 rounded-lg border border-red-300 hover:bg-red-50 transition-colors shadow-sm"
              >
                Intentar nuevamente
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  // Si no hay pregunta, no mostrar nada
  if (!question) {
    return (
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto">
          <ReturnButton />
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <p className="text-gray-600">No se encontró la pregunta solicitada.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto pb-16">
        <ReturnButton />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-6"
        >
          {/* Contenedor principal de la pregunta */}
          <motion.section
            variants={itemVariants}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-lg"
          >
            {/* Encabezado con título, autor y fecha */}
            <QuestionHeading
              question={question}
              formatDate={formatDate}
            />

            {/* Contenido de la pregunta */}
            <div className="mt-6 text-gray-700 overflow-hidden break-words prose prose-sm sm:prose">
              <ReactMarkdown>{question.content}</ReactMarkdown>
            </div>

            {/* Hashtags */}
            {question.hashtags && question.hashtags.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {question.hashtags.map((tag) => (
                  <span
                    key={typeof tag === 'object' ? tag.hashtag_id : tag}
                    className="text-primary text-sm bg-blue-50 px-3 py-1 rounded-full"
                  >
                    #{typeof tag === 'object' ? tag.name : tag}
                  </span>
                ))}
              </div>
            )}

            {/* Botones de interacción */}
            <StickyInteractions question={question} />
          </motion.section>

          {/* Sección de respuestas */}
          <motion.section
            variants={itemVariants}
            className="bg-white p-6 md:p-8 rounded-3xl shadow-lg"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-2">
              {question.responses && question.responses.length > 0
                ? `${question.responses.length} Respuesta${
                    question.responses.length !== 1 ? "s" : ""
                  }`
                : "No hay respuestas aún"}
            </h2>

            {/* Lista de respuestas */}
            <div className="space-y-6">
              {question.responses &&
                question.responses.map((response) => (
                  <Answer
                    key={response.response_id}
                    response={response}
                    onDelete={handleDeleteResponse}
                    isDeleting={deletingResponse}
                  />
                ))}
            </div>

            {/* Formulario para agregar respuesta */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Tu respuesta
              </h3>

              <form onSubmit={handleSubmitResponse}>
                <div data-color-mode="light" className="mb-4">
                  <MDEditor
                    value={newResponse}
                    onChange={setNewResponse}
                    height={200}
                  />
                </div>

                {submitMessage && (
                  <div
                    className={`mb-4 p-3 rounded-lg ${
                      submitMessage.includes("Error")
                        ? "bg-red-50 text-red-700"
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    {submitMessage}
                  </div>
                )}

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting || !newResponse.trim()}
                    className="bg-gradient-to-r from-primary to-[#384a64] text-white px-6 py-2 rounded-xl hover:from-[#1e2a3d] hover:to-primary transition-all duration-300 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Enviando..." : "Publicar respuesta"}
                  </button>
                </div>
              </form>
            </div>
          </motion.section>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}

// Componente principal con Suspense
export default function QuestionDetail() {
  return (
    <Suspense fallback={
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto">
          <ReturnButton />
          <div className="flex flex-col justify-center items-center min-h-[60vh]">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 w-6 h-6 left-0 bg-primary rounded-full animate-pulse"></div>
              <div className="absolute top-0 w-6 h-6 right-0 bg-[#384a64] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="absolute bottom-0 w-6 h-6 right-0 bg-primary rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
              <div className="absolute bottom-0 w-6 h-6 left-0 bg-[#384a64] rounded-full animate-pulse" style={{ animationDelay: "0.6s" }}></div>
            </div>
            <p className="mt-4 text-gray-600 font-medium">Cargando pregunta...</p>
            <div className="w-48 h-1 mt-6 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-[#384a64] animate-pulse rounded-full"></div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    }>
      <QuestionDetailContent />
    </Suspense>
  );
}
