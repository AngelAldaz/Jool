"use client";
import { useEffect, useState } from "react";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import MicrosoftLoginButton from "@/components/auth/MicrosoftLoginButton";
import { authService } from "@/services/authService";
import { motion } from "framer-motion";

export default function LogIn() {
  const router = useRouter();
  const [error, setError] = useState("");

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (authService.isAuthenticated()) {
      router.push("/");
    }
  }, [router]);

  // Procesar hash de autenticación y manejar errores
  useEffect(() => {
    try {
      const userData = authService.processAuthHash();
      if (userData) {
        router.push("/");
      }
    } catch (error) {
      setError(error.message || "Error de autenticación");
    }
  }, [router]);

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.2
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 w-full max-w-md mx-auto py-12 px-4">
        <motion.div 
          className="w-full space-y-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div variants={itemVariants} className="text-center">
            <motion.a 
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img 
                src="/JOOL.svg" 
                alt="Jool Logo" 
                className="h-40 mx-auto drop-shadow-lg" 
              />
            </motion.a>
            <motion.h2 
              className="mt-6 text-3xl font-bold bg-gradient-to-r from-primary to-[#384a64] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              ¡Bienvenido a JOOL!
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-gray-600"
              variants={itemVariants}
            >
              Plataforma exclusiva para estudiantes del Tecnológico de Mérida
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            variants={itemVariants}
          >
            {error && (
              <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-start">
                <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-5a1 1 0 10-2 0v5z" clipRule="evenodd" />
                </svg>
                <p className="text-sm">{error}</p>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">¡Inicia sesión con tu cuenta del Tec!</h3>
              <p className="text-sm text-gray-600 mt-1">Usa tu correo institucional (@merida.tecnm.mx)</p>
            </div>
            
            <motion.div variants={itemVariants}>
              <MicrosoftLoginButton />
            </motion.div>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
