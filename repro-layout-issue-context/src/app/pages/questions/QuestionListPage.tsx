"use client";

import { AuthContext } from "@/app/context/AuthContext";
import { useContext } from "react";

export function QuestionListPage() {
  const auth = useContext(AuthContext);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Questions</h1>

      {auth?.isAuthenticated ? (
        <div>
          <p className="text-gray-600 mb-4">
            Logged in as: {auth?.user?.name} ({auth?.user?.email})
          </p>
        </div>
      ) : (
        <p className="text-gray-600 mb-4">not authenticated</p>
      )}
    </div>
  );
}
