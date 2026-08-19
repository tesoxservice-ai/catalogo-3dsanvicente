"use client";
import { useState, useEffect, useRef } from "react";
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}
interface Viewer3DProps {
  modelPath: string;
  productName: string;
}
export default function Viewer3D({ modelPath, productName }: Viewer3DProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const viewerRef = useRef<any>(null);
  useEffect(() => {
    if (!customElements.get("model-viewer")) {
      import("@google/model-viewer").catch(() => setError(true));
    }
  }, []);
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) return;
    const handleLoad = () => setLoading(false);
    const handleError = () => { setLoading(false); setError(true); };
    viewer.addEventListener("load", handleLoad);
    viewer.addEventListener("error", handleError);
    return () => {
      viewer.removeEventListener("load", handleLoad);
      viewer.removeEventListener("error", handleError);
    };
  }, []);
  return (
    <div style={{ position: "relative", width: "100%", height: "400px", backgroundColor: "#161616", border: "1px solid #2A2A2A", borderRadius: "16px", overflow: "hidden" }}>
      {loading && !error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "12px", backgroundColor: "#161616", zIndex: 10, pointerEvents: "none" }}>
          <div style={{ width: "40px", height: "40px", border: "2px solid #2A2A2A", borderTop: "2px solid #38BDF8", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: "#555", fontSize: "11px", letterSpacing: "0.2em", textTransform: "uppercase" }}>Cargando modelo 3D...</p>
        </div>
      )}
      {error && (
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "8px", backgroundColor: "#161616" }}>
          <p style={{ color: "#555", fontSize: "13px" }}>No se pudo cargar el modelo</p>
          <button onClick={() => { setError(false); setLoading(true); }} style={{ color: "#38BDF8", fontSize: "12px", background: "none", border: "none", cursor: "pointer" }}>Reintentar</button>
        </div>
      )}
      <model-viewer ref={viewerRef} src={modelPath} alt={productName} auto-rotate="" camera-controls="" shadow-intensity="1" exposure="0.85" rotation-per-second="30deg" interaction-prompt="none" loading="eager" style={{ width: "100%", height: "100%", backgroundColor: "#161616" }} />
      {!loading && !error && (
        <div style={{ position: "absolute", top: "12px", left: "12px", fontSize: "10px", color: "#555", letterSpacing: "0.2em", textTransform: "uppercase", backgroundColor: "rgba(10,10,10,0.7)", padding: "4px 8px", borderRadius: "8px", border: "1px solid #1A1A1A" }}>Arrastrar · Zoom</div>
      )}
    </div>
  );
}