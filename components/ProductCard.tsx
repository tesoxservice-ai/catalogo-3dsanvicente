"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export interface Product {
  id: number;
  slug: string;
  name: string;
  category: string;
  price: number;
  dimensions: string;
  description: string;
  colors: string[];
  images: string[];
  has3DModel: boolean;
  modelPath: string | null;
  code: string;
  featured: boolean;
  active: boolean;
}

const CATEGORY_LABELS: Record<string, string> = {
  "cuadros-tripticos": "Cuadros",
  "decoracion-esculturas": "Decoración",
  macetas: "Macetas",
  "animales-decorativos": "Animales",
};

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

const WA_NUMBER = "5491131074381";

function buildWhatsAppLink(productName: string): string {
  const message = `Hola! Me interesa el producto ${productName}. ¿Tienen disponibilidad?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const waLink = buildWhatsAppLink(product.name);
  const priceStr = formatPrice(product.price);

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group"
      style={{
        backgroundColor: "#FFFFFF",
        border: hovered ? "1.5px solid #2563EB" : "1.5px solid #F3F4F6",
        boxShadow: hovered
          ? "0 12px 32px rgba(37,99,235,0.13), 0 2px 8px rgba(0,0,0,0.07)"
          : "0 2px 12px rgba(0,0,0,0.07)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="block">
        <div
          className="relative w-full overflow-hidden"
          style={{ backgroundColor: "#F8F9FA", aspectRatio: "1/1" }}
        >
          {!imgError && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-2" style={{ backgroundColor: "#F8F9FA" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs" style={{ color: "#9CA3AF" }}>3D San Vicente</span>
            </div>
          )}

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
            <span
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "#6B7280", border: "1px solid #E5E7EB" }}
            >
              {categoryLabel}
            </span>
          </div>

          {product.has3DModel && (
            <span
              className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#2563EB", color: "#FFFFFF" }}
            >
              3D
            </span>
          )}
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-2">
        <Link href={`/productos/${product.slug}`} className="block">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 transition-colors"
            style={{ color: hovered ? "#2563EB" : "#1A1A1A" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Dimensions */}
        <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{product.dimensions}</p>

        {/* Price */}
        <div className="flex items-baseline gap-0.5 mt-auto pt-1">
          <sup className="text-xs font-bold" style={{ color: "#1A1A1A", marginBottom: "2px" }}>$</sup>
          <span className="text-xl font-black" style={{ color: "#1A1A1A" }}>{priceStr}</span>
        </div>

        {/* Divider */}
        <div style={{ height: "1px", backgroundColor: "#F3F4F6", margin: "4px 0" }} />

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{ backgroundColor: "#25D366", color: "#fff" }}
        >
          <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
          </svg>
          Consultar
        </a>
      </div>
    </div>
  );
}