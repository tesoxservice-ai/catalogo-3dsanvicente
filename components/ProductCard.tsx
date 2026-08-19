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
      className="relative rounded-xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group"
      style={{
        backgroundColor: "#111111",
        border: hovered ? "1px solid #38BDF8" : "1px solid #1F1F1F",
        boxShadow: hovered
          ? "0 0 20px rgba(56,189,248,0.12), 0 4px 24px rgba(0,0,0,0.4)"
          : "0 2px 12px rgba(0,0,0,0.3)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image area — links to detail page */}
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative w-full aspect-square overflow-hidden">
          {!imgError && product.images[0] ? (
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 50vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setImgError(true)}
            />
          ) : (
            /* Fallback placeholder */
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2"
              style={{ backgroundColor: "#1A1A1A" }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#38BDF8"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity={0.4}
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              <span className="text-xs" style={{ color: "#444" }}>
                3D San Vicente
              </span>
            </div>
          )}

          {/* Category badge */}
          <span
            className="absolute top-2 left-2 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{
              backgroundColor: "rgba(56,189,248,0.15)",
              color: "#38BDF8",
              border: "1px solid rgba(56,189,248,0.3)",
            }}
          >
            {categoryLabel}
          </span>

          {/* 3D badge */}
          {product.has3DModel && (
            <span
              className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{
                backgroundColor: "rgba(56,189,248,0.9)",
                color: "#000",
              }}
            >
              3D
            </span>
          )}
        </div>
      </Link>

      {/* Card body */}
      <div className="flex flex-col flex-1 p-3 gap-2">
        <Link href={`/productos/${product.slug}`} className="block">
          <h3
            className="text-sm font-semibold leading-snug line-clamp-2 hover:text-[#38BDF8] transition-colors"
            style={{ color: "#F8F8F8" }}
          >
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-baseline gap-0.5 mt-auto">
          <sup
            className="text-xs font-semibold leading-none"
            style={{ color: "#38BDF8", marginBottom: "2px" }}
          >
            $
          </sup>
          <span className="text-lg font-bold" style={{ color: "#F8F8F8" }}>
            {priceStr}
          </span>
        </div>

        {/* WhatsApp CTA */}
        <a
          href={waLink}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-1 flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-semibold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: "#25D366",
            color: "#fff",
          }}
        >
          {/* WhatsApp icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z" />
          </svg>
          Consultar
        </a>
      </div>
    </div>
  );
}
