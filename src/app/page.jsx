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
import Link from "next/link";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("Nuevo");
  const [searchQuery, setSearchQuery] = useState("");
  const [animateIn, setAnimateIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Fetch questions
    fetchQuestions();

    // Activar animación después de un breve retraso
    const timer = setTimeout(() => {
      setAnimateIn(true);
    }, 100);

    return () => clearTimeout(timer);
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
      // Si el token es inválido, redireccionar a login
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
        <div className="py-10 flex flex-col items-center min-h-[60vh] justify-center">
          <LoadingSpinner text="Cargando preguntas..." />
          <div className="w-48 h-1 mt-4 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary to-[#384a64] animate-pulse rounded-full"></div>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="py-8 px-6 bg-red-50 rounded-2xl border border-red-200 shadow-inner min-h-[60vh] flex items-center justify-center">
          <StatusMessage message={error} type="error" />
        </div>
      );
    }

    if (filteredQuestions.length === 0) {
      return (
        <div className="text-center py-16 bg-gradient-to-b from-white to-gray-100 rounded-3xl shadow-inner min-h-[60vh] flex flex-col items-center justify-center">
          <h3 className="text-xl font-medium text-gray-600 mb-3">
            {searchQuery ? "No se encontraron resultados para tu búsqueda" : "No hay preguntas disponibles"}
          </h3>
          <p className="mt-2 text-gray-500 mb-6">
            {searchQuery
              ? "Intenta con otra búsqueda o filtro"
              : "¡Sé el primero en publicar una pregunta!"
            }
          </p>

          {!searchQuery && (
            <Link href="/new-question">
              <button className="bg-gradient-to-r from-primary to-[#384a64] text-white px-6 py-3 rounded-full hover:shadow-lg transition-all duration-300 hover:from-[#1e2a3d] hover:to-primary transform hover:scale-105 font-bold">
                Crear mi primera pregunta
              </button>
            </Link>
          )}
        </div>
      );
    }

    return (
      <div className={`space-y-6 transition-all duration-500 ease-out ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        {filteredQuestions.map((question, index) => (
          <div
            key={question.question_id}
            className="transition-all duration-500"
            style={{
              transitionDelay: `${index * 100}ms`,
              transform: animateIn ? 'translateY(0)' : 'translateY(20px)',
              opacity: animateIn ? 1 : 0
            }}
          >
            <PostCard question={question} />
          </div>
        ))}
      </div>
    );
  };

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <NavBar onFilterChange={handleFilterChange} onSearch={handleSearch} />
        <main className="flex-1 space-y-6 mt-5 w-[90%] md:w-[85%] max-w-[500px] md:max-w-[800px] mx-auto pb-16">
          {renderContent()}
        </main>
        <Footer />
      </div>
    </AuthGuard>
  );
}
