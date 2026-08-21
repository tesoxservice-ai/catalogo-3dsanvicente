"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCartFav } from "@/contexts/CartFavContext";
import { useVendedora } from "@/contexts/VendedoraContext";

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
  "hogar-organizacion": "Hogar",
  "mundial-argentina-llaveros": "Llaveros",
  "nuevos-ingresos": "Nuevo",
};

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const [imgError, setImgError] = useState(false);
  const [hovered, setHovered] = useState(false);
  const { addToCart, isInCart, toggleFavorite, isFavorite } = useCartFav();
  const { waNumber } = useVendedora();

  const categoryLabel = CATEGORY_LABELS[product.category] ?? product.category;
  const priceStr = formatPrice(product.price);
  const inCart = isInCart(product.id);
  const fav = isFavorite(product.id);

  const waLink = `https://wa.me/${waNumber}?text=${encodeURIComponent(
    `Hola! Me interesa el producto ${product.name}. ¿Tienen disponibilidad?`
  )}`;

  return (
    <div
      className="relative rounded-2xl overflow-hidden flex flex-col transition-all duration-300 cursor-pointer group"
      style={{
        backgroundColor: "#FFFFFF",
        border: hovered ? "1.5px solid #1A1A1A" : "1.5px solid #F3F4F6",
        boxShadow: hovered
          ? "0 12px 32px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06)"
          : "0 2px 12px rgba(0,0,0,0.06)",
        transform: hovered ? "translateY(-2px)" : "translateY(0)",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <Link href={`/productos/${product.slug}`} className="block">
        <div className="relative w-full overflow-hidden" style={{ backgroundColor: "#F8F9FA", aspectRatio: "1/1" }}>
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
            <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: "#F8F9FA" }}>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
              </svg>
            </div>
          )}

          {/* Category badge */}
          <span
            className="absolute top-2.5 left-2.5 text-[10px] font-semibold px-2 py-0.5 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.95)", color: "#6B7280", border: "1px solid #E5E7EB" }}
          >
            {categoryLabel}
          </span>

          {/* 3D badge */}
          {product.has3DModel && (
            <span
              className="absolute top-2.5 right-2.5 text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
            >
              3D
            </span>
          )}

          {/* Favorite button */}
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleFavorite(product.id); }}
            className="absolute bottom-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
            style={{
              backgroundColor: fav ? "#FEF2F2" : "rgba(255,255,255,0.9)",
              border: `1px solid ${fav ? "#FECACA" : "#E5E7EB"}`,
              backdropFilter: "blur(4px)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill={fav ? "#EF4444" : "none"} stroke={fav ? "#EF4444" : "#9CA3AF"} strokeWidth="2" strokeLinecap="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </Link>

      {/* Body */}
      <div className="flex flex-col flex-1 px-3 pt-3 pb-3 gap-2">
        <Link href={`/productos/${product.slug}`} className="block">
          <h3 className="text-sm font-semibold leading-snug line-clamp-2 transition-colors" style={{ color: "#1A1A1A" }}>
            {product.name}
          </h3>
        </Link>

        <p className="text-[11px]" style={{ color: "#9CA3AF" }}>{product.dimensions}</p>

        <div className="flex items-baseline gap-0.5 mt-auto pt-1">
          <sup className="text-xs font-bold" style={{ color: "#1A1A1A", marginBottom: "2px" }}>$</sup>
          <span className="text-xl font-black" style={{ color: "#1A1A1A" }}>{priceStr}</span>
        </div>

        <div style={{ height: "1px", backgroundColor: "#F3F4F6", margin: "4px 0" }} />

        {/* Add to cart */}
        <button
          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
          className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-xs font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
          style={{
            backgroundColor: inCart ? "#F0FDF4" : "#1A1A1A",
            color: inCart ? "#16A34A" : "#FFFFFF",
            border: inCart ? "1px solid #BBF7D0" : "none",
          }}
        >
          {inCart ? (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M20 6L9 17l-5-5"/></svg>En el carrito</>
          ) : (
            <><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/></svg>Agregar al carrito</>
          )}
        </button>
      </div>
    </div>
  );
}