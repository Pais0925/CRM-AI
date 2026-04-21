"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

const API = "http://localhost:5000";

export type Role = "SUPER_ADMIN" | "ADMIN" | "OPERATOR" | "VIEWER";

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  role: Role;
}

interface AuthCtx {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  can: (allowedRoles: Role[]) => boolean;
}

const AuthContext = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount, restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("hermes_token");
    if (stored) {
      setToken(stored);
      fetch(`${API}/api/auth/me`, {
        headers: { Authorization: `Bearer ${stored}` },
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) setUser(data.user);
          else logout();
        })
        .catch(() => logout())
        .finally(() => setIsLoading(false));
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await fetch(`${API}/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Login failed");
    localStorage.setItem("hermes_token", data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("hermes_token");
    setToken(null);
    setUser(null);
  }, []);

  const can = useCallback(
    (allowedRoles: Role[]) => !!user && allowedRoles.includes(user.role),
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout, can }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
