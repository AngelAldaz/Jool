"use client";
import { useState } from "react";
import Footer from "@/components/Footer";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
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
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validación básica
    if (formData.password !== formData.confirmPassword) {
      alert("Las contraseñas no coinciden");
      return;
    }

    if (!formData.agreeTerms) {
      alert("Debes aceptar los términos y condiciones");
      return;
    }

    console.log("Signup attempt:", formData);
    // Aquí irían las validaciones y el envío del formulario
    alert("¡Cuenta creada exitosamente! Bienvenido a JOOL!");
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
                {/* Nombre y Apellido */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="firstName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Nombre
                    </label>
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-4 border-2 border-gray-200 rounded-2xl bg-gray-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 outline-none text-base"
                      placeholder="Juan"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                      Apellido
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      required
                      value={formData.lastName}
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
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Crear cuenta
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

              {/* Login Link */}
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
