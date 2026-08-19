"use client";

import { notFound, useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { useState } from "react";
import type { Product } from "@/components/ProductCard";
import Viewer3D from "@/components/Viewer3D";
import productsData from "@/data/products.json";

// ─── Constants ────────────────────────────────────────────────────────────────

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
  terracota: "#C2603F",
  colores: "conic-gradient(red, yellow, lime, cyan, blue, magenta, red)",
};

const CATEGORY_LABELS: Record<string, string> = {
  "cuadros-tripticos": "Cuadros y Trípticos",
  "decoracion-esculturas": "Decoración y Esculturas",
  macetas: "Macetas",
  "animales-decorativos": "Animales Decorativos",
};

const LIGHT_COLORS = new Set(["blanco", "amarillo", "beige", "natural"]);

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

function buildWALink(name: string, code: string): string {
  const msg = `Hola! Me interesa ${name} (código ${code}). ¿Tienen disponibilidad y precio?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const slug =
    typeof params?.slug === "string"
      ? params.slug
      : Array.isArray(params?.slug)
      ? params.slug[0]
      : "";

  const product = (productsData.products as Product[]).find(
    (p) => p.slug === slug && p.active
  );

  if (!product) {
    notFound();
  }

  const [imgError, setImgError] = useState(false);
  const [selectedColor, setSelectedColor] = useState<string | null>(
    product.colors[0] ?? null
  );
  const [shareStatus, setShareStatus] = useState<"idle" | "copied">("idle");
  const [show3D, setShow3D] = useState(false);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: product!.name,
      text: `Mirá este producto de 3D San Vicente: ${product!.name}`,
      url,
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled — no-op
      }
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
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: "#0A0A0A", color: "#F8F8F8" }}
    >
      {/* ── Top nav bar ─────────────────────────────────────────────── */}
      <div
        className="sticky top-0 z-40 flex items-center gap-3 px-4 py-3"
        style={{
          backgroundColor: "rgba(10,10,10,0.92)",
          borderBottom: "1px solid #1A1A1A",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
        }}
      >
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-[#38BDF8]"
          style={{ color: "#888" }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Catálogo
        </button>

        <span style={{ color: "#2A2A2A" }}>/</span>

        <span
          className="text-sm truncate max-w-[180px] sm:max-w-xs"
          style={{ color: "#555" }}
        >
          {product.name}
        </span>
      </div>

      {/* ── Content ─────────────────────────────────────────────────── */}
      <main className="flex-1 w-full max-w-2xl mx-auto px-4 pt-6 pb-16 flex flex-col gap-6">

        {/* ── IMAGE ─────────────────────────────────────────────────── */}
        <div
          className="relative w-full rounded-2xl overflow-hidden"
          style={{
            aspectRatio: "1 / 1",
            backgroundColor: "#161616",
            border: "1px solid #2A2A2A",
          }}
        >
          {hasImage ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 672px) 100vw, 672px"
              className="object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-3">
              <svg
                width="56"
                height="56"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.25}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span
                className="text-xs tracking-widest uppercase"
                style={{ color: "#333" }}
              >
                3D San Vicente
              </span>
            </div>
          )}

          {/* Badges overlay */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="text-xs font-semibold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(10,10,10,0.75)",
                color: "#38BDF8",
                border: "1px solid rgba(56,189,248,0.3)",
                backdropFilter: "blur(8px)",
              }}
            >
              {categoryLabel}
            </span>

            {product.has3DModel && (
              <span
                className="text-xs font-black px-2.5 py-1 rounded-full"
                style={{ backgroundColor: "#38BDF8", color: "#000" }}
              >
                3D
              </span>
            )}
          </div>
        </div>

        {/* ── 3D VIEWER ─────────────────────────────────────────────── */}
        {show3D && product.has3DModel && product.modelPath && (
          <div className="flex flex-col gap-3">
            <Viewer3D
              modelPath={product.modelPath}
              productName={product.name}
            />
            <button
              onClick={() => setShow3D(false)}
              className="self-center flex items-center gap-1.5 text-xs font-medium px-4 py-2 rounded-xl transition-all duration-200 hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: "#1A1A1A",
                border: "1px solid #2A2A2A",
                color: "#666",
              }}
            >
              <svg
                width="13"
                height="13"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M18 6L6 18" />
                <path d="M6 6l12 12" />
              </svg>
              Cerrar visor
            </button>
          </div>
        )}

        {/* ── NAME + PRICE ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <p
            className="text-xs tracking-[0.2em] uppercase"
            style={{ color: "#555" }}
          >
            {product.code}
          </p>

          <h1
            className="text-2xl sm:text-3xl font-black leading-tight"
            style={{ color: "#F8F8F8" }}
          >
            {product.name}
          </h1>

          {/* Price */}
          <div className="flex items-baseline gap-1 mt-1">
            <sup
              className="text-sm font-bold"
              style={{ color: "#38BDF8", lineHeight: 1, marginBottom: "2px" }}
            >
              $
            </sup>
            <span
              className="text-3xl font-black"
              style={{
                color: "#F8F8F8",
                textShadow: "0 0 24px rgba(56,189,248,0.15)",
              }}
            >
              {priceStr}
            </span>
          </div>
        </div>

        {/* ── DIVIDER ───────────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #1A1A1A" }} />

        {/* ── DIMENSIONS ────────────────────────────────────────────── */}
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{
            backgroundColor: "#161616",
            border: "1px solid #2A2A2A",
          }}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#38BDF8"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="shrink-0"
            opacity={0.8}
          >
            <path d="M21 3H3v18h18V3z" />
            <path d="M3 9h18" />
            <path d="M9 21V9" />
          </svg>
          <div className="flex flex-col">
            <span
              className="text-[10px] uppercase tracking-widest"
              style={{ color: "#555" }}
            >
              Dimensiones
            </span>
            <span className="text-sm font-semibold" style={{ color: "#F8F8F8" }}>
              {product.dimensions}
            </span>
          </div>
        </div>

        {/* ── DESCRIPTION ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "#555" }}
          >
            Descripción
          </h2>
          <p className="text-sm leading-relaxed" style={{ color: "#A0A0A0" }}>
            {product.description}
          </p>
        </div>

        {/* ── COLOR SELECTOR ────────────────────────────────────────── */}
        {product.colors.length > 0 && (
          <div className="flex flex-col gap-3">
            <h2
              className="text-xs uppercase tracking-widest font-semibold"
              style={{ color: "#555" }}
            >
              Color{" "}
              {selectedColor && (
                <span
                  className="normal-case tracking-normal font-normal ml-1"
                  style={{ color: "#38BDF8" }}
                >
                  · {selectedColor}
                </span>
              )}
            </h2>
            <div className="flex flex-wrap gap-3">
              {product.colors.map((color) => {
                const hex = COLOR_MAP[color.toLowerCase()];
                const isSelected = selectedColor === color;
                const isGradient = hex?.startsWith("conic-gradient");

                return (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    title={color}
                    className="relative w-9 h-9 rounded-full transition-all duration-150 active:scale-90 cursor-pointer"
                    style={{
                      background: isGradient ? hex : (hex ?? "#888"),
                      border: isSelected
                        ? "2px solid #38BDF8"
                        : "2px solid #2A2A2A",
                      boxShadow: isSelected
                        ? "0 0 0 3px rgba(56,189,248,0.25)"
                        : "none",
                    }}
                  >
                    {isSelected && (
                      <span
                        className="absolute inset-0 flex items-center justify-center"
                        style={{
                          color: LIGHT_COLORS.has(color) ? "#000" : "#fff",
                        }}
                      >
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── DIVIDER ───────────────────────────────────────────────── */}
        <div style={{ borderTop: "1px solid #1A1A1A" }} />

        {/* ── SHARE ─────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2">
          <h2
            className="text-xs uppercase tracking-widest font-semibold"
            style={{ color: "#555" }}
          >
            Compartir producto
          </h2>
          <button
            onClick={handleShare}
            className="flex items-center gap-2 self-start text-sm font-medium px-4 py-2.5 rounded-xl transition-all duration-200 hover:opacity-80 active:scale-95"
            style={{
              backgroundColor: "#1A1A1A",
              border: "1px solid #2A2A2A",
              color: shareStatus === "copied" ? "#38BDF8" : "#A0A0A0",
            }}
          >
            {shareStatus === "copied" ? (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#38BDF8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
                ¡Link copiado!
              </>
            ) : (
              <>
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
                Compartir
              </>
            )}
          </button>
        </div>

        {/* ── CTA BUTTONS ───────────────────────────────────────────── */}
        <div className="flex flex-col gap-3 pt-2">
          {/* Ver en 3D — only show when viewer is closed */}
          {product.has3DModel && !show3D && (
            <button
              onClick={() => setShow3D(true)}
              className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
              style={{
                backgroundColor: "transparent",
                border: "2px solid #38BDF8",
                color: "#38BDF8",
              }}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              Ver en 3D
            </button>
          )}

          {/* WhatsApp CTA */}
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-[0.98]"
            style={{ backgroundColor: "#25D366", color: "#fff" }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
            </svg>
            Consultar por WhatsApp
          </a>
        </div>
      </main>
    </div>
  );
}
