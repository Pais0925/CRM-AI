"use client";
import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const C = {
  primary: "#416562",
  primaryContainer: "#bae1dd",
  primaryFixed: "#c3eae6",
  surface: "#fff",
  bg: "#f9f9f8",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onSurface: "#1a1c1c",
  onSurfaceVariant: "#414847",
  border: "#c0c8c6",
  outline: "#717977",
};

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      router.push("/");
    } catch (err: any) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: `linear-gradient(160deg, ${C.primary} 0%, #284d4a 100%)`,
      fontFamily: "Lexend, sans-serif", padding: 20, position: "relative", overflow: "hidden"
    }}>
      {/* Background decorations */}
      <div style={{ position: "absolute", top: -100, right: -100, width: 400, height: 400, borderRadius: "50%", background: "rgba(255,255,255,0.03)" }} />
      <div style={{ position: "absolute", bottom: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: "rgba(255,255,255,0.02)" }} />

      <div style={{
        width: "100%", maxWidth: 480, background: "#fff", borderRadius: 24,
        padding: "48px", boxShadow: "0 20px 60px rgba(0,0,0,0.15)", position: "relative", zIndex: 1
      }}>
        {/* Branding */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 16, marginBottom: 40 }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(65, 101, 98, 0.1)" }}>
            <span className="material-symbols-outlined fill" style={{ color: C.primary, fontSize: 32 }}>smart_toy</span>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: C.primary, lineHeight: 1.1 }}>Agent Core</div>
            <div style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 4, fontWeight: 500 }}>Enterprise AI Platform</div>
          </div>
        </div>

        <h2 style={{ fontSize: 28, fontWeight: 600, color: C.onSurface, margin: "0 0 8px", textAlign: "center" }}>Sign in</h2>
        <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: "0 0 32px", textAlign: "center" }}>
          Enter your credentials to access your workspace.
        </p>

        {error && (
          <div style={{
            padding: "12px 16px", background: C.errorContainer, border: `1px solid rgba(186,26,26,0.2)`,
            borderRadius: 8, marginBottom: 24, display: "flex", alignItems: "center", gap: 8,
            color: C.error, fontSize: 14,
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>error</span>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 6, letterSpacing: "0.04em" }}>
              EMAIL ADDRESS
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              placeholder="admin@hermes.ai"
              style={{
                width: "100%", padding: "14px",
                border: `1.5px solid ${C.border}`, borderRadius: 10,
                fontSize: 14, fontFamily: "Lexend, sans-serif",
                color: C.onSurface, outline: "none",
                boxSizing: "border-box"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 6, letterSpacing: "0.04em" }}>
              PASSWORD
            </label>
            <div style={{ position: "relative" }}>
              <input
                type={showPass ? "text" : "password"}
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                style={{
                  width: "100%", padding: "14px 44px 14px 14px",
                  border: `1.5px solid ${C.border}`, borderRadius: 10,
                  fontSize: 14, fontFamily: "Lexend, sans-serif",
                  color: C.onSurface, outline: "none",
                  boxSizing: "border-box"
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.outline, padding: 0 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{showPass ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: "14px",
              background: loading ? "#a7ceca" : C.primary,
              color: "#fff",
              border: "none",
              borderRadius: 10,
              fontSize: 15,
              fontWeight: 700,
              fontFamily: "Lexend, sans-serif",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
              marginTop: 10,
              boxShadow: "0 8px 20px rgba(65, 101, 98, 0.2)"
            }}
          >
            {loading
              ? <><span className="material-symbols-outlined" style={{ fontSize: 20, animation: "spin 1s linear infinite" }}>progress_activity</span> Signing in...</>
              : <><span className="material-symbols-outlined" style={{ fontSize: 20 }}>login</span> Sign In</>
            }
          </button>
        </form>

        <p style={{ marginTop: 28, fontSize: 13, color: C.onSurfaceVariant, textAlign: "center" }}>
          Don't have an account?{" "}
          <a href="#" style={{ color: C.primary, fontWeight: 700, textDecoration: "none" }}>Contact Support</a>
        </p>

        {/* Role reference */}
        <div style={{ marginTop: 40, padding: "20px", background: C.bg, borderRadius: 16, border: `1px solid ${C.border}` }}>
          <div style={{ fontSize: 11, fontWeight: 800, color: C.primary, marginBottom: 12, letterSpacing: "0.1em", textAlign: "center" }}>ROLE PERMISSIONS ACCESS</div>
          {[
            { role: "SUPER_ADMIN", desc: "Full power + users" },
            { role: "ADMIN", desc: "Full features - billing" },
            { role: "OPERATOR", desc: "Inbox + integrations" },
          ].map(r => (
            <div key={r.role} style={{ display: "flex", justifyContent: "space-between", marginBottom: 8, fontSize: 11 }}>
              <span style={{ fontWeight: 700, color: C.onSurface }}>{r.role}</span>
              <span style={{ color: C.onSurfaceVariant }}>{r.desc}</span>
            </div>
          ))}
        </div>
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
