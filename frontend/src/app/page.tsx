"use client";
import React, { useState, useEffect, useRef } from "react";
import { useAuth, Role } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

const API = "http://localhost:5000";

/* ─── Design Tokens (matching mockup exactly) ─────────────────────────────── */
const C = {
  bg: "#f9f9f8",
  surface: "#fff",
  surfaceLow: "#f4f4f2",
  surfaceContainer: "#eeeeed",
  surfaceVariant: "#e2e2e1",
  border: "#c0c8c6",
  onBg: "#1a1c1c",
  onSurface: "#1a1c1c",
  onSurfaceVariant: "#414847",
  outline: "#717977",
  primary: "#416562",
  onPrimary: "#fff",
  primaryContainer: "#bae1dd",
  onPrimaryContainer: "#416562",
  primaryFixed: "#c3eae6",
  inversePrimary: "#a7ceca",
  secondary: "#65587a",
  secondaryContainer: "#e7d6fe",
  onSecondaryContainer: "#685b7d",
  secondaryFixed: "#ecdcff",
  secondaryFixedDim: "#d0c0e7",
  tertiary: "#715950",
  tertiaryContainer: "#f2d3c7",
  onTertiaryContainer: "#715a50",
  tertiaryFixed: "#fcdcd0",
  onSecondary: "#fff",
  onTertiary: "#fff",
  error: "#ba1a1a",
  errorContainer: "#ffdad6",
  onErrorContainer: "#93000a",
};

/* ─── Sidebar ─────────────────────────────────────────────────────────────── */
const NAV = [
  { id: "inbox", label: "Inbox", icon: "all_inbox", roles: ["SUPER_ADMIN","ADMIN","OPERATOR"] as Role[] },
  { id: "performance", label: "AI Performance", icon: "insights", roles: ["SUPER_ADMIN","ADMIN","VIEWER"] as Role[] },
  { id: "integrations", label: "Integration Hub", icon: "hub", roles: ["SUPER_ADMIN","ADMIN","OPERATOR"] as Role[] },
  { id: "knowledge", label: "Knowledge Base", icon: "menu_book", roles: ["SUPER_ADMIN","ADMIN","OPERATOR","VIEWER"] as Role[] },
  { id: "settings", label: "Settings", icon: "settings", roles: ["SUPER_ADMIN","ADMIN"] as Role[] },
];

function Sidebar({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const { user, logout, can } = useAuth();
  return (
    <nav style={{
      width: 220, minWidth: 220,
      background: C.surface,
      borderRight: `1px solid #e8eeec`,
      display: "flex", flexDirection: "column",
      padding: "20px 12px",
      height: "100vh",
      flexShrink: 0,
    }}>
      {/* Logo */}
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 32, padding: "0 8px" }}>
        <div style={{
          width: 40, height: 40, borderRadius: 10,
          background: C.primaryContainer,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <span className="material-symbols-outlined fill" style={{ color: C.primary, fontSize: 22 }}>smart_toy</span>
        </div>
        <div>
          <div style={{ fontWeight: 900, fontSize: 16, color: "#1a5c59", lineHeight: 1.2 }}>Agent Core</div>
          <div style={{ fontSize: 12, color: C.outline, marginTop: 2 }}>Enterprise Tier</div>
        </div>
      </div>

      {/* Nav items */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 4 }}>
        {NAV.filter(item => can(item.roles)).map(item => {
          const isActive = active === item.id;
          return (
            <button key={item.id} onClick={() => onSelect(item.id)} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "8px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "Lexend, sans-serif",
              fontWeight: isActive ? 700 : 400,
              color: isActive ? "#1a5c59" : C.onSurfaceVariant,
              background: isActive ? "#e8f5f4" : "transparent",
              transition: "all 0.15s",
              textAlign: "left",
            }}>
              <span className="material-symbols-outlined" style={{
                fontSize: 20,
                color: isActive ? C.primary : C.outline,
                fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0",
              }}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </div>

      {/* User info */}
      {user && (
        <div style={{ padding: "10px 8px", borderTop: `1px solid ${C.border}`, marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: C.onSurface, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name || user.email}</div>
          <div style={{ fontSize: 11, color: C.outline, marginTop: 2 }}>{user.role.replace("_"," ")}</div>
        </div>
      )}
      {/* CTA */}
      <button style={{
        marginTop: 8,
        width: "100%",
        padding: "10px 16px",
        borderRadius: 8,
        border: "none",
        cursor: "pointer",
        background: C.primary,
        color: "#fff",
        fontSize: 12,
        fontWeight: 700,
        fontFamily: "Lexend, sans-serif",
        letterSpacing: "0.04em",
        display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
      }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
        Deploy New Agent
      </button>
      <button onClick={logout} style={{ marginTop: 6, width: "100%", padding: "8px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", background: "transparent", color: C.outline, fontSize: 12, fontFamily: "Lexend, sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <span className="material-symbols-outlined" style={{ fontSize: 16 }}>logout</span>
        Sign Out
      </button>
    </nav>
  );
}

/* ─── Top Bar ─────────────────────────────────────────────────────────────── */
function TopBar({ placeholder = "Search OS..." }: { placeholder?: string }) {
  const { user, logout } = useAuth();
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");

  const NOTIFICATIONS = [
    { text: "Agent Sarah resolved ticket #2041", time: "2m ago", icon: "check_circle", color: "#4ade80" },
    { text: "Anomaly detected in API response time", time: "15m ago", icon: "warning", color: "#f87171" },
    { text: "New Knowledge Base source indexed", time: "1h ago", icon: "info", color: C.primary },
  ];

  return (
    <header style={{
      height: 64, flexShrink: 0,
      background: "rgba(255,255,255,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 16,
      position: "sticky", top: 0, zIndex: 100,
      boxShadow: "0 1px 4px rgba(65,101,98,0.06)",
    }}>
      <span style={{ fontWeight: 800, fontSize: 20, color: C.onBg, letterSpacing: "-0.04em", flex: 1 }}>Hermes Agent OS</span>
      
      {/* Search */}
      <div style={{ position: "relative", flex: "0 0 350px" }}>
        <span className="material-symbols-outlined" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: C.outline, fontSize: 18 }}>search</span>
        <input 
          value={searchValue}
          onChange={e => setSearchValue(e.target.value)}
          placeholder={placeholder} 
          style={{
            width: "100%", padding: "10px 16px 10px 42px",
            border: `1.5px solid ${C.border}`, borderRadius: 12,
            fontSize: 13, fontFamily: "Lexend, sans-serif",
            color: C.onSurface, outline: "none", background: C.surfaceLow,
          }} 
        />
        {searchValue && (
          <div style={{ position: "absolute", top: "115%", left: 0, right: 0, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: 12, zIndex: 101 }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, marginBottom: 8, letterSpacing: "0.05em" }}>SEARCH RESULTS</div>
            <div style={{ fontSize: 13, color: C.onSurfaceVariant, padding: "8px 0" }}>Searching for "{searchValue}" across OS...</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
        {[
          { id: "noti", icon: "notifications", badge: true },
          { id: "help", icon: "help", badge: false },
          { id: "user", icon: "account_circle", badge: false },
        ].map(({ id, icon, badge }) => (
          <div key={id} style={{ position: "relative" }}>
            <button onClick={() => setActiveMenu(activeMenu === id ? null : id)} style={{
              width: 38, height: 38, borderRadius: 10,
              border: "none", cursor: "pointer",
              background: activeMenu === id ? C.primaryContainer : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              color: activeMenu === id ? C.primary : C.onSurfaceVariant, transition: "0.2s"
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: 24 }}>{icon}</span>
              {badge && <span style={{ position: "absolute", top: 8, right: 8, width: 8, height: 8, borderRadius: "50%", background: C.error, border: "2px solid #fff" }} />}
            </button>

            {activeMenu === id && (
              <div style={{ position: "absolute", top: "115%", right: 0, width: 260, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 16, boxShadow: "0 15px 40px rgba(0,0,0,0.15)", overflow: "hidden", zIndex: 101 }}>
                {id === "noti" && (
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 14, fontWeight: 900, marginBottom: 12 }}>Notifications</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {NOTIFICATIONS.map((n, i) => (
                        <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 16, color: n.color }}>{n.icon}</span>
                          <div>
                            <div style={{ fontSize: 12, color: C.onSurface, lineHeight: 1.3 }}>{n.text}</div>
                            <div style={{ fontSize: 10, color: C.outline, marginTop: 2 }}>{n.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {id === "help" && <div style={{ padding: 8 }}>{["Docs", "API", "Status"].map(item => <button key={item} style={{ width: "100%", padding: "10px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13 }}>{item}</button>)}</div>}
                {id === "user" && (
                  <div style={{ padding: 8 }}>
                    <div style={{ padding: "8px 12px", borderBottom: `1px solid ${C.surfaceVariant}`, marginBottom: 4 }}>
                      <div style={{ fontSize: 14, fontWeight: 900 }}>{user?.email}</div>
                      <div style={{ fontSize: 11, color: C.primary, fontWeight: 800 }}>SUPER ADMIN</div>
                    </div>
                    <button onClick={logout} style={{ width: "100%", padding: "10px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, color: C.error, fontWeight: 700 }}>Logout</button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </header>
  );
}

/* ─── Shared Card ──────────────────────────────────────────────────────────── */
function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{
      background: C.surface,
      borderRadius: 12,
      border: `1px solid ${C.border}`,
      overflow: "hidden",
      boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      ...style,
    }}>{children}</div>
  );
}

/* ─── KNOWLEDGE BASE ──────────────────────────────────────────────────────── */
function KnowledgeBaseView() {
  const { token, can } = useAuth();
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMsg, setUploadMsg] = useState<{type:"ok"|"err"; text:string}|null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleUpload = async (file: File) => {
    if (!can(["SUPER_ADMIN","ADMIN","OPERATOR"])) {
      setUploadMsg({ type:"err", text: "You don't have permission to upload documents." });
      return;
    }
    setUploading(true);
    setUploadMsg(null);
    try {
      const form = new FormData();
      form.append("document", file);
      const res = await fetch(`${API}/api/kb/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      setUploadMsg({ type:"ok", text: `✓ "${data.document.filename}" uploaded and queued for embedding.` });
    } catch (err: any) {
      setUploadMsg({ type:"err", text: err.message });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  };

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: 32, background: C.bg }}>
      <div style={{ maxWidth: 1160, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 600, color: C.onBg, margin: 0, lineHeight: 1.3 }}>Knowledge Base</h1>
            <p style={{ fontSize: 16, color: C.onSurfaceVariant, margin: "6px 0 0" }}>Manage and index data sources to train your AI agents.</p>
          </div>
          <button style={{
            display: "flex", alignItems: "center", gap: 8,
            padding: "8px 18px",
            background: C.secondaryContainer, color: C.secondary,
            border: "none", borderRadius: 8, cursor: "pointer",
            fontSize: 12, fontWeight: 700, letterSpacing: "0.04em",
            boxShadow: "0 4px 12px rgba(101,88,122,0.1)",
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>sync</span>
            Sync All Sources
          </button>
        </div>

        {/* Bento Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
          {/* Upload Zone */}
          <Card style={{ display: "flex", flexDirection: "column", position: "relative", overflow: "visible" }}>
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, #fff, rgba(186,225,221,0.05))", borderRadius: 12, pointerEvents: "none" }} />
            <div style={{ padding: 24, flex: 1, display: "flex", flexDirection: "column", position: "relative" }}>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: C.onSurface, margin: "0 0 8px", display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: C.primary }}>upload_file</span>
                Train with New Data
              </h3>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: "0 0 20px", lineHeight: 1.5 }}>Upload documents, PDFs, or connect external URLs to expand agent knowledge.</p>
              
              {/* Upload status */}
              {uploadMsg && (
                <div style={{ padding: "10px 14px", borderRadius: 8, marginBottom: 12, fontSize: 13, fontWeight: 500, background: uploadMsg.type === "ok" ? C.primaryFixed : C.errorContainer, color: uploadMsg.type === "ok" ? C.primary : C.error, border: `1px solid ${uploadMsg.type === "ok" ? C.primaryContainer : "rgba(186,26,26,0.2)"}` }}>
                  {uploadMsg.text}
                </div>
              )}

              {/* Drop Zone */}
              <div
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileRef.current?.click()}
                style={{
                  flex: 1, border: `2px dashed ${isDragging ? C.primary : C.inversePrimary}`,
                  borderRadius: 8, background: isDragging ? "rgba(167,206,202,0.2)" : "rgba(195,234,230,0.3)",
                  display: "flex", flexDirection: "column",
                  alignItems: "center", justifyContent: "center",
                  padding: 32, cursor: "pointer", minHeight: 200,
                  transition: "all 0.2s",
                }}>
                <input ref={fileRef} type="file" accept=".pdf,.txt,.csv,.docx" style={{ display: "none" }} onChange={e => { if (e.target.files?.[0]) handleUpload(e.target.files[0]); }} />
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: C.primaryContainer, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  {uploading
                    ? <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 28, animation: "spin 1s linear infinite" }}>progress_activity</span>
                    : <span className="material-symbols-outlined" style={{ color: C.primary, fontSize: 28 }}>cloud_upload</span>
                  }
                </div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.primary, letterSpacing: "0.04em", marginBottom: 4 }}>
                  {uploading ? "Uploading..." : "Drag & Drop files here"}
                </div>
                <div style={{ fontSize: 14, color: C.onSurfaceVariant, textAlign: "center", lineHeight: 1.5 }}>or click to browse from your computer</div>
                <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
                  {["PDF", "DOCX", "TXT", "CSV"].map(ext => (
                    <span key={ext} style={{ padding: "3px 8px", background: C.surface, border: `1px solid ${C.border}`, borderRadius: 4, fontSize: 10, fontWeight: 700, color: C.outline, letterSpacing: "0.06em" }}>{ext}</span>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.surfaceVariant}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, color: C.onSurfaceVariant, display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.secondary }}>link</span>
                  Add via URL
                </span>
                <button style={{ background: "none", border: "none", color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Connect Webhook</button>
              </div>
            </div>
          </Card>

          {/* Indexed Sources Table */}
          <Card style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ padding: "16px 24px", borderBottom: `1px solid ${C.surfaceVariant}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: C.onSurface, margin: 0, display: "flex", alignItems: "center", gap: 8 }}>
                <span className="material-symbols-outlined" style={{ color: C.secondary }}>database</span>
                Indexed Sources
              </h3>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ padding: "4px 12px", background: "rgba(242,211,199,0.5)", color: C.onTertiaryContainer, border: `1px solid ${C.tertiaryContainer}`, borderRadius: 9999, fontSize: 11, fontWeight: 500 }}>24 Total Sources</span>
                <button style={{ background: "none", border: "none", cursor: "pointer", color: C.outline, padding: 4, borderRadius: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 20 }}>filter_list</span>
                </button>
              </div>
            </div>
            <div style={{ flex: 1, overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: C.surface, borderBottom: `1px solid ${C.surfaceVariant}` }}>
                    {["Source Name", "Type", "Date Added", "Status", "Actions"].map(h => (
                      <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: "0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { name: "Q3_Financial_Report.pdf", sub: "2.4 MB", icon: "picture_as_pdf", iconBg: "rgba(255,218,214,0.5)", iconColor: C.error, typeBg: "rgba(255,218,214,0.3)", typeColor: C.onErrorContainer, type: "Document", date: "Oct 24, 2023", status: "indexed" },
                    { name: "Company Help Center", sub: "https://help.acme.com", icon: "language", iconBg: "rgba(186,225,221,0.5)", iconColor: C.primary, typeBg: "rgba(186,225,221,0.3)", typeColor: C.onPrimaryContainer, type: "Web Crawl", date: "Oct 22, 2023", status: "indexed" },
                    { name: "Customer_Feedback_2023.csv", sub: "12.1 MB", icon: "table_chart", iconBg: "rgba(231,214,254,0.5)", iconColor: C.secondary, typeBg: "rgba(231,214,254,0.3)", typeColor: C.onSecondaryContainer, type: "Dataset", date: "Oct 20, 2023", status: "processing" },
                    { name: "Zendesk Ticket Sync", sub: "Integration", icon: "api", iconBg: "rgba(242,211,199,0.5)", iconColor: C.tertiary, typeBg: "rgba(242,211,199,0.3)", typeColor: C.onTertiaryContainer, type: "API", date: "Oct 18, 2023", status: "error" },
                  ].map((row) => (
                    <tr key={row.name} style={{ borderBottom: `1px solid ${C.surfaceContainer}`, height: 56 }}
                      onMouseEnter={e => (e.currentTarget.style.background = C.surfaceLow)}
                      onMouseLeave={e => (e.currentTarget.style.background = "")}>
                      <td style={{ padding: "0 16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ width: 32, height: 32, borderRadius: 6, background: row.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                            <span className="material-symbols-outlined" style={{ fontSize: 18, color: row.iconColor }}>{row.icon}</span>
                          </div>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 500, color: C.onSurface }}>{row.name}</div>
                            <div style={{ fontSize: 11, color: C.onSurfaceVariant }}>{row.sub}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "0 16px" }}>
                        <span style={{ padding: "3px 8px", background: row.typeBg, color: row.typeColor, borderRadius: 4, fontSize: 11, fontWeight: 600 }}>{row.type}</span>
                      </td>
                      <td style={{ padding: "0 16px", fontSize: 14, color: C.onSurfaceVariant }}>{row.date}</td>
                      <td style={{ padding: "0 16px" }}>
                        {row.status === "indexed" && <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.primary }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span><span style={{ fontSize: 11, fontWeight: 500 }}>Indexed</span></div>}
                        {row.status === "processing" && <div><div style={{ display: "flex", alignItems: "center", gap: 4, color: C.outline }}><span className="material-symbols-outlined" style={{ fontSize: 14, animation: "spin 1s linear infinite" }}>sync</span><span style={{ fontSize: 11 }}>Processing (45%)</span></div><div style={{ width: "100%", height: 5, background: C.surfaceVariant, borderRadius: 9999, marginTop: 4, overflow: "hidden" }}><div style={{ width: "45%", height: "100%", background: C.secondary, borderRadius: 9999 }} /></div></div>}
                        {row.status === "error" && <div style={{ display: "flex", alignItems: "center", gap: 4, color: C.error }}><span className="material-symbols-outlined" style={{ fontSize: 14 }}>error</span><span style={{ fontSize: 11, fontWeight: 500 }}>Failed Auth</span></div>}
                      </td>
                      <td style={{ padding: "0 16px", textAlign: "right" }}>
                        <button style={{ background: "none", border: "none", cursor: "pointer", color: C.outline, padding: 4 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: 20 }}>more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: 12, borderTop: `1px solid ${C.surfaceVariant}`, display: "flex", justifyContent: "center" }}>
              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.primary, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
                View All Sources
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_forward</span>
              </button>
            </div>
          </Card>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </main>
  );
}

/* ─── INTEGRATION HUB ─────────────────────────────────────────────────────── */
function IntegrationsView() {
  const [configModal, setConfigModal] = useState<any>(null);

  const cards = [
    { id: "whatsapp", bg: "#dcf8c6", glowColor: "rgba(37,211,102,0.15)", borderColor: "rgba(37,211,102,0.2)", bubbleBg: "#25d366", icon: "forum", iconColor: "#25d366", titleColor: "#075e54", subtitleColor: "#128c7e", title: "WhatsApp", subtitle: "Active • 1,204 messages today", defaultOn: true, toggleColor: "#25d366" },
    { id: "messenger", bg: "#e0f2fe", glowColor: "rgba(0,132,255,0.15)", borderColor: "rgba(0,132,255,0.2)", bubbleBg: "#0084ff", icon: "chat_bubble", iconColor: "#0084ff", titleColor: "#0056b3", subtitleColor: "#0069d9", title: "Messenger", subtitle: "Active • 842 messages today", defaultOn: true, toggleColor: "#0084ff" },
    { id: "instagram", bg: "#fce7f3", glowColor: "rgba(225,48,108,0.15)", borderColor: "rgba(225,48,108,0.2)", bubbleBg: "#e1306c", icon: "photo_camera", iconColor: "#e1306c", titleColor: "#9e1646", subtitleColor: "#c11c58", title: "Instagram", subtitle: "Inactive • Connect to start", defaultOn: false, toggleColor: "#e1306c" },
    { id: "tiktok", bg: "#f3f4f6", glowColor: "rgba(0,0,0,0.1)", borderColor: "rgba(0,0,0,0.1)", bubbleBg: "#25f4ee", icon: "storefront", iconColor: "#000", titleColor: "#000", subtitleColor: "#666", title: "TikTok Shop", subtitle: "Active • 12 orders syncing", defaultOn: true, toggleColor: "#000" },
  ];

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: 32, background: C.bg }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 32, fontWeight: 600, color: C.onSurface, margin: 0, lineHeight: 1.3 }}>Integration Hub</h2>
          <p style={{ fontSize: 16, color: C.onSurfaceVariant, margin: "6px 0 0" }}>Connect your favorite channels to your agent.</p>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {cards.map((card) => (
            <IntegrationCard key={card.title} card={card} onConfigure={() => setConfigModal(card)} />
          ))}
        </div>
      </div>

      <Modal isOpen={!!configModal} onClose={() => setConfigModal(null)} title={`Configure ${configModal?.title}`}>
        {configModal && (
          <IntegrationConfigContent integration={configModal} onClose={() => setConfigModal(null)} />
        )}
      </Modal>
    </main>
  );
}

function IntegrationConfigContent({ integration, onClose }: { integration: any; onClose: () => void }) {
  const [verifying, setVerifying] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const testConnection = () => {
    setVerifying(true);
    setStatus(null);
    setTimeout(() => {
      setVerifying(false);
      setStatus("success");
    }, 1500);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {integration.id === "whatsapp" && (
          <>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>WhatsApp Business ID</label>
              <input placeholder="Enter ID from Meta Dashboard" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Meta API Token</label>
              <input type="password" placeholder="EAABw..." style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
            </div>
          </>
        )}
        {integration.id === "tiktok" && (
          <>
            <div>
              <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Seller ID</label>
              <input placeholder="MY_9921_1" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
            </div>
          </>
        )}
        {(integration.id !== "whatsapp" && integration.id !== "tiktok") && (
          <div>
            <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Instance API Key</label>
            <input placeholder="Enter your key" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
          </div>
        )}
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Webhook URL (Auto-generated)</label>
          <div style={{ padding: 12, background: C.surfaceLow, borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 13, color: C.outline, fontFamily: "monospace" }}>
            https://api.hermes.ai/v1/webhook/{integration.id}/_live_8912
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 12, marginTop: 12 }}>
        <button
          onClick={testConnection}
          disabled={verifying}
          style={{
            flex: 1, padding: "12px", borderRadius: 10, border: `1.5px solid ${C.primary}`,
            background: status === "success" ? "#e8f5f4" : "transparent",
            color: C.primary, fontSize: 14, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8
          }}
        >
          {verifying ? (
            <span className="material-symbols-outlined" style={{ animation: "spin 1s linear infinite", fontSize: 18 }}>progress_activity</span>
          ) : (
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{status === "success" ? "check_circle" : "router"}</span>
          )}
          {verifying ? "Testing..." : status === "success" ? "Connection Verified" : "Verify Connection"}
        </button>
        <button
          onClick={onClose}
          style={{ flex: 1, background: C.primary, color: "#fff", border: "none", borderRadius: 10, padding: "12px", fontSize: 14, fontWeight: 700, cursor: "pointer" }}
        >
          Save Configuration
        </button>
      </div>
    </div>
  );
}

function IntegrationCard({ card, onConfigure }: { card: any; onConfigure: () => void }) {
  const [on, setOn] = useState(card.defaultOn);
  return (
    <div style={{
      height: 220, borderRadius: 12, padding: 20,
      background: card.bg,
      boxShadow: `0 8px 24px ${card.glowColor}`,
      border: `1px solid ${card.borderColor}`,
      display: "flex", flexDirection: "column", justifyContent: "space-between",
      position: "relative", overflow: "hidden", cursor: "default",
    }}>
      <div style={{ position: "absolute", right: -32, top: -32, width: 100, height: 100, borderRadius: "50%", background: card.bubbleBg, opacity: 0.12, pointerEvents: "none" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", position: "relative", zIndex: 1 }}>
        <div style={{ width: 52, height: 52, borderRadius: "50%", background: "#fff", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 28, color: card.iconColor }}>{card.icon}</span>
        </div>
        {/* Toggle Switch */}
        <div onClick={() => setOn(!on)} style={{
          width: 44, height: 24, borderRadius: 9999,
          background: on ? card.toggleColor : "rgba(255,255,255,0.5)",
          position: "relative", cursor: "pointer", transition: "background 0.2s",
          border: on ? "none" : "1.5px solid rgba(0,0,0,0.1)",
        }}>
          <div style={{
            position: "absolute", top: 2, left: on ? 22 : 2,
            width: 20, height: 20, borderRadius: "50%",
            background: "#fff", transition: "left 0.2s",
            boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          }} />
        </div>
      </div>
      <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <h3 style={{ fontSize: 20, fontWeight: 500, color: card.titleColor, margin: "0 0 4px" }}>{card.title}</h3>
          <p style={{ fontSize: 13, color: card.subtitleColor, margin: 0, fontWeight: 500 }}>{card.subtitle}</p>
        </div>
        <button
          onClick={onConfigure}
          style={{
            padding: "8px 16px", borderRadius: 8, background: "#fff", border: "none",
            color: card.titleColor, fontSize: 12, fontWeight: 700, cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)", display: "flex", alignItems: "center", gap: 6
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>settings</span>
          Configure
        </button>
      </div>
    </div>
  );
}

/* ─── INBOX ───────────────────────────────────────────────────────────────── */

const CONVERSATIONS = [
  {
    id: "1",
    name: "Sarah Jenkins",
    initials: "SJ",
    avatarBg: "linear-gradient(135deg,#4db8b0,#288c85)",
    channel: "mail",
    channelLabel: "Support Email",
    tier: "PREMIUM TIER",
    tierBg: "#ecdcff",
    tierColor: "#211633",
    lastMsg: "Hi there, I'm trying to set up the new integration with Stripe...",
    time: "10:24 AM",
    unread: 2,
    online: true,
    messages: [
      { role: "user", text: "Hi there, I'm trying to set up the new integration with Stripe, but I keep getting a 500 error when I submit the API key. Can you help me troubleshoot this?", time: "10:24 AM" },
      { role: "system", text: "Ticket #4928 automatically assigned to Support Agent Alpha", time: "10:24 AM" },
      { role: "agent", text: "Hello Sarah! I can certainly help you with that Stripe integration issue.\n\nLet me just check the recent error logs for your workspace to see what might be causing that 500 error...", time: "10:24 AM" },
    ],
  },
  {
    id: "2",
    name: "Ahmad Ramdan",
    initials: "AR",
    avatarBg: "linear-gradient(135deg,#a78bfa,#7c3aed)",
    channel: "forum",
    channelLabel: "WhatsApp",
    tier: "BASIC TIER",
    tierBg: "#f4f4f2",
    tierColor: "#414847",
    lastMsg: "Berapa harga paket enterprise per bulan?",
    time: "09:58 AM",
    unread: 0,
    online: true,
    messages: [
      { role: "user", text: "Halo, saya ingin tanya berapa harga paket enterprise per bulan?", time: "09:55 AM" },
      { role: "agent", text: "Halo Ahmad! Terima kasih sudah menghubungi kami.\n\nUntuk paket Enterprise, harga dimulai dari Rp 4.500.000/bulan dengan fitur lengkap termasuk custom SLA dan dedicated support. Apakah Anda ingin saya mengirimkan proposal lengkap?", time: "09:58 AM" },
    ],
  },
  {
    id: "3",
    name: "Lisa Tan",
    initials: "LT",
    avatarBg: "linear-gradient(135deg,#fb923c,#dc2626)",
    channel: "photo_camera",
    channelLabel: "Instagram",
    tier: "TRIAL",
    tierBg: "#ffdad6",
    tierColor: "#93000a",
    lastMsg: "How do I reset my password? I've been locked out.",
    time: "Yesterday",
    unread: 1,
    online: false,
    messages: [
      { role: "user", text: "How do I reset my password? I've been locked out for the past hour.", time: "Yesterday, 4:12 PM" },
      { role: "agent", text: "Hi Lisa! I'm sorry to hear you're locked out. I can help you reset your password right away. Please check your registered email for a password reset link — I've just sent one.", time: "Yesterday, 4:13 PM" },
      { role: "user", text: "Thank you! Got the email.", time: "Yesterday, 4:18 PM" },
    ],
  },
  {
    id: "4",
    name: "Budi Santoso",
    initials: "BS",
    avatarBg: "linear-gradient(135deg,#34d399,#059669)",
    channel: "storefront",
    channelLabel: "TikTok Shop",
    tier: "PREMIUM TIER",
    tierBg: "#ecdcff",
    tierColor: "#211633",
    lastMsg: "My order #TK-9921 hasn't shipped yet after 5 days.",
    time: "Yesterday",
    unread: 0,
    online: false,
    messages: [
      { role: "user", text: "My order #TK-9921 hasn't shipped yet after 5 days. What's going on?", time: "Yesterday, 2:05 PM" },
      { role: "agent", text: "Hi Budi! I sincerely apologize for the delay on order #TK-9921. I can see it's been flagged due to a stock verification issue. Our team has prioritized it and it will ship by end of day today. You'll receive a tracking number via WhatsApp.", time: "Yesterday, 2:08 PM" },
    ],
  },
  {
    id: "5",
    name: "Lisa Tan",
    initials: "LT",
    avatarBg: "linear-gradient(135deg,#f09433,#e6683c)",
    channel: "instagram",
    channelLabel: "Instagram",
    lastMsg: "How do I reset my password? I've been trying to...",
    time: "Yesterday",
    unread: 0,
    online: true,
    messages: [
      { role: "user", text: "Hi, I forgot my password.", time: "Yesterday, 11:20 AM" },
    ],
  },
];

const TRACES = [
  { title: "Intent Classification", time: "10:24:02", desc: "Analyzed incoming message to determine required skills.", tags: ["Stripe", "500 Error"], iconBg: "#e7d6fe", iconColor: "#685b7d", icon: "psychology", active: false },
  { title: "Query Logs", time: "10:24:05", desc: "Executing search in Datadog for recent errors.", code: "SELECT * FROM logs WHERE env='prod' AND user_id='usr_892'", iconBg: "#f2d3c7", iconColor: "#715950", icon: "database", active: false },
  { title: "Drafting Response", time: "In progress", desc: "Synthesizing log findings into a helpful response...", progress: true, iconBg: "#bae1dd", iconColor: "#416562", icon: "edit", active: true },
];

function InboxView() {
  const [convos, setConvos] = useState([...CONVERSATIONS]);
  const [selectedId, setSelectedId] = useState("1");
  const [msgText, setMsgText] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [mobileView, setMobileView] = useState<"list" | "chat" | "trace">("list");
  const [isTyping, setIsTyping] = useState(false);
  const [activeTraceIndex, setActiveTraceIndex] = useState(-1);
  const [showConvMenu, setShowConvMenu] = useState(false);
  const [showComposeModal, setShowComposeModal] = useState(false);
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [newChatData, setNewChatData] = useState({ name: "", phone: "", msg: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic Filtering
  const filteredConvos = convos.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         c.lastMsg.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "All" || 
                      (activeTab === "Open" && c.unread > 0) || 
                      (activeTab === "Unread" && c.unread > 0) ||
                      (activeTab === "Resolved" && c.unread === 0 && c.messages.length > 0) ||
                      (activeTab === "Bot" && c.channelLabel === "WhatsApp");
    return matchesSearch && matchesTab;
  }).sort((a,b) => {
    if (sortOrder === "newest") return b.id.localeCompare(a.id);
    return a.id.localeCompare(b.id);
  });

  const selectedConv = convos.find(c => c.id === selectedId) || convos[0];

  const handleSendMessage = () => {
    if (!msgText.trim()) return;
    const newMessage = { role: "user", text: msgText, time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) };
    setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, newMessage], lastMsg: msgText, time: "Now" } : c));
    setMsgText("");
    setIsTyping(true);
    let step = 0;
    const interval = setInterval(() => { setActiveTraceIndex(step); step++; if (step > 2) clearInterval(interval); }, 800);
    setTimeout(() => {
      const aiReply = { role: "agent", text: "Got it. I'm checking the logs now.", time: "Now" };
      setConvos(prev => prev.map(c => c.id === selectedId ? { ...c, messages: [...c.messages, aiReply], lastMsg: aiReply.text, time: "Now" } : c));
      setIsTyping(false);
      setActiveTraceIndex(-1);
    }, 3000);
  };

  const dynamicTraces = TRACES.map((t, i) => ({ ...t, active: i === activeTraceIndex || (i === 2 && isTyping), progress: (i === activeTraceIndex || (i === 2 && isTyping)) }));

  return (
    <main style={{ flex: 1, display: "flex", overflow: "hidden", background: C.bg }}>
      
      {/* ── Conversation List ──────────────────────────────────────────────── */}
      <div style={{ 
        width: 300, flexShrink: 0, borderRight: `1px solid ${C.border}`, background: C.surface, 
        display: (mobileView === "list" || (typeof window !== "undefined" && window.innerWidth > 1024)) ? "flex" : "none", 
        flexDirection: "column", overflow: "hidden" 
      }}>
        <div style={{ padding: "16px 16px 12px", borderBottom: `1px solid ${C.surfaceVariant}`, flexShrink: 0 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, margin: 0 }}>Inbox</h2>
            <div style={{ display: "flex", gap: 4, position: "relative" }}>
              <button 
                onClick={() => setShowFilterMenu(!showFilterMenu)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.outline, padding: 4, borderRadius: 6 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>filter_list</span>
              </button>
              {showFilterMenu && (
                <div style={{ position: "absolute", top: "100%", right: 10, width: 200, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, padding: 6 }}>
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, padding: "4px 10px 8px" }}>SORT BY</div>
                  {[
                    { label: "Newest First", value: "newest" },
                    { label: "Oldest First", value: "oldest" }
                  ].map(opt => (
                    <button 
                      key={opt.value} 
                      onClick={() => { setSortOrder(opt.value as any); setShowFilterMenu(false); }}
                      style={{ width: "100%", padding: "8px 10px", textAlign: "left", background: sortOrder === opt.value ? C.primaryContainer : "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, color: sortOrder === opt.value ? C.primary : C.onSurface }}
                    >
                      {opt.label}
                    </button>
                  ))}
                  <div style={{ fontSize: 11, fontWeight: 800, color: C.outline, padding: "12px 10px 8px", borderTop: `1px solid ${C.surfaceVariant}` }}>STATUS</div>
                  {["All", "Unread", "Resolved"].map(opt => (
                    <button 
                      key={opt} 
                      onClick={() => { setActiveTab(opt); setShowFilterMenu(false); }} 
                      style={{ width: "100%", padding: "8px 10px", textAlign: "left", background: activeTab === opt ? C.primaryContainer : "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 13, color: activeTab === opt ? C.primary : C.onSurface }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
              <button 
                onClick={() => setShowComposeModal(true)}
                style={{ background: "none", border: "none", cursor: "pointer", color: C.outline, padding: 4, borderRadius: 6 }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>edit_square</span>
              </button>
            </div>
          </div>
          <div style={{ position: "relative" }}>
            <span className="material-symbols-outlined" style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: C.outline, fontSize: 16 }}>search</span>
            <input 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search conversations..." 
              style={{ width: "100%", padding: "7px 12px 7px 32px", border: `1px solid ${C.border}`, borderRadius: 8, fontSize: 13, fontFamily: "Lexend, sans-serif", color: C.onSurface, outline: "none", background: C.bg, boxSizing: "border-box" }} 
            />
          </div>
        </div>

        <div style={{ display: "flex", padding: "8px 12px", gap: 4, borderBottom: `1px solid ${C.surfaceVariant}`, flexShrink: 0 }}>
          {["All", "Open", "Resolved", "Bot"].map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ padding: "4px 10px", borderRadius: 9999, border: "none", cursor: "pointer", fontSize: 11, fontWeight: 700, background: activeTab === tab ? C.primaryContainer : "transparent", color: activeTab === tab ? C.primary : C.onSurfaceVariant, fontFamily: "Lexend, sans-serif" }}>
              {tab}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto" }}>
          {filteredConvos.map(c => {
            const isSelected = c.id === selectedId;
            return (
              <button key={c.id} onClick={() => { setSelectedId(c.id); setMobileView("chat"); }} style={{ width: "100%", padding: "12px 16px", border: "none", borderBottom: `1px solid ${C.surfaceVariant}`, background: isSelected ? C.primaryFixed : "transparent", cursor: "pointer", textAlign: "left", display: "flex", alignItems: "flex-start", gap: 10 }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: c.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, border: "2px solid #fff", boxShadow: "0 1px 3px rgba(0,0,0,0.12)" }}>{c.initials}</div>
                  {c.online && <div style={{ position: "absolute", bottom: 0, right: 0, width: 10, height: 10, borderRadius: "50%", background: "#4ade80", border: "2px solid #fff" }} />}
                  <div style={{ position: "absolute", bottom: -2, left: -2, width: 18, height: 18, borderRadius: "50%", background: "#fff", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 1px 4px rgba(0,0,0,0.15)", border: "1px solid #efefef", overflow: "hidden" }}>
                    {c.channelLabel === "WhatsApp" ? (
                      <svg width="12" height="12" viewBox="0 0 1172.9 1474.5" fill="#25D366"><path d="M308.678 1021.49l19.153 9.576a499.739 499.739 0 0 0 258.244 70.227c279.729-.638 509.563-231.016 509.563-510.744 0-135.187-53.692-265.012-149.169-360.713-95.35-96.69-225.62-151.18-361.383-151.18-278.451 0-507.552 229.133-507.552 507.552 0 2.203 0 4.373.032 6.576a523.81 523.81 0 0 0 76.612 268.14l12.768 19.153-51.074 188.337 192.806-46.925z" /></svg>
                    ) : c.channelLabel === "Messenger" ? (
                      <svg width="12" height="12" viewBox="0 0 800 801"><defs><radialGradient id="msgGrad" cx="101" cy="809" r="1" gradientTransform="matrix(800 0 0 -800 -81386 648000)" gradientUnits="userSpaceOnUse"><stop offset="0" stopColor="#09f"/><stop offset=".6" stopColor="#a033ff"/><stop offset=".9" stopColor="#ff5280"/><stop offset="1" stopColor="#ff7061"/></radialGradient></defs><path fill="url(#msgGrad)" d="M400 0C174.7 0 0 165.1 0 388c0 116.6 47.8 217.4 125.6 287 6.5 5.8 10.5 14 10.7 22.8l2.2 71.2a32 32 0 0 0 44.9 28.3l79.4-35c6.7-3 14.3-3.5 21.4-1.6 36.5 10 75.3 15.4 115.8 15.4 225.3 0 400-165.1 400-388S625.3 0 400 0z"/><path fill="#FFF" d="M159.8 501.5l117.5-186.4a60 60 0 0 1 86.8-16l93.5 70.1a24 24 0 0 0 28.9-.1l126.2-95.8c16.8-12.8 38.8 7.4 27.6 25.3L522.7 484.9a60 60 0 0 1-86.8 16l-93.5-70.1a24 24 0 0 0-28.9.1l-126.2 95.8c-16.8 12.8-38.8-7.3-27.5-25.2z"/></svg>
                    ) : c.channelLabel === "TikTok Shop" ? (
                      <svg width="12" height="12" viewBox="-58 -186 2548 2538"><path d="M779 890v-88c0-4 0-8-1-12-300-1-565 194-655 480S48 1871 294 2042a685 685 0 0 1 485-1152z" fill="#25f4ee"/><path d="M796 1888c167 0 305-132 312-300V94h273c52 94 111 251 113 418H1002v1493c-6 168-144 301-313 302a318 318 0 0 1-144-36 313 313 0 0 0 251-470zM1891 601v-83c-148-31-255-75-282-168a518 518 0 0 0 282 251z" fill="#fe2c55"/><path d="M1609 433a514 514 0 0 1-127-339h-100a517 517 0 0 0 227 339zM686 1167a313 313 0 1 0 0 626c111 0 209-58 265-144V1262a330 330 0 0 1 92 15V897s-50-6-92-7h-17v289c0-6 0-11-1-16z" fill="#fe2c55"/><path d="M1891 601v289c-283-36-474-106-517-168v759c-1 379-308 685-687 685a680 680 0 0 1-393-124 685 685 0 0 0 1187-466V819c235 91 422 251 510 443v-372a530 530 0 0 1-108-115z" fill="#fe2c55"/><path d="M1373 1481v-759c237 92 424 252 518 444V601a518 518 0 0 1-283-166 517 517 0 0 1-227-339h-273v1492c-6 168-144 301-312 302a313 313 0 1 1-254-470s-92-15-92 15v353a685 685 0 0 0 1188-115z" fill="#000"/></svg>
                    ) : c.channelLabel === "Instagram" ? (
                      <svg width="12" height="12" viewBox="0 0 2500 2500"><defs><radialGradient id="instaGrad" cx="332" cy="2511" r="3263" gradientUnits="userSpaceOnUse"><stop offset=".09" stopColor="#fa8f21"/><stop offset=".78" stopColor="#d82d7e"/></radialGradient></defs><path d="M734.6 7.5C601.5 13.5 510.6 34.6 431.2 65.5 349 97.4 279.4 140.2 209.8 209.8S97.5 349 65.6 431.2c-30.9 79.5-52 170.3-58.1 303.4C1.4 867.9 0 910.5 0 1250s1.4 382 7.6 515.3c6.1 133 27.2 224 58.1 303.4 31.9 82.2 74.6 152 144.2 221.4s139.2 112.2 221.4 144.2c79.6 30.9 170.3 52 303.4 58.1 133.4 6 175.9 7.6 515.4 7.6s382-1.4 515.3-7.6c133-6.1 224-27.2 303.4-58.1 82.2-32 151.9-74.7 221.4-144.2s112.2-139.2 144.2-221.4c30.9-79.5 52.1-170.3 58.1-303.4 6-133.4 7.5-175.9 7.5-515.4s-1.4-382-7.5-515.3c-6.1-133-27.1-224-58.1-303.4-32-82.2-74.7-151.9-144.2-221.4S2150.9 97.5 2068.9 65.6c-79.6-30.9-170.4-52.1-303.4-58.1C1632.2 1.5 1589.6 0 1250.1 0S868 1.4 734.6 7.5" fill="url(#instaGrad)"/><path d="M833.4 1250c0-230.1 186.5-416.7 416.6-416.7s416.7 186.6 416.7 416.7-186.6 416.7-416.7 416.7-416.6-186.6-416.6-416.7m-225.2 0c0 354.5 287.4 641.9 641.9 641.9s641.9-287.4 641.9-641.9S1604.5 608.1 1250 608.1 608.1 895.5 608.1 1250m1159.1-667.3a150 150 0 1 0 0-300 150 150 0 0 0 0 300" fill="#fff"/></svg>
                    ) : (
                      <span className="material-symbols-outlined" style={{ fontSize: 11, color: C.primary }}>sms</span>
                    )}
                  </div>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 3 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: C.onSurface, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.name}</span>
                    <span style={{ fontSize: 10, color: C.onSurfaceVariant }}>{c.time}</span>
                  </div>
                  <div style={{ fontSize: 12, color: C.onSurfaceVariant, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c.lastMsg}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Chat Pane ──────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: (mobileView === "chat" || (typeof window !== "undefined" && window.innerWidth > 768)) ? "flex" : "none", flexDirection: "column", overflow: "hidden", minWidth: 0, background: C.surface }}>
        <div style={{ height: 64, borderBottom: `1px solid ${C.surfaceVariant}`, display: "flex", alignItems: "center", padding: "0 20px", justifyContent: "space-between", flexShrink: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {(typeof window !== "undefined" && window.innerWidth <= 1024) && (
              <button onClick={() => setMobileView("list")} style={{ background: "none", border: "none", cursor: "pointer", color: C.outline }}><span className="material-symbols-outlined">arrow_back</span></button>
            )}
            <div style={{ position: "relative" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: selectedConv.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", border: "2px solid #fff", boxShadow: "0 1px 4px rgba(0,0,0,0.1)", color: "#fff", fontWeight: 700, fontSize: 14 }}>{selectedConv.initials}</div>
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 600, color: C.onSurface, lineHeight: 1.2 }}>{selectedConv.name}</div>
              <div style={{ fontSize: 12, color: C.onSurfaceVariant }}>{selectedConv.channelLabel}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
            <button 
              onClick={() => setShowConvMenu(!showConvMenu)}
              style={{ background: "none", border: "none", cursor: "pointer", color: C.onSurfaceVariant, padding: 4, borderRadius: 6 }}
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
            {showConvMenu && (
              <div style={{ position: "absolute", top: "100%", right: 0, width: 180, background: "#fff", border: `1px solid ${C.border}`, borderRadius: 12, boxShadow: "0 10px 25px rgba(0,0,0,0.1)", zIndex: 100, padding: 6 }}>
                {["Resolve Conversation", "Mute Notifications", "Assign to Agent", "Delete History"].map(item => (
                  <button key={item} style={{ width: "100%", padding: "8px 12px", textAlign: "left", background: "none", border: "none", cursor: "pointer", borderRadius: 8, fontSize: 12, color: item === "Delete History" ? C.error : C.onSurfaceVariant }}>{item}</button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px", display: "flex", flexDirection: "column", gap: 16, background: "linear-gradient(to bottom,#fff,rgba(244,244,242,0.3))" }}>
          {selectedConv.messages.map((msg, i) => {
            if (msg.role === "system") return (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "0 24px", opacity: 0.75 }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: C.tertiaryContainer, display: "flex", alignItems: "center", justifyContent: "center" }}><span className="material-symbols-outlined" style={{ fontSize: 12, color: C.onTertiaryContainer }}>api</span></div>
                <div style={{ height: 1, flex: 1, background: C.surfaceVariant }} />
                <span style={{ fontSize: 11, color: C.onSurfaceVariant, whiteSpace: "nowrap" }}>{msg.text}</span>
                <div style={{ height: 1, flex: 1, background: C.surfaceVariant }} />
              </div>
            );
            return (
              <div key={i} style={{ display: "flex", gap: 10, flexDirection: msg.role === "agent" ? "row-reverse" : "row", maxWidth: "78%", marginLeft: msg.role === "agent" ? "auto" : 0 }}>
                <div style={{ width: 30, height: 30, borderRadius: "50%", background: msg.role === "agent" ? C.primaryContainer : selectedConv.avatarBg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2, color: "#fff", fontSize: 11, fontWeight: 700 }}>
                  {msg.role === "agent" ? <span className="material-symbols-outlined" style={{ fontSize: 16, color: C.primary }}>robot_2</span> : selectedConv.initials}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 3, alignItems: msg.role === "agent" ? "flex-end" : "flex-start" }}>
                  <div style={{ 
                    background: msg.role === "agent" ? C.primaryFixed : C.surfaceLow, 
                    border: `1px solid ${msg.role === "agent" ? "rgba(167,206,202,0.3)" : C.surfaceVariant}`, 
                    padding: "12px 14px", 
                    borderRadius: msg.role === "agent" ? "14px 14px 3px 14px" : "14px 14px 14px 3px", 
                    fontSize: 14, color: C.onSurface, lineHeight: 1.6, whiteSpace: "pre-wrap", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" 
                  }}>
                    {msg.text}
                  </div>
                  <span style={{ fontSize: 10, color: C.onSurfaceVariant }}>{msg.time}</span>
                </div>
              </div>
            );
          })}
          {isTyping && <div style={{ textAlign: "right", fontSize: 12, color: C.primary, fontWeight: 700 }}>AI Thinking...</div>}
        </div>

        <div style={{ padding: "12px 16px", background: C.surface, borderTop: `1px solid ${C.surfaceVariant}`, flexShrink: 0 }}>
          <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={(e) => console.log("File selected:", e.target.files?.[0])} />
          <div style={{ border: `1.5px solid ${C.border}`, borderRadius: 12, overflow: "hidden" }}>
            <textarea value={msgText} onChange={e => setMsgText(e.target.value)} placeholder="Type a message..." rows={2} style={{ width: "100%", padding: "12px 14px 36px", border: "none", resize: "none", fontFamily: "inherit", fontSize: 14, color: C.onSurface, background: C.surfaceLow, outline: "none", boxSizing: "border-box" }} />
            <div style={{ background: C.surfaceLow, padding: "8px 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { icon: "attach_file", action: () => fileInputRef.current?.click() },
                  { icon: "mic", action: () => alert("Microphone accessibility requested...") },
                  { icon: "image", action: () => fileInputRef.current?.click() },
                ].map((btn, i) => (
                  <button 
                    key={i} 
                    onClick={btn.action}
                    style={{ 
                      width: 32, height: 32, background: "#fff", border: "none", borderRadius: 8, 
                      display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: C.outline
                    }}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>{btn.icon}</span>
                  </button>
                ))}
              </div>
              <button onClick={handleSendMessage} style={{ background: C.primary, color: "#fff", border: "none", borderRadius: 8, padding: "6px 16px", fontSize: 12, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}>Send <span className="material-symbols-outlined" style={{ fontSize: 14 }}>send</span></button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Agent Trace ────────────────────────────────────────────────────── */}
      <div style={{ 
        width: 280, flexShrink: 0, borderLeft: `1px solid ${C.border}`, background: C.bg, 
        display: (mobileView === "trace" || (typeof window !== "undefined" && window.innerWidth > 1400)) ? "flex" : "none", 
        flexDirection: "column", overflow: "hidden" 
      }}>
        <div style={{ height: 64, borderBottom: `1px solid ${C.surfaceVariant}`, display: "flex", alignItems: "center", padding: "0 16px", justifyContent: "space-between", background: C.surface }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="material-symbols-outlined" style={{ color: C.tertiary, fontSize: 20 }}>account_tree</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: C.onSurface }}>Agent Trace</span>
          </div>
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px rgba(34,197,94,0.6)", animation: "pulse 2s infinite" }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 14, display: "flex", flexDirection: "column", gap: 14 }}>
          {dynamicTraces.map((trace, i) => (
            <div key={i} style={{ position: "relative", paddingLeft: 26 }}>
              {i < dynamicTraces.length - 1 && <div style={{ position: "absolute", left: 10, top: 22, bottom: -14, width: 2, background: C.surfaceVariant }} />}
              <div style={{ position: "absolute", left: 0, top: 3, width: 22, height: 22, borderRadius: "50%", background: trace.iconBg, border: "2px solid #fff", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1, boxShadow: "0 1px 3px rgba(0,0,0,0.08)" }}>
                <span className="material-symbols-outlined" style={{ fontSize: 11, color: trace.iconColor }}>{trace.icon}</span>
              </div>
              <div style={{ background: trace.active ? "rgba(195,234,230,0.2)" : C.surface, border: `1px solid ${trace.active ? C.primaryFixed : C.surfaceVariant}`, borderRadius: 8, padding: 10, boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: trace.active ? C.primary : C.onSurface }}>{trace.title}</span>
                  <span style={{ fontSize: 10 }}>{trace.time}</span>
                </div>
                <p style={{ fontSize: 12, color: C.onSurfaceVariant, margin: 0, lineHeight: 1.5 }}>{trace.desc}</p>
                {trace.progress && (
                  <div style={{ marginTop: 8, height: 4, background: C.surfaceVariant, borderRadius: 9999, overflow: "hidden" }}>
                    <div style={{ width: "100%", height: "100%", background: C.primary, animation: "loadingBar 2s infinite ease-in-out" }} />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Compose Modal ────────────────────────────────────────────────────── */}
      {showComposeModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, animation: "fadeInUp 0.3s ease-out" }}>
          <div style={{ width: 420, background: "#fff", borderRadius: 24, boxShadow: "0 20px 60px rgba(0,0,0,0.2)", padding: 32, position: "relative" }}>
            <button onClick={() => setShowComposeModal(false)} style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", color: C.outline }}><span className="material-symbols-outlined">close</span></button>
            <h2 style={{ fontSize: 24, fontWeight: 900, color: C.onBg, margin: "0 0 8px", letterSpacing: "-0.02em" }}>New Conversation</h2>
            <p style={{ fontSize: 15, color: C.onSurfaceVariant, margin: "0 0 24px" }}>Start a manual chat with a customer.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.primary, marginBottom: 6, display: "block" }}>CUSTOMER NAME</label>
                <input placeholder="e.g. Ahmad Suherman" value={newChatData.name} onChange={e => setNewChatData({...newChatData, name: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", background: C.surfaceLow }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.primary, marginBottom: 6, display: "block" }}>PHONE / WHATSAPP</label>
                <input placeholder="+62 812..." value={newChatData.phone} onChange={e => setNewChatData({...newChatData, phone: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", background: C.surfaceLow }} />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 800, color: C.primary, marginBottom: 6, display: "block" }}>INITIAL MESSAGE</label>
                <textarea rows={3} placeholder="How can I help you today?" value={newChatData.msg} onChange={e => setNewChatData({...newChatData, msg: e.target.value})} style={{ width: "100%", padding: "12px 16px", borderRadius: 12, border: `1.5px solid ${C.border}`, fontSize: 14, outline: "none", background: C.surfaceLow, resize: "none" }} />
              </div>
            </div>

            <button 
              onClick={() => {
                if (!newChatData.name || !newChatData.phone) return alert("Please fill name and phone");
                const id = String(convos.length + 1);
                const firstInitial = newChatData.name.charAt(0).toUpperCase();
                const newConvo = {
                  id, 
                  name: newChatData.name, 
                  initials: firstInitial,
                  lastMsg: newChatData.msg || "Conversation started",
                  time: "Just now",
                  unread: 0,
                  avatarBg: "#416562",
                  online: true,
                  channel: "WhatsApp",
                  channelLabel: "WhatsApp",
                  messages: newChatData.msg ? [{ role:"user", text: newChatData.msg, time: "Now" }] : []
                };
                setConvos([newConvo, ...convos]);
                setSelectedId(id);
                setShowComposeModal(false);
                setNewChatData({ name: "", phone: "", msg: "" });
              }}
              style={{ width: "100%", marginTop: 32, padding: "14px", background: C.primary, color: "#fff", border: "none", borderRadius: 16, fontSize: 15, fontWeight: 700, cursor: "pointer", boxShadow: "0 8px 24px rgba(65,101,98,0.2)" }}
            >
              Start Conversation
            </button>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes loadingBar { from { transform: translateX(-100%); } to { transform: translateX(100%); } }
      `}</style>
    </main>
  );
}

/* ─── AI PERFORMANCE ──────────────────────────────────────────────────────── */


/* ─── AI PERFORMANCE DATA ─────────────────────────────────────────────────── */
const LOGS = [
  { time: "Today, 10:42 AM", query: '"How do I reset my API key?"', intent: "Account Management", intentBg: "rgba(231,214,254,0.5)", intentColor: "#685b7d", conf: 98, confColor: C.primary, status: "Auto-Resolved", statusBg: C.primaryContainer, statusColor: C.onPrimaryContainer, dot: C.primary },
  { time: "Today, 10:15 AM", query: '"Pricing for 500 users custom SLA"', intent: "Sales Inquiry", intentBg: "rgba(242,211,199,0.5)", intentColor: "#715950", conf: 85, confColor: C.tertiary, status: "Escalated to Human", statusBg: C.tertiaryContainer, statusColor: C.onTertiaryContainer, dot: C.tertiary },
  { time: "Today, 09:30 AM", query: '"Webhook payload keeps failing with 500"', intent: "Technical Support", intentBg: "rgba(255,218,214,0.5)", intentColor: "#93000a", conf: 72, confColor: C.error, status: "Needs Review", statusBg: C.errorContainer, statusColor: C.onErrorContainer, dot: C.error },
  { time: "Yesterday, 16:45 PM", query: '"Where can I find the integration docs?"', intent: "Documentation", intentBg: "rgba(231,214,254,0.5)", intentColor: "#685b7d", conf: 99, confColor: C.primary, status: "Auto-Resolved", statusBg: C.primaryContainer, statusColor: C.onPrimaryContainer, dot: C.primary },
  { time: "Yesterday, 14:20 PM", query: '"My subscripton was charged twice."', intent: "Billing", intentBg: "rgba(255,218,214,0.5)", intentColor: "#93000a", conf: 92, confColor: C.error, status: "Needs Review", statusBg: C.errorContainer, statusColor: C.onErrorContainer, dot: C.error },
  { time: "Yesterday, 11:10 AM", query: '"Does the API support GraphQL?"', intent: "General Inquiry", intentBg: "rgba(186,225,221,0.5)", intentColor: "#416562", conf: 95, confColor: C.primary, status: "Auto-Resolved", statusBg: C.primaryContainer, statusColor: C.onPrimaryContainer, dot: C.primary },
  { time: "Yesterday, 09:05 AM", query: '"Can I get a refund for last month?"', intent: "Billing", intentBg: "rgba(242,211,199,0.5)", intentColor: "#715950", conf: 81, confColor: C.tertiary, status: "Escalated to Human", statusBg: C.tertiaryContainer, statusColor: C.onTertiaryContainer, dot: C.tertiary },
];

function Modal({ isOpen, onClose, title, children }: { isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      {/* Backdrop */}
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(26,28,28,0.4)", backdropFilter: "blur(8px)", animation: "fadeIn 0.3s ease" }} />
      {/* Content */}
      <div style={{ position: "relative", width: "100%", maxWidth: 1150, maxHeight: "92vh", background: C.surface, borderRadius: 24, boxShadow: "0 20px 50px rgba(0,0,0,0.15)", overflow: "hidden", display: "flex", flexDirection: "column", animation: "modalIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
        <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.surfaceVariant}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surfaceLow }}>
          <h2 style={{ fontSize: 20, fontWeight: 600, color: C.onSurface, margin: 0 }}>{title}</h2>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", color: C.outline }}>
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: 24 }}>
          {children}
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes modalIn { from{transform:scale(0.95) translateY(20px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
      `}</style>
    </div>
  );
}

function DetailedPerformancePage({ type, onBack }: { type: string; onBack: () => void }) {
  const [days, setDays] = useState(14);
  const [showPicker, setShowPicker] = useState(false);

  // Dynamic Data based on range
  const data14 = [38, 65, 87, 86, 92, 98, 93];
  const labels14 = ["Oct 1", "Oct 3", "Oct 6", "Oct 9", "Oct 12", "Oct 14"];
  
  const data7 = [86, 92, 98, 93];
  const labels7 = ["Oct 9", "Oct 11", "Oct 13", "Oct 14"];

  const currentData = days === 14 ? data14 : data7;
  const currentLabels = days === 14 ? labels14 : labels7;

  // -- Dynamic Metrics --
  const metrics = days === 14 ? [
    { label: "System Stability", value: "98.4%", trend: "+ 2.4%", up: true, bg: "rgba(186,225,221,0.2)", icon: "speed", color: C.primary },
    { label: "Anomalies", value: "12", trend: "5", up: false, bg: "rgba(242,211,199,0.3)", icon: "report_problem", color: C.tertiary },
    { label: "AI Confidence", value: "94.1%", trend: "+ 1.1%", up: true, bg: "rgba(231,214,254,0.2)", icon: "psychology", color: C.secondary },
    { label: "User Feedback", value: "4.8/5", trend: "Steady", up: false, gray: true, bg: "rgba(226,226,225,0.3)", icon: "sentiment_satisfied", color: C.onSurfaceVariant },
  ] : [
    { label: "System Stability", value: "99.1%", trend: "+ 0.7%", up: true, bg: "rgba(186,225,221,0.2)", icon: "speed", color: C.primary },
    { label: "Anomalies", value: "3", trend: "9", up: true, bg: "rgba(242,211,199,0.3)", icon: "report_problem", color: C.tertiary },
    { label: "AI Confidence", value: "96.4%", trend: "+ 2.3%", up: true, bg: "rgba(231,214,254,0.2)", icon: "psychology", color: C.secondary },
    { label: "User Feedback", value: "4.9/5", trend: "Rising", up: true, bg: "rgba(226,226,225,0.3)", icon: "sentiment_satisfied", color: C.onSurfaceVariant },
  ];

  // -- FANCY LINE MATH (Bezier Spline) --
  // We'll create a smooth path using cubic bezier curves
  const getSmoothPath = (data: number[]) => {
    const points = data.map((h, i) => ({ x: (i / (data.length - 1)) * 100, y: 100 - h }));
    let d = `M ${points[0].x},${points[0].y}`;
    
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      // Mid-point control points for smoothness
      const cp1x = p0.x + (p1.x - p0.x) / 2;
      const cp2x = p0.x + (p1.x - p0.x) / 2;
      d += ` C ${cp1x},${p0.y} ${cp2x},${p1.y} ${p1.x},${p1.y}`;
    }
    return d;
  };

  const smoothLine = getSmoothPath(currentData);
  const areaPath = `${smoothLine} L 100,100 L 0,100 Z`;

  return (
    <div style={{ animation: "fadeIn 0.4s ease-out", padding: "0 4px" }}>
      {/* Premium Header - Fully Responsive */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 40, flexWrap: "wrap", gap: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, minWidth: 300 }}>
          <button 
            onClick={onBack}
            style={{ 
              width: 48, height: 48, borderRadius: 14, border: `1px solid ${C.surfaceVariant}`, 
              background: "#fff", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
              transition: "0.2s", boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
            }}
            onMouseEnter={e => e.currentTarget.style.background = C.surfaceLow}
            onMouseLeave={e => e.currentTarget.style.background = "#fff"}
          >
            <span className="material-symbols-outlined" style={{ color: C.onSurface }}>arrow_back</span>
          </button>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.outline, fontWeight: 800, marginBottom: 4, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              <span>Analytics</span>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>chevron_right</span>
              <span style={{ color: C.primary }}>{type}</span>
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 42px)", fontWeight: 900, color: C.onSurface, margin: 0, letterSpacing: "-0.03em" }}>{type} Deep-Dive</h1>
          </div>
        </div>

        <div style={{ position: "relative" }}>
          <div 
            onClick={() => setShowPicker(!showPicker)}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 24px", background: "#fff", borderRadius: 16, border: `1px solid ${C.border}`, cursor: "pointer", userSelect: "none", boxShadow: "0 8px 20px rgba(0,0,0,0.04)" }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.primary }}>calendar_today</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: C.onSurface }}>Last {days} Days</span>
            <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.outline, transform: showPicker ? "rotate(180deg)" : "rotate(0)", transition: "0.2s" }}>expand_more</span>
          </div>
          {showPicker && (
            <div style={{ position: "absolute", top: "110%", right: 0, width: 220, background: "#fff", borderRadius: 20, boxShadow: "0 20px 50px rgba(0,0,0,0.25)", border: `1px solid ${C.surfaceVariant}`, zIndex: 100, padding: 10, animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)" }}>
              {[7, 14].map(d => (
                <div key={d} onClick={() => { setDays(d); setShowPicker(false); }} style={{ padding: "16px 20px", borderRadius: 12, cursor: "pointer", fontSize: 14, fontWeight: 800, color: days === d ? C.primary : C.onSurface, background: days === d ? C.primaryContainer : "transparent", display: "flex", justifyContent: "space-between", alignItems: "center", transition: "0.2s" }}>
                  Last {d} Days
                  {days === d && <span className="material-symbols-outlined" style={{ fontSize: 20 }}>check_circle</span>}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {/* Metric Cards Row - Responsive Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 24 }}>
          {metrics.map(item => (
            <div key={item.label} style={{ background: "#fff", padding: 32, borderRadius: 28, border: "1px solid rgba(0,0,0,0.02)", boxShadow: "0 10px 40px rgba(0,0,0,0.02)", transition: "0.3s", transform: "translateY(0)" }}
              onMouseEnter={e => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: item.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 24, color: item.color }}>{item.icon}</span>
                </div>
                <div style={{ padding: "6px 14px", borderRadius: 10, background: item.gray ? "#f4f4f2" : (item.up ? "#e8f5f4" : "#ffdad6"), display: "flex", alignItems: "center", gap: 4 }}>
                  <span className="material-symbols-outlined" style={{ fontSize: 18, color: item.gray ? C.outline : (item.up ? C.primary : C.error) }}>{item.gray ? "remove" : (item.up ? "trending_up" : "trending_down")}</span>
                  <span style={{ fontSize: 13, fontWeight: 900, color: item.gray ? C.outline : (item.up ? C.primary : C.error) }}>{item.trend}</span>
                </div>
              </div>
              <div style={{ fontSize: 14, fontWeight: 800, color: C.onSurfaceVariant, marginBottom: 8, letterSpacing: "0.02em" }}>{item.label}</div>
              <div style={{ fontSize: 36, fontWeight: 900, color: C.onSurface, letterSpacing: "-0.01em" }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Fancy Main Chart Area */}
        <div style={{ background: "#fff", borderRadius: 32, padding: 40, border: "1px solid rgba(0,0,0,0.02)", boxShadow: "0 20px 60px rgba(0,0,0,0.03)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 48 }}>
            <div>
              <h3 style={{ fontSize: 24, fontWeight: 900, color: C.onSurface, margin: 0 }}>14-Day Performance Trend</h3>
              <p style={{ fontSize: 16, color: C.outline, margin: "6px 0 0" }}>Resolution success rate vs target baseline</p>
            </div>
            <div style={{ display: "flex", gap: 32 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.primary }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.onSurfaceVariant }}>Resolution Rate</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 12, height: 12, borderRadius: "50%", background: C.surfaceLow, border: `2px dashed ${C.outline}`, boxSizing: "border-box" }} />
                <span style={{ fontSize: 13, fontWeight: 700, color: C.onSurfaceVariant }}>Target (90%)</span>
              </div>
            </div>
          </div>

            <div style={{ height: 420, position: "relative", paddingLeft: 60, paddingRight: 40, paddingBottom: 50 }}>
              {/* Y Grid */}
              {[100, 80, 60, 40, 20].map(val => (
                <React.Fragment key={val}>
                  <div style={{ position: "absolute", left: 0, top: `${100 - val}%`, transform: "translateY(-50%)", fontSize: 13, color: C.outline, fontWeight: 800 }}>{val}%</div>
                  <div style={{ position: "absolute", left: 60, right: 40, top: `${100 - val}%`, height: 1, background: C.surfaceLow, zIndex: 0 }} />
                </React.Fragment>
              ))}

            {/* Fancy SVG Line */}
            <div style={{ position: "absolute", left: 60, right: 40, top: 0, bottom: 50 }}>
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ width: "100%", height: "100%", overflow: "visible" }}>
                <defs>
                  <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                    <feGaussianBlur stdDeviation="0.2" result="blur" />
                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                  </filter>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.primary} stopOpacity="0.25" />
                    <stop offset="60%" stopColor={C.primary} stopOpacity="0.05" />
                    <stop offset="100%" stopColor={C.primary} stopOpacity="0" />
                  </linearGradient>
                </defs>

                {/* KPI Line */}
                <line x1="0" y1="15" x2="100" y2="15" stroke={C.outline} strokeWidth="0.5" strokeDasharray="4,4" opacity="0.4" />

                {/* Render Area */}
                <path d={areaPath} fill="url(#areaGrad)" />

                {/* Render Fancy Smooth Line */}
                <path 
                  d={smoothLine} 
                  fill="none" 
                  stroke={C.primary} 
                  strokeWidth="1.2" 
                  strokeLinecap="round" 
                  filter="url(#neonGlow)"
                  style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: "drawPath 2s ease-out forwards" }} 
                />

                {/* Vertical Indicator Line for Active Point */}
                {currentData.map((h, i) => {
                  const show = days === 14 ? i === 4 : i === 2;
                  if (!show) return null;
                  return (
                    <React.Fragment key={`vline-${i}`}>
                      <line 
                        x1={(i / (currentData.length - 1)) * 100} 
                        y1="0" 
                        x2={(i / (currentData.length - 1)) * 100} 
                        y2="100" 
                        stroke={C.primary} 
                        strokeWidth="0.4" 
                        strokeDasharray="4,4" 
                        opacity="0.3"
                      />
                      <circle 
                        cx={(i / (currentData.length - 1)) * 100} 
                        cy={100 - h} 
                        r="6" 
                        fill={C.primary} 
                        opacity="0.08"
                      />
                    </React.Fragment>
                  );
                })}

                {/* Data Nodes */}
                {currentData.map((h, i) => (
                  <circle 
                    key={i} 
                    cx={(i / (currentData.length - 1)) * 100} 
                    cy={100 - h} 
                    r="1.8" 
                    fill="#fff" 
                    stroke={C.primary} 
                    strokeWidth="1" 
                    style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.1))" }}
                  />
                ))}
              </svg>

              {/* Enhanced Tooltip Overlay */}
              {currentData.map((h, i) => {
                const show = days === 14 ? i === 4 : i === 2;
                if (!show) return null;
                return (
                  <div key={i} style={{ 
                    position: "absolute", left: `${(i / (currentData.length - 1)) * 100}%`, bottom: `${h}%`,
                    transform: "translate(-50%, -100%) translateY(-15px)",
                    background: "#222", color: "#fff", padding: "5px 10px", borderRadius: 8, textAlign: "center", 
                    boxShadow: "0 10px 25px rgba(0,0,0,0.4)", zIndex: 10, minWidth: 60, animation: "fadeIn 0.3s ease-out"
                  }}>
                    <div style={{ fontSize: 8, color: "rgba(255,255,255,0.6)", fontWeight: 700, marginBottom: 1 }}>{currentLabels[i]}</div>
                    <div style={{ fontSize: 13, fontWeight: 900 }}>{h + 2.8}%</div>
                    <div style={{ position: "absolute", bottom: -4, left: "50%", transform: "translateX(-50%)", width: 8, height: 8, background: "#222", rotate: "45deg" }} />
                  </div>
                );
              })}
            </div>

              <div style={{ position: "absolute", bottom: 0, left: 60, right: 40, display: "flex", justifyContent: "space-between" }}>
                {currentLabels.map(l => (
                  <div key={l} style={{ fontSize: 13, color: C.outline, fontWeight: 900, marginTop: 24 }}>{l}</div>
                ))}
              </div>
            </div>
          <style>{`
            @keyframes drawPath { to { stroke-dashoffset: 0; } }
          `}</style>
        </div>
      </div>
    </div>
  );
}

function PerformanceView() {
  const [detailedView, setDetailedView] = useState<string | null>(null);
  const [logsModal, setLogsModal] = useState(false);
  const [filter, setFilter] = useState("All");

  const filteredLogs = filter === "All" ? LOGS : LOGS.filter(l => l.status === filter);

  if (detailedView) {
    return (
      <main style={{ flex: 1, overflowY: "auto", padding: 48, background: C.bg }}>
        <div style={{ maxWidth: 1300, margin: "0 auto" }}>
          <DetailedPerformancePage type={detailedView} onBack={() => setDetailedView(null)} />
        </div>
      </main>
    );
  }

  return (
    <main style={{ flex: 1, overflowY: "auto", padding: 32, background: C.bg }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", flexDirection: "column", gap: 32 }}>
        <div>
          <h1 style={{ fontSize: 32, fontWeight: 600, color: C.onSurface, margin: 0 }}>AI Performance</h1>
          <p style={{ fontSize: 16, color: C.onSurfaceVariant, margin: "6px 0 0" }}>Monitor your agent's success metrics and decision logic in real-time.</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 24 }}>
          {[
            { bg: C.primaryContainer, blurBg: C.primaryFixed, borderColor: "rgba(195,234,230,0.2)", icon: "check_circle", iconBg: C.onPrimary, iconColor: C.onPrimaryContainer, title: "Resolution Rate", value: "94.2%", valueColor: C.onPrimaryContainer, trend: "+2.4% this week", trendIcon: "trending_up", trendBg: "rgba(255,255,255,0.4)", trendColor: C.primary },
            { bg: C.secondaryContainer, blurBg: C.secondaryFixed, borderColor: "rgba(236,220,255,0.2)", icon: "group_add", iconBg: C.onSecondary, iconColor: "#685b7d", title: "Leads Captured", value: "1,284", valueColor: "#211633", trend: "+12% this week", trendIcon: "trending_up", trendBg: "rgba(255,255,255,0.4)", trendColor: C.secondary },
            { bg: C.tertiaryContainer, blurBg: C.tertiaryFixed, borderColor: "rgba(252,220,208,0.2)", icon: "monetization_on", iconBg: C.onTertiary, iconColor: "#574239", title: "Conversion Rate", value: "18.5%", valueColor: C.onTertiaryContainer, trend: "Steady", trendIcon: "trending_flat", trendBg: "rgba(255,255,255,0.4)", trendColor: C.tertiary },
          ].map((card) => (
            <div key={card.title}
              onClick={() => setDetailedView(card.title)}
              style={{
                background: card.bg, borderRadius: 12, padding: 24, border: `1px solid ${card.borderColor}`,
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)", position: "relative", overflow: "hidden", cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)", transform: "translateY(0)"
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)" }}
              onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)" }}
            >
              <div style={{ position: "absolute", right: -24, top: -24, width: 100, height: 100, borderRadius: "50%", background: card.blurBg, opacity: 0.5, filter: "blur(20px)", pointerEvents: "none" }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: card.iconBg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span className="material-symbols-outlined fill" style={{ fontSize: 20, color: card.iconColor }}>{card.icon}</span>
                  </div>
                  <h3 style={{ fontSize: 20, fontWeight: 500, color: card.iconColor, margin: 0 }}>{card.title}</h3>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", position: "relative" }}>
                <div>
                  <div style={{ fontSize: 48, fontWeight: 600, color: card.valueColor, lineHeight: 1.1 }}>{card.value}</div>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, background: card.trendBg, padding: "4px 10px", borderRadius: 9999 }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 14, color: card.trendColor }}>{card.trendIcon}</span>
                    <span style={{ fontSize: 11, fontWeight: 500, color: card.trendColor }}>{card.trend}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Logs Table */}
        <Card>
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center", background: C.surfaceLow }}>
            <div>
              <h2 style={{ fontSize: 24, fontWeight: 500, color: C.onSurface, margin: 0 }}>AI Reasoning Logs</h2>
              <p style={{ fontSize: 14, color: C.onSurfaceVariant, margin: "4px 0 0" }}>Detailed breakdown of recent agent interactions.</p>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {["All", "Auto-Resolved", "Needs Review", "Escalated to Human"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{
                  padding: "6px 12px", border: `1px solid ${filter === f ? C.primary : C.border}`,
                  borderRadius: 6, fontSize: 11, fontWeight: 700, cursor: "pointer",
                  background: filter === f ? C.primaryContainer : C.surface,
                  color: filter === f ? C.primary : C.onSurfaceVariant
                }}>
                  {f === "All" ? "Clear Filter" : f}
                </button>
              ))}
            </div>
          </div>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: C.surface, borderBottom: `1px solid ${C.border}` }}>
                {["Timestamp", "User Query Fragment", "Detected Intent", "Confidence", "Resolution Status", ""].map(h => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.onSurfaceVariant }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredLogs.map((log, i) => (
                <tr key={i} style={{ borderBottom: `1px solid rgba(192,200,198,0.3)` }}>
                  <td style={{ padding: "14px 20px", fontSize: 14, color: C.onSurfaceVariant }}>{log.time}</td>
                  <td style={{ padding: "14px 20px", fontSize: 14, fontWeight: 500, color: C.onSurface }}>{log.query}</td>
                  <td style={{ padding: "14px 20px" }}>
                    <span style={{ padding: "4px 10px", background: log.intentBg, color: log.intentColor, borderRadius: 4, fontSize: 12, fontWeight: 700 }}>{log.intent}</span>
                  </td>
                  <td style={{ padding: "14px 20px" }}>{log.conf}%</td>
                  <td style={{ padding: "14px 20px" }}>{log.status}</td>
                  <td style={{ padding: "14px 20px", textAlign: "right" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 20, color: C.outline }}>chevron_right</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ padding: 16, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "center" }}>
            <button onClick={() => setLogsModal(true)} style={{ background: "none", border: "none", color: C.primary, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>View All Logs</button>
          </div>
        </Card>

        {/* Modals */}
        <Modal isOpen={logsModal} onClose={() => setLogsModal(false)} title="Full Reasoning History">
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {[...LOGS, ...LOGS].map((log, i) => (
              <div key={i} style={{ padding: 16, background: C.surfaceLow, borderRadius: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.onSurface }}>{log.query}</div>
                  <div style={{ fontSize: 11, color: C.outline }}>{log.time} • Confidence: {log.conf}%</div>
                </div>
                <span style={{ padding: "4px 10px", background: log.statusBg, color: log.statusColor, borderRadius: 9999, fontSize: 10, fontWeight: 700 }}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </Modal>
      </div>
    </main>
  );
}

/* ─── Settings ────────────────────────────────────────────────────────────── */
function SettingsView() {
  const [subTab, setSubTab] = useState("account");
  const [saveStatus, setSaveStatus] = useState<string | null>(null);

  const SETTINGS_NAV = [
    { id: "account", label: "My Account", icon: "person" },
    { id: "security", label: "Security", icon: "shield" },
    { id: "developers", label: "Developers", icon: "terminal" },
    { id: "notifications", label: "Notifications", icon: "notifications" },
  ];

  const triggerSave = () => {
    setSaveStatus("Saving...");
    setTimeout(() => {
      setSaveStatus("Success! Changes applied.");
      setTimeout(() => setSaveStatus(null), 3000);
    }, 1200);
  };

  return (
    <main style={{ flex: 1, overflow: "hidden", background: C.bg, display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <div style={{ padding: "32px 32px 24px", background: C.bg }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: C.onSurface, margin: 0 }}>Settings</h1>
        <p style={{ fontSize: 16, color: C.onSurfaceVariant, margin: "6px 0 0" }}>Configure your personal profile and workspace security.</p>
      </div>

      <div style={{ flex: 1, display: "flex", padding: "0 32px 32px", gap: 32, overflow: "hidden" }}>
        {/* Settings Sidebar */}
        <div style={{ width: 220, flexShrink: 0, display: "flex", flexDirection: "column", gap: 4 }}>
          {SETTINGS_NAV.map(item => {
            const isActive = subTab === item.id;
            return (
              <button key={item.id} onClick={() => setSubTab(item.id)} style={{
                display: "flex", alignItems: "center", gap: 12, padding: "12px 16px", borderRadius: 12,
                border: "none", cursor: "pointer", fontSize: 14, fontWeight: isActive ? 700 : 500,
                background: isActive ? C.primaryContainer : "transparent",
                color: isActive ? C.primary : C.onSurfaceVariant,
                fontFamily: "Lexend, sans-serif", textAlign: "left", transition: "all 0.2s"
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: 20 }}>{item.icon}</span>
                {item.label}
              </button>
            );
          })}
        </div>

        {/* Settings Content */}
        <div style={{ flex: 1, background: C.surface, borderRadius: 24, border: `1px solid ${C.border}`, display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
          <div style={{ flex: 1, overflowY: "auto", padding: 32 }}>

            {subTab === "account" && (
              <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 12 }}>Profile Details</h2>
                  <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 24 }}>
                    <div style={{ width: 80, height: 80, borderRadius: 24, background: "linear-gradient(135deg, #416562, #bae1dd)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 32, fontWeight: 900 }}>SA</div>
                    <div>
                      <button style={{ padding: "8px 16px", background: C.primary, color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Upload New Avatar</button>
                      <div style={{ fontSize: 12, color: C.outline, marginTop: 8 }}>JPG, GIF or PNG. Max size of 800K.</div>
                    </div>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Full Name</label>
                      <input defaultValue="Super Admin" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "Lexend, sans-serif" }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Phone Number</label>
                      <input defaultValue="+62 812-3456-7890" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "Lexend, sans-serif" }} />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 12 }}>Workspace</h2>
                  <div>
                    <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Organization Name</label>
                    <input defaultValue="Hermes AI Enterprise" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14, fontFamily: "Lexend, sans-serif" }} />
                  </div>
                </div>
              </div>
            )}

            {subTab === "security" && (
              <div style={{ maxWidth: 500, display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>Password Reset</h2>
                  <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 24 }}>Ensure your account is using a long, random password to stay secure.</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Current Password</label>
                      <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
                    </div>
                    <div style={{ height: 1, background: C.surfaceVariant }} />
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>New Password</label>
                      <input type="password" placeholder="Min 8 characters" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: C.onSurfaceVariant, marginBottom: 8 }}>Confirm New Password</label>
                      <input type="password" placeholder="••••••••" style={{ width: "100%", padding: "12px", border: `1px solid ${C.border}`, borderRadius: 10, fontSize: 14 }} />
                    </div>
                  </div>
                </div>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 12 }}>Two-Factor Authentication</h2>
                  <div style={{ padding: 20, border: `1px solid ${C.tertiaryContainer}`, borderRadius: 16, background: "rgba(242, 211, 199, 0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.tertiary }}>Enhanced Security</div>
                      <div style={{ fontSize: 12, color: C.onTertiaryContainer, marginTop: 4 }}>Add an extra layer of security to your account.</div>
                    </div>
                    <button style={{ padding: "8px 16px", background: "#fff", border: `1px solid ${C.tertiary}`, color: C.tertiary, borderRadius: 8, fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Enable 2FA</button>
                  </div>
                </div>
              </div>
            )}

            {subTab === "developers" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>API & Integration Keys</h2>
                  <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 24 }}>Use these keys to authenticate your server-side requests to the Hermes API.</p>
                  
                  <div style={{ border: `1px solid ${C.border}`, borderRadius: 16, overflow: "hidden" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead style={{ background: C.surfaceLow }}>
                        <tr>
                          {["Name", "Key Preview", "Created", "Status", ""].map(h => (
                            <th key={h} style={{ padding: "12px 20px", textAlign: "left", fontSize: 11, fontWeight: 700, color: C.onSurfaceVariant, letterSpacing: "0.06em" }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "Production App", key: "hr_live_••••••••w9ak", date: "Apr 21, 2026", status: "Active" },
                          { name: "Staging Test", key: "hr_test_••••••••m2p7", date: "Apr 14, 2026", status: "Active" },
                        ].map((k, i) => (
                          <tr key={i} style={{ borderTop: `1px solid ${C.surfaceVariant}` }}>
                            <td style={{ padding: "16px 20px", fontSize: 14, fontWeight: 600 }}>{k.name}</td>
                            <td style={{ padding: "16px 20px", fontSize: 13, fontFamily: "monospace", color: C.outline }}>{k.key}</td>
                            <td style={{ padding: "16px 20px", fontSize: 13, color: C.onSurfaceVariant }}>{k.date}</td>
                            <td style={{ padding: "16px 20px" }}>
                              <span style={{ padding: "4px 10px", background: C.primaryContainer, color: C.primary, fontSize: 11, fontWeight: 700, borderRadius: 6 }}>{k.status}</span>
                            </td>
                            <td style={{ padding: "16px 20px", textAlign: "right" }}>
                              <button style={{ background: "none", border: "none", cursor: "pointer", color: C.outline }}><span className="material-symbols-outlined">more_horiz</span></button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <button style={{ marginTop: 16, display: "flex", alignItems: "center", gap: 8, background: "none", border: `1px solid ${C.primary}`, color: C.primary, padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    <span className="material-symbols-outlined" style={{ fontSize: 18 }}>add</span> Create New API Key
                  </button>
                </div>
              </div>
            )}

            {subTab === "notifications" && (
              <div style={{ maxWidth: 600, display: "flex", flexDirection: "column", gap: 32 }}>
                <div>
                  <h2 style={{ fontSize: 22, fontWeight: 600, color: C.onSurface, marginBottom: 8 }}>Email Notifications</h2>
                  <p style={{ fontSize: 14, color: C.onSurfaceVariant, marginBottom: 24 }}>Manage when and how often you receive emails from the platform.</p>
                  
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {[
                      { title: "Customer Escalations", desc: "Get notified when a bot fails and a human is needed.", enabled: true },
                      { title: "Daily Performance Digest", desc: "A summary of yesterday's resolution and conversion metrics.", enabled: true },
                      { title: "Security Alerts", desc: "Login attempts and API key rotations.", enabled: true },
                    ].map(n => (
                      <div key={n.title} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0", borderBottom: `1px solid ${C.surfaceVariant}` }}>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: 15, color: C.onSurface }}>{n.title}</div>
                          <div style={{ fontSize: 13, color: C.onSurfaceVariant, marginTop: 2 }}>{n.desc}</div>
                        </div>
                        <div style={{ width: 44, height: 24, borderRadius: 24, background: n.enabled ? C.primary : C.surfaceVariant, position: "relative", cursor: "pointer" }}>
                          <div style={{ position: "absolute", right: n.enabled ? 4 : 24, top: 4, width: 16, height: 16, borderRadius: "50%", background: "#fff", transition: "all 0.2s" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Footer Save Actions */}
          <div style={{ padding: "20px 32px", background: C.surfaceLow, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 16 }}>
            {saveStatus && <div style={{ fontSize: 13, fontWeight: 600, color: saveStatus.includes("Success") ? C.primary : C.outline }}>{saveStatus}</div>}
            <button style={{ padding: "10px 20px", background: "none", border: "none", color: C.onSurfaceVariant, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>Discard</button>
            <button onClick={triggerSave} style={{ padding: "10px 24px", background: C.primary, color: "#fff", border: "none", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 12px rgba(65, 101, 98, 0.2)" }}>Save Changes</button>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─── Root ────────────────────────────────────────────────────────────────── */
const PLACEHOLDERS: Record<string, string> = {
  inbox: "Search across OS...",
  performance: "Search logs, agents...",
  integrations: "Search integrations...",
  knowledge: "Search knowledge base...",
  settings: "Search settings...",
};

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [tab, setTab] = useState("inbox");

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login");
    }
  }, [user, isLoading, router]);

  // Loading spinner while checking stored session
  if (isLoading) {
    return (
      <div style={{ height: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: C.bg, fontFamily: "Lexend, sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: C.primary, animation: "spin 1s linear infinite" }}>progress_activity</span>
          <p style={{ color: C.onSurfaceVariant, fontSize: 16, marginTop: 12 }}>Loading Agent Core...</p>
        </div>
        <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div style={{ display: "flex", height: "100vh", background: C.bg, fontFamily: "Lexend, sans-serif", overflow: "hidden", color: C.onSurface }}>
      <Sidebar active={tab} onSelect={setTab} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, height: "100vh", overflow: "hidden" }}>
        <TopBar placeholder={PLACEHOLDERS[tab]} />
        {tab === "inbox" && <InboxView />}
        {tab === "performance" && <PerformanceView />}
        {tab === "integrations" && <IntegrationsView />}
        {tab === "knowledge" && <KnowledgeBaseView />}
        {tab === "settings" && <SettingsView />}
      </div>
    </div>
  );
}
