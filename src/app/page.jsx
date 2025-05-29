"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import PostCard from "@/components/question/PostCard";
import { getAllQuestions } from "@/services/questionService";
import { useRouter } from "next/navigation";
import AuthGuard from "@/components/auth/AuthGuard";
import StatusMessage from "@/components/ui/StatusMessage";
import LoadingSpinner from "@/components/ui/LoadingSpinner";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Nuevo");
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Fetch questions
    fetchQuestions();
  }, []);

  // Efecto para aplicar filtros cuando cambian las preguntas o filtros
  useEffect(() => {
    if (questions.length === 0) return;
    
    applyFiltersAndSearch();
  }, [questions, activeFilter, searchQuery]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const data = await getAllQuestions();
      console.log("Preguntas recibidas:", data);
      setQuestions(data);
      setFilteredQuestions(data);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setError(error.message || "Error al cargar las preguntas");
      // If token is invalid, redirect to login
      if (error.message.includes("Authentication") || error.message.includes("401")) {
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter) => {
    console.log("Filtro aplicado:", filter);
    setActiveFilter(filter);
  };

  const handleSearch = (query) => {
    console.log("Búsqueda:", query);
    setSearchQuery(query);
  };

  const applyFiltersAndSearch = () => {
    let result = [...questions];
    
    // Aplicar filtro
    if (activeFilter === "Nuevo") {
      // Ordenar por fecha (más reciente primero)
      result = result.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (activeFilter === "Sin responder") {
      // Filtrar preguntas sin respuestas
      result = result.filter(q => !q.responses || q.responses.length === 0);
    } else if (activeFilter === "Popular") {
      // Ordenar por número de vistas (mayor a menor)
      result = result.sort((a, b) => b.views - a.views);
    }
    
    // Aplicar búsqueda si hay una
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(q => 
        q.title.toLowerCase().includes(query) || 
        q.content.toLowerCase().includes(query) || 
        (q.hashtags && q.hashtags.some(h => {
          const tagName = typeof h === 'object' ? h.name : h;
          return tagName.toLowerCase().includes(query);
        }))
      );
    }
    
    setFilteredQuestions(result);
  };

  // Contenido a mostrar según el estado
  const renderContent = () => {
    if (loading) {
      return (
        <div className="py-10">
          <LoadingSpinner text="Cargando preguntas..." />
        </div>
      );
    }
    
    if (error) {
      return <StatusMessage message={error} type="error" />;
    }
    
    if (filteredQuestions.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-medium text-gray-600">
            {searchQuery ? "No se encontraron resultados para tu búsqueda" : "No hay preguntas disponibles"}
          </h3>
          <p className="mt-2 text-gray-500">
            {searchQuery 
              ? "Intenta con otra búsqueda o filtro" 
              : "¡Sé el primero en publicar una pregunta!"
            }
          </p>
        </div>
      );
    }
    
    return filteredQuestions.map((question) => (
      <PostCard key={question.question_id} question={question} />
    ));
  };

  return (
    <AuthGuard>
      <NavBar onFilterChange={handleFilterChange} onSearch={handleSearch} />
      <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        {renderContent()}
      </main>
      <Footer />
    </AuthGuard>
  );
}
