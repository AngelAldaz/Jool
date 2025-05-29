"use client";

import { useState, useEffect, useRef } from "react";
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

export default function QuestionDetail() {
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto pb-16">
        <ReturnButton />
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-8"
        >
          {/* Cabecera de la pregunta */}
          <motion.div variants={itemVariants}>
            <QuestionHeading 
              question={question} 
              formatDate={formatDate}
            />
          </motion.div>
          
          {/* Contenido de la pregunta */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <div className="prose max-w-none prose-img:rounded-xl break-words overflow-hidden">
              <ReactMarkdown>{question?.content || ""}</ReactMarkdown>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <StickyInteractions question={question} />
            </div>
          </motion.div>
          
          {/* Respuestas a la pregunta */}
          <motion.div variants={itemVariants} className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center">
              <span className="bg-gradient-to-r from-primary to-[#384a64] bg-clip-text text-transparent">
                Respuestas 
              </span>
              <span className="ml-2 px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
                {question?.responses?.length || 0}
              </span>
            </h2>
            
            {question?.responses && question.responses.length > 0 ? (
              <div className="space-y-6">
                {question.responses.map((response, index) => (
                  <motion.div 
                    key={response.response_id} 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                  >
                    <Answer 
                      response={response} 
                      formatDate={formatDate}
                      onDelete={handleDeleteResponse}
                      isDeleting={deletingResponse}
                    />
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div 
                className="bg-gray-50 p-8 rounded-xl border border-gray-200 text-center text-gray-500"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                  </svg>
                </div>
                <p className="font-medium">Aún no hay respuestas</p>
                <p className="mt-2">Sé el primero en responder a esta pregunta</p>
              </motion.div>
            )}
          </motion.div>
          
          {/* Formulario para enviar una nueva respuesta */}
          <motion.div 
            variants={itemVariants}
            className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100"
          >
            <h3 className="text-xl font-bold text-gray-800 mb-4">Tu respuesta</h3>
            
            <form onSubmit={handleSubmitResponse}>
              <div className="mb-4">
                <MDEditor
                  value={newResponse}
                  onChange={setNewResponse}
                  preview="edit"
                  height={200}
                  className="shadow-sm rounded-xl overflow-hidden"
                />
              </div>
              
              {submitMessage && (
                <motion.div 
                  className={`p-3 rounded-lg mb-4 ${
                    submitMessage.includes("Error") 
                      ? "bg-red-50 text-red-700 border border-red-200" 
                      : "bg-green-50 text-green-700 border border-green-200"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {submitMessage}
                </motion.div>
              )}
              
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto px-6 py-3 bg-gradient-to-r from-primary to-[#384a64] text-white font-bold rounded-xl shadow-md hover:from-[#1e2a3d] hover:to-primary transition-all duration-300 disabled:opacity-70 flex items-center justify-center"
                whileHover={{ translateY: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Enviando respuesta...
                  </span>
                ) : (
                  "Publicar respuesta"
                )}
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
