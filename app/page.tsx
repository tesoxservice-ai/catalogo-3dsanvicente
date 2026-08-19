"use client";

import { useState, useMemo } from "react";
import ProductCard, { type Product } from "@/components/ProductCard";
import {
  type CategoryId,
  CATEGORIES,
} from "@/components/CategoryFilter";
import productsData from "@/data/products.json";

const WA_NUMBER = "5491131074381";
const WA_LINK = `https://wa.me/${WA_NUMBER}`;
const INSTAGRAM = "https://www.instagram.com/3D.SanVicente";

const allProducts: Product[] = (productsData.products as Product[]).filter(
  (p) => p.active
);

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>("todos");

  const filtered = useMemo(() => {
    if (activeCategory === "todos") return allProducts;
    return allProducts.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  const activeLabel =
    CATEGORIES.find((c) => c.id === activeCategory)?.label ?? "Todos";

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0A0A0A", color: "#F8F8F8" }}>

      {/* HERO — identidad + título */}
      <section
        className="pt-16 pb-10 px-4 text-center relative overflow-hidden"
        style={{ borderBottom: "1px solid #1A1A1A" }}
      >
        {/* Glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(56,189,248,0.07) 0%, transparent 70%)" }}
        />

        {/* Nombre de la empresa */}
        <p
          className="text-xs font-bold tracking-[0.4em] uppercase mb-3"
          style={{ color: "#38BDF8" }}
        >
        </p>

        {/* Título principal */}
        <h1
          className="text-4xl sm:text-5xl font-black leading-none tracking-tight mb-3 relative"
          style={{ color: "#F8F8F8" }}
        >
          Impresiones 3D{" "}
          <span style={{ color: "#38BDF8", textShadow: "0 0 40px rgba(56,189,248,0.35)" }}>
            San Vicente
          </span>
        </h1>
        {/* Botón WhatsApp en el hero */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#25D366", color: "#fff" }}
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
          </svg>
          Consultar por WhatsApp
        </a>
      </section>

      {/* CATEGORÍAS */}
      <div style={{ backgroundColor: "#0D0D0D", borderBottom: "1px solid #1A1A1A" }}>
        <div className="max-w-screen-xl mx-auto px-4 py-3">
          <div className="flex items-center gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
            <style>{`.cat-hide::-webkit-scrollbar{display:none}`}</style>
            {CATEGORIES.map((cat) => {
              const isActive = cat.id === activeCategory;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className="cat-hide whitespace-nowrap px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-200 shrink-0"
                  style={
                    isActive
                      ? { backgroundColor: "#38BDF8", color: "#000", fontWeight: 700 }
                      : { backgroundColor: "#161616", color: "#666", border: "1px solid #222" }
                  }
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* PRODUCTOS */}
      <main className="flex-1 w-full max-w-screen-xl mx-auto px-4 pt-8 pb-16">
        <div className="flex items-center justify-between mb-5">
          <p className="text-xs" style={{ color: "#444" }}>
            <span style={{ color: "#F8F8F8", fontWeight: 600 }}>{filtered.length}</span>{" "}
            producto{filtered.length !== 1 ? "s" : ""} · {activeLabel}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center py-24 gap-4 rounded-xl"
            style={{ border: "1px dashed #2A2A2A" }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#38BDF8" strokeWidth="1.2" strokeLinecap="round" opacity={0.4}>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
            <p style={{ color: "#555" }} className="text-sm">Sin productos en esta categoría</p>
          </div>
        )}

        {/* CTA */}
        <div
          className="mt-12 rounded-2xl px-6 py-8 text-center"
          style={{ background: "linear-gradient(135deg, rgba(56,189,248,0.08) 0%, rgba(56,189,248,0.03) 100%)", border: "1px solid rgba(56,189,248,0.15)" }}
        >
          <h2 className="text-lg font-black mb-2" style={{ color: "#F8F8F8" }}>
            ¿Tenés una idea? <span style={{ color: "#38BDF8" }}>La imprimimos</span>
          </h2>
          <p className="text-xs mb-5" style={{ color: "#555" }}>
            Diseños personalizados · Pedidos especiales · Envíos a todo el país
          </p>
          <a
            href={`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hola! Quiero consultar sobre un diseño personalizado.")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all hover:opacity-90"
            style={{ backgroundColor: "#38BDF8", color: "#000" }}
          >
            Pedido personalizado
          </a>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="py-8 px-4" style={{ borderTop: "1px solid #1A1A1A", backgroundColor: "#080808" }}>
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col items-center sm:items-start gap-0.5">
            <span className="font-black text-sm tracking-widest uppercase" style={{ color: "#F8F8F8" }}>
              Impresiones 3D <span style={{ color: "#38BDF8" }}>San Vicente</span>
            </span>
            <span className="text-[9px] tracking-widest uppercase" style={{ color: "#444" }}>
              Fabricación propia · Envíos a todo el país
            </span>
          </div>

          <div className="flex items-center gap-6">
            <a href={WA_LINK} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: "#666" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
              </svg>
              11 3107-4381
            </a>
            <a href={INSTAGRAM} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm" style={{ color: "#666" }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              @3D.SanVicente
            </a>
          </div>

          <p className="text-[10px]" style={{ color: "#333" }}>© 2026 3D San Vicente</p>
        </div>
      </footer>
    </div>
  );
}