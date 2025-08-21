"use client";

import { createContext } from "react";

type User = {
  id: string;
  email: string;
  name: string;
};

type AuthContextType = {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthContext.Provider
      value={{
        user: {
          id: "1",
          email: "test@example.com",
          name: "Test User",
        },
        login: () => {},
        logout: () => {},
        isAuthenticated: true,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
