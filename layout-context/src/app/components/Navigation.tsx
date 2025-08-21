"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { useContext } from "react";

export function Navigation() {
  const auth = useContext(AuthContext);

  return (
    <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center">
          <a href="/questions" className="text-xl font-bold text-gray-900">
            Questions App
          </a>
        </div>
        <div className="flex items-center space-x-4">
          {auth?.isAuthenticated ? (
            <>
              <span className="text-gray-700">Welcome, {auth?.user?.name}</span>
              <button
                onClick={auth.logout}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                Logout
              </button>
            </>
          ) : (
            <a
              href="/user/login"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}
