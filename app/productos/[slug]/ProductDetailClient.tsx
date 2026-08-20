"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import type { Product } from "@/components/ProductCard";
import Viewer3D from "@/components/Viewer3D";

const WA_NUMBER = "5491131074381";

const COLOR_MAP: Record<string, string> = {
  blanco: "#FFFFFF",
  negro: "#111111",
  celeste: "#38BDF8",
  oro: "#D4A017",
  dorado: "#D4A017",
  beige: "#E5C5A0",
  rojo: "#EF4444",
  amarillo: "#F9D923",
  rosa: "#F472B6",
  verde: "#22C55E",
  natural: "#D4C5A0",
  naranja: "#F97316",
  piedra: "#9CA3AF",
  gris: "#9CA3AF",
  "verde-neon": "#39FF14",
};

const CATEGORY_LABELS: Record<string, string> = {
  "cuadros-tripticos": "Cuadros y Trípticos",
  "decoracion-esculturas": "Decoración y Esculturas",
  macetas: "Macetas",
  "animales-decorativos": "Animales Decorativos",
};

const LIGHT_COLORS = new Set(["blanco", "amarillo", "beige", "natural"]);

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

function buildWALink(name: string, code: string): string {
  const msg = `Hola! Me interesa ${name} (código ${code}). ¿Tienen disponibilidad y precio?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function ProductDetailClient({ product }: { product: Product }) {
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(product.colors[0] ?? null);
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [show3D, setShow3D] = useState(false);
  const viewerRef = useRef<any>(null);

  async function handleShare() {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product.name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      setShareStatus("copied");
      setTimeout(() => setShareStatus("idle"), 2000);
    }
  }

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const waLink = buildWALink(product.name, product.code);
  const priceStr = formatPrice(product.price);
  const hasImage = !imgError && product.images[0];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#FFFFFF", color: "#1A1A1A" }}>

      {/* NAV */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{ backgroundColor: "#FFFFFF", borderBottom: "1px solid #F3F4F6" }}
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#2563EB]"
          style={{ color: "#9CA3AF" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M19 12H5"/><path d="M12 19l-7-7 7-7"/>
          </svg>
          Catálogo
        </button>
        <span style={{ color: "#E5E7EB" }}>/</span>
        <span className="text-sm truncate max-w-[180px] sm:max-w-xs" style={{ color: "#6B7280" }}>
          {product.name}
        </span>
      </div>

      {/* CONTENT */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col gap-6">

        {/* IMAGE */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{ aspectRatio: "1/1", backgroundColor: "#F9FAFB", border: "1px solid #F3F4F6" }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-contain p-6"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                <path d="M2 17l10 5 10-5"/>
                <path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "#6B7280", border: "1px solid #E5E7EB" }}
            >
              {categoryLabel}
            </span>
            {product.has3DModel && (
              <span className="text-xs font-black px-2.5 py-1 rounded-full" style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}>
                3D
              </span>
            )}
          </div>
        </div>

        {/* 3D VIEWER */}
        {show3D && product.has3DModel && product.modelPath && (
          <div className="flex flex-col gap-3">
            <Viewer3D modelPath={product.modelPath} productName={product.name} />
            <button
              onClick={() => setShow3D(false)}
              className="self-center flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-all hover:opacity-80"
              style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", color: "#9CA3AF" }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6L6 18"/><path d="M6 6l12 12"/>
              </svg>
              Cerrar visor
            </button>
          </div>
        )}

        {/* NAME + PRICE */}
        <div className="flex flex-col gap-1">
          <p className="text-xs tracking-widest uppercase" style={{ color: "#9CA3AF" }}>{product.code}</p>
          <h1 className="text-2xl sm:text-3xl font-black leading-tight" style={{ color: "#1A1A1A" }}>
            {product.name}
          </h1>
          <div className="flex items-baseline gap-0.5 mt-2">
            <sup className="text-sm font-bold" style={{ color: "#1A1A1A", marginBottom: "2px" }}>$</sup>
            <span className="text-3xl font-black" style={{ color: "#1A1A1A" }}>{priceStr}</span>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #F3F4F6" }} />

        {/* DIMENSIONS */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ backgroundColor: "#F9FAFB", border: "1px solid #F3F4F6" }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round">
            <path d="M21 3H3v18h18V3z"/><path d="M3 9h18"/><path d="M9 21V9"/>
          </svg>
          <div>
            <p className="text-[10px] uppercase tracking-widest" style={{ color: "#9CA3AF" }}>Dimensiones</p>
            <p className="text-sm font-semibold" style={{ color: "#1A1A1A" }}>{product.dimensions}</p>
          </div>
        </div>

        {/* DESCRIPTION */}
        {product.description && (
          <div className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#9CA3AF" }}>Descripción</p>
            <p className="text-sm leading-relaxed" style={{ color: "#6B7280" }}>{product.description}</p>
          </div>
        )}

        {/* COLORS */}
        {product.colors.length > 0 && (
          <div className="flex flex-col gap-3">
            <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#9CA3AF" }}>
              Color{selectedColor && <span className="normal-case tracking-normal font-normal ml-1" style={{ color: "#2563EB" }}>· {selectedColor}</span>}
            </p>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const hex = COLOR_MAP[color.toLowerCase()];
                const isSelected = selectedColor === color;
                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className="relative w-9 h-9 rounded-full transition-all duration-150 active:scale-90 cursor-pointer"
                    style={{
                      background: hex ?? "#888",
                      border: isSelected ? "2px solid #1A1A1A" : "2px solid #E5E7EB",
                      boxShadow: isSelected ? "0 0 0 3px rgba(26,26,26,0.15)" : "none",
                    }}
                  >
                    {isSelected && (
                      <span className="absolute inset-0 flex items-center justify-center" style={{ color: LIGHT_COLORS.has(color) ? "#000" : "#fff" }}>
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                          <path d="M20 6L9 17l-5-5"/>
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <div style={{ borderTop: "1px solid #F3F4F6" }} />

        {/* SHARE */}
        <div className="flex flex-col gap-2">
          <p className="text-xs uppercase tracking-widest font-semibold" style={{ color: "#9CA3AF" }}>Compartir producto</p>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 self-start text-sm font-medium px-4 py-2.5 rounded-xl transition-all hover:opacity-80"
            style={{ backgroundColor: "#F9FAFB", border: "1px solid #E5E7EB", color: shareStatus === "copied" ? "#2563EB" : "#6B7280" }}
          >
            {shareStatus === "copied" ? (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#2563EB" strokeWidth="2" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>¡Link copiado!</>
            ) : (
              <><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>Compartir</>
            )}
          </button>
        </div>

        {/* CTA BUTTONS */}
        <div className="flex flex-col gap-3 pt-2">
          {product.has3DModel && !show3D && (
            <button
              onClick={() => setShow3D(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
              style={{ backgroundColor: "transparent", border: "1.5px solid #1A1A1A", color: "#1A1A1A" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
              Ver en 3D
            </button>
          )}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#25D366", color: "#fff" }}
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
