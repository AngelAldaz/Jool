"use client";
import { useState, useEffect } from "react";
import { isLoggedIn, logout, getCurrentUser } from "@/services/authService";
import { useRouter } from "next/navigation";
import Avatar from "../ui/Avatar";

export default function UserButton() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Check login status when component mounts
    const loginStatus = isLoggedIn();
    setLoggedIn(loginStatus);
    
    if (loginStatus) {
      // Cargar datos del usuario
      const userInfo = getCurrentUser();
      setUserData(userInfo);
    }
  }, []);

  const handleLogout = () => {
    logout();
    setLoggedIn(false);
    setUserData(null);
    router.push("/login");
  };

  if (loggedIn) {
    return (
      <div className="relative group">
        <button className="py-1 px-3 rounded-full bg-primary hover:cursor-pointer block">
          {userData ? (
            <Avatar user={userData} size="md" />
          ) : (
            <svg
              viewBox="0 0 24 24"
              className="md:w-14 md:h-14 w-10 h-10 fill-white mx-auto"
            >
              <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
            </svg>
          )}
        </button>
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
          <a
            href="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Perfil
          </a>
          <button
            onClick={handleLogout}
            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );
  }

  return (
    <a
      className="py-1 px-3 rounded-full bg-primary hover:cursor-pointer block"
      href="/login"
    >
      <svg
        viewBox="0 0 24 24"
        className="md:w-14 md:h-14 w-10 h-10 fill-white mx-auto"
      >
        <path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
      </svg>
    </a>
  );
}
