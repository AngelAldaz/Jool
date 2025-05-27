"use client";
import { useState } from "react";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
import { loginUser } from "@/infrastructure/authService";

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

  return (
    <>
      <main className="flex-1 space-y-6 w-4/5 mx-auto align-center">
        <div className="flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-8 ">
          <div className="max-w-md w-full space-y-2">
            <a href="/">
              <img src="/JOOL.svg" alt="Jool Logo" className="h-40 mx-auto" />
            </a>
            {/* <div className="text-center"> */}
            {/* <h2 className="mt-6 text-3xl font-bold text-gray-900">
                Bienvenid@!
              </h2>
              <p className="mt-2 text-sm text-gray-600">
                Inicia sesión en tu cuenta
              </p> */}
            {/* </div> */}

            <div className=" space-y-6">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                  {error}
                </div>
              )}
              
              <div className="space-y-4">
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
              </div>

              {/* <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="h-4 w-4 text-blue-500 focus:ring-blue-400 border-gray-300 rounded accent-blue-500"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 block text-sm text-gray-700 font-medium"
                  >
                    Recordarme
                  </label>
                </div>
                <div className="text-sm">
                  <a
                    href="#"
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
              </div> */}

              {/* Login Button */}
              <div>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="group relative w-full flex justify-center py-4 px-4 border border-transparent text-base font-semibold rounded-2xl text-white bg-gradient-to-r from-blue-500 to-teal-500 hover:from-blue-600 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-70"
                >
                  {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
                </button>
              </div>

              {/* Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500">
                    o continúa con
                  </span>
                </div>
              </div>

              <div className="">
                <button
                  type="button"
                  className="w-full inline-flex justify-center items-center gap-2 py-3 px-4 border-2 border-gray-200 rounded-xl bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all duration-200"
                >
                  <span>👨‍💻</span>
                  Microsoft
                </button>
              </div>

              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿No tienes una cuenta?{" "}
                  <a
                    href="/register"
                    className="font-semibold text-blue-500 hover:text-blue-600 transition-colors"
                  >
                    Regístrate
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
