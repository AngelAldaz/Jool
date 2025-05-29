"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { registerUser } from "@/services/authService";
import { motion } from "framer-motion";

export default function SignUp() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    agreeTerms: false,
  });

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    
    // Reset error when user types
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (!formData.agreeTerms) {
      setError("Debes aceptar los términos y condiciones");
      return;
    }

    // Validar longitud del correo electrónico
    if (formData.email.length > 30) {
      setError("El correo electrónico no puede exceder los 30 caracteres");
      return;
    }

    try {
      setLoading(true);
      
      // Preparar datos para el backend según la estructura esperada
      const userData = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        password: formData.password,
        phone: formData.phone || null  // opcional
      };
      
      console.log("Sending registration data:", userData);
      
      // Enviar solicitud de registro
      const response = await registerUser(userData);
      console.log("Registration successful:", response);
      
      // Redireccionar al login
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration failed:", error);
      
      // Extraer y mostrar mensajes de error específicos de la API
      try {
        // Ver si el mensaje de error contiene un objeto JSON
        const errorStr = error.message;
        if (errorStr.includes('{') && errorStr.includes('}')) {
          const errorJson = JSON.parse(errorStr);
          
          // Si hay errores específicos de campo
          if (errorJson.errors) {
            const errorMessages = [];
            
            // Recopilar todos los mensajes de error
            Object.entries(errorJson.errors).forEach(([field, messages]) => {
              if (Array.isArray(messages)) {
                // Usar solo el mensaje en español si está disponible (segundo mensaje)
                const message = messages.length > 1 ? messages[1] : messages[0];
                errorMessages.push(message);
              }
            });
            
            if (errorMessages.length > 0) {
              setError(errorMessages.join('. '));
              setLoading(false);
              return;
            }
          }
        }
      } catch (parseError) {
        // Si hay un error al parsear, simplemente continuar con el mensaje de error genérico
        console.error("Error parsing API error message:", parseError);
      }
      
      // Mensaje de error genérico si no pudimos extraer uno específico
      setError(error.message || "Error al crear la cuenta. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // Variantes para animaciones
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { 
        staggerChildren: 0.07,
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

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <main className="flex-1 w-full max-w-lg mx-auto py-8 px-4">
        <motion.div 
          className="w-full space-y-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.div className="text-center" variants={itemVariants}>
            <motion.a 
              href="/"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <img src="/JOOL.svg" alt="Logo de Jool" className="h-32 mx-auto drop-shadow-lg" />
            </motion.a>
            <motion.h1 
              className="mt-4 text-3xl font-bold bg-gradient-to-r from-primary to-[#384a64] bg-clip-text text-transparent"
              variants={itemVariants}
            >
              Crea tu cuenta
            </motion.h1>
            <motion.p 
              className="mt-2 text-sm text-gray-600"
              variants={itemVariants}
            >
              Únete a la comunidad de JOOL
            </motion.p>
          </motion.div>

          <motion.div 
            className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100"
            variants={itemVariants}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Mensaje de error */}
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
                  <p>{error}</p>
                </motion.div>
              )}
              
              {/* Nombre y Apellido */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="first_name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Nombre
                  </label>
                  <input
                    id="first_name"
                    name="first_name"
                    type="text"
                    required
                    value={formData.first_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                    placeholder="Juan"
                  />
                </motion.div>
                <motion.div variants={itemVariants}>
                  <label
                    htmlFor="last_name"
                    className="block text-sm font-bold text-gray-700 mb-2"
                  >
                    Apellido
                  </label>
                  <input
                    id="last_name"
                    name="last_name"
                    type="text"
                    required
                    value={formData.last_name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                    placeholder="Pérez"
                  />
                </motion.div>
              </div>

              {/* Email */}
              <motion.div variants={itemVariants}>
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
                  maxLength={30}
                />
              </motion.div>

              {/* Teléfono */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="phone"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Teléfono (opcional)
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                  placeholder="+52 1234567890"
                />
              </motion.div>

              {/* Contraseña */}
              <motion.div variants={itemVariants}>
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
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={togglePassword}
                    tabIndex="-1"
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
                <p className="text-xs text-gray-500 mt-1">
                  Mínimo 8 caracteres
                </p>
              </motion.div>

              {/* Confirmar Contraseña */}
              <motion.div variants={itemVariants}>
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-bold text-gray-700 mb-2"
                >
                  Confirmar Contraseña
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 outline-none text-base shadow-sm"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPassword}
                    tabIndex="-1"
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? (
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
              </motion.div>

              {/* Términos y condiciones */}
              <motion.div variants={itemVariants} className="flex items-start mt-4">
                <div className="flex items-center h-5">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-primary focus:ring-primary/80 border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3 text-sm">
                  <label htmlFor="agreeTerms" className="font-medium text-gray-700">
                    Acepto los{" "}
                    <a href="#" className="text-primary hover:text-[#1e2a3d] font-semibold">
                      términos y condiciones
                    </a>
                  </label>
                </div>
              </motion.div>

              {/* Botón de registro */}
              <motion.div variants={itemVariants} className="pt-2">
                <motion.button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-bold rounded-xl text-white bg-gradient-to-r from-primary to-[#384a64] hover:from-[#1e2a3d] hover:to-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-200 disabled:opacity-70 shadow-md"
                  whileHover={{ translateY: -2, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                  whileTap={{ scale: 0.98 }}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Registrando...
                    </span>
                  ) : "Crear cuenta"}
                </motion.button>
              </motion.div>
            </form>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-6">
            <p className="text-sm text-gray-600">
              ¿Ya tienes cuenta?{" "}
              <motion.a
                href="/login"
                className="font-semibold text-primary hover:text-[#1e2a3d] transition-colors"
                whileHover={{ textDecoration: "underline" }}
              >
                Inicia sesión
              </motion.a>
            </p>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
