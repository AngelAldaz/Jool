"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Footer from "@/components/Footer";
import { registerUser } from "@/infrastructure/authService";

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

  return (
    <>
      <main className="flex-1 space-y-6 w-4/5 mx-auto align-center">
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-2">
            <a href="/">
              <img src="/JOOL.svg" alt="Jool Logo" className="h-40 mx-auto" />
            </a>
            <div className="space-y-6">
              <div className="space-y-4">
                {/* Mensaje de error */}
                {error && (
                  <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                    <p>{error}</p>
                  </div>
                )}
                
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="first_name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
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
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="last_name"
                      className="block text-sm font-semibold text-gray-700 mb-2"
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
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                      placeholder="Pérez"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                    placeholder="tu@ejemplo.com"
                    maxLength={30}
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Máximo 30 caracteres ({30 - formData.email.length} restantes)
                  </p>
                </div>

                {/* Teléfono (opcional) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Teléfono (opcional)
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                    placeholder="(999) 123-4567"
                  />
                </div>

                {/* Contraseña */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-gray-700 mb-2"
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
                      className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={togglePassword}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      {showPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-semibold text-gray-700 mb-2"
                  >
                    Confirmar contraseña
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 pr-12 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                      placeholder="••••••••"
                    />
                    <button
                      type="button"
                      onClick={toggleConfirmPassword}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-500 transition-colors"
                    >
                      {showConfirmPassword ? "🙈" : "👁️"}
                    </button>
                  </div>
                  {formData.password &&
                    formData.confirmPassword &&
                    formData.password !== formData.confirmPassword && (
                      <p className="mt-1 text-sm text-red-500">
                        Las contraseñas no coinciden
                      </p>
                    )}
                </div>

                {/* Términos y Condiciones */}
                <div className="flex items-start">
                  <input
                    id="agreeTerms"
                    name="agreeTerms"
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded accent-blue-500 mt-1"
                  />
                  <label
                    htmlFor="agreeTerms"
                    className="ml-3 block text-sm text-gray-700"
                  >
                    Acepto los{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      términos y condiciones
                    </a>{" "}
                    y la{" "}
                    <a
                      href="#"
                      className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                    >
                      política de privacidad
                    </a>
                  </label>
                </div>
              </div>

              {/* Signup Button */}
              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? "Creando cuenta..." : "Crear cuenta"}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    o regístrate con
                  </span>
                </div>
              </div>

              {/* Microsoft Login */}
              <div className="">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <span>👨‍💻</span>
                  Microsoft
                </button>
              </div>

              <div className="">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <span>🧑‍🎓</span>
                  Google
                </button>
              </div>

              {/* Enlace para iniciar sesión */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <a
                    href="/login"
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Inicia sesión
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
