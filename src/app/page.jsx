"use client";
import { useState, useEffect } from "react";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { getAllQuestions } from "@/infrastructure/questionService";
import { isLoggedIn } from "@/infrastructure/authService";
import { useRouter } from "next/navigation";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    if (!isLoggedIn()) {
      router.push("/login");
      return;
    }

    // Fetch questions
    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const data = await getAllQuestions();
        setQuestions(data);
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

    fetchQuestions();
  }, [router]);

  return (
    <>
      <NavBar />
      <main className="flex-1 space-y-6 mt-5 w-4/5 mx-auto">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : questions.length === 0 ? (
          <div className="text-center py-10">
            <h3 className="text-xl font-medium text-gray-600">No hay preguntas disponibles</h3>
            <p className="mt-2 text-gray-500">¡Sé el primero en publicar una pregunta!</p>
          </div>
        ) : (
          questions.map((question) => (
            <PostCard key={question.question_id} question={question} />
          ))
        )}
      </main>
      <Footer />
    </>
  );
}
