"use client";
import { useState, useEffect } from "react";
import Footer from "@/components/layout/Footer";
import { useRouter } from "next/navigation";
import { loginUser } from "@/services/authService";
import MicrosoftLoginButton from "@/components/auth/MicrosoftLoginButton";
import { authService } from "@/services/authService";
import { motion } from "framer-motion";

export default function LogIn() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Verificar si el usuario ya está autenticado
  useEffect(() => {
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (authService.isAuthenticated()) {
      console.log("Usuario ya autenticado, redirigiendo a página principal");
      router.push("/");
    }
  }, [router]);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    try {
      await loginUser(formData.email, formData.password);
      // Redirect to home page on successful login
      router.push("/");
    } catch (error) {
      setError(error.message || "Error al iniciar sesión. Intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

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
              ¡Bienvenido de nuevo!
            </motion.h2>
            <motion.p 
              className="mt-2 text-sm text-gray-600"
              variants={itemVariants}
            >
              Inicia sesión para continuar en JOOL
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            variants={itemVariants}
          >
            {error && (
              <motion.div 
                className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-6 flex items-center"
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                <svg className="w-5 h-5 mr-2 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                {error}
              </motion.div>
            )}
            
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                  placeholder="tu@ejemplo.com"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <motion.button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary to-[#384a64] hover:from-[#1e2a3d] hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 shadow-md"
                  whileHover={{ translateY: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Iniciando sesión...
                    </span>
                  ) : "Iniciar Sesión"}
                </motion.button>
              </div>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-gray-500 rounded-full shadow-sm">
                o continúa con
              </span>
            </div>
          </motion.div>

          <motion.div variants={itemVariants}>
            <MicrosoftLoginButton />
          </motion.div>

          <motion.div variants={itemVariants} className="text-center">
            <p className="text-sm text-gray-600">
              ¿No tienes una cuenta?{" "}
              <motion.a
                href="/register"
                className="font-semibold text-primary hover:text-[#1e2a3d] transition-colors"
                whileHover={{ textDecoration: "underline" }}
              >
                Regístrate
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
