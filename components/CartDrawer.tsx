"use client";

import { useEffect } from "react";
import { useCartFav } from "@/contexts/CartFavContext";

const WA_NUMBER = "5491131074381";

function formatPrice(price: number): string {
  return price.toLocaleString("es-AR");
}

function buildCartWALink(items: { product: { name: string; price: number }; quantity: number }[], total: number): string {
  const lines = items.map((i) => `• ${i.quantity}x ${i.product.name} — $${formatPrice(i.product.price * i.quantity)}`).join("\n");
  const msg = `Hola! Me interesa hacer el siguiente pedido:\n\n${lines}\n\nTotal: $${formatPrice(total)}\n\n¿Tienen disponibilidad?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function CartDrawer() {
  const { cart, cartOpen, setCartOpen, cartTotal, cartCount, updateQuantity, removeFromCart, clearCart } = useCartFav();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") setCartOpen(false); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCartOpen]);

  // Prevent scroll when open
  useEffect(() => {
    document.body.style.overflow = cartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [cartOpen]);

  return (
    <>
      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 z-40"
          style={{ backgroundColor: "rgba(0,0,0,0.3)", backdropFilter: "blur(2px)" }}
          onClick={() => setCartOpen(false)}
        />
      )}

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          backgroundColor: "#FFFFFF",
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
          transform: cartOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid #F3F4F6" }}>
          <div className="flex items-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2" strokeLinecap="round">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span className="font-black text-base" style={{ color: "#1A1A1A" }}>
              Carrito
            </span>
            {cartCount > 0 && (
              <span
                className="text-xs font-bold px-2 py-0.5 rounded-full"
                style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
              >
                {cartCount}
              </span>
            )}
          </div>
          <button
            onClick={() => setCartOpen(false)}
            className="p-2 rounded-lg transition-colors hover:bg-gray-100"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 py-16">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#E5E7EB" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <p className="text-sm font-medium" style={{ color: "#9CA3AF" }}>Tu carrito está vacío</p>
              <button
                onClick={() => setCartOpen(false)}
                className="text-sm font-semibold px-4 py-2 rounded-lg transition-all hover:opacity-80"
                style={{ backgroundColor: "#F3F4F6", color: "#1A1A1A" }}
              >
                Ver productos
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {cart.map(({ product, quantity }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "#F9FAFB", border: "1px solid #F3F4F6" }}
                >
                  {/* Image */}
                  <div
                    className="w-16 h-16 rounded-lg shrink-0 overflow-hidden flex items-center justify-center"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #E5E7EB" }}
                  >
                    {product.images[0] ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-contain p-1" />
                    ) : (
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round">
                        <path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/>
                      </svg>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate" style={{ color: "#1A1A1A" }}>{product.name}</p>
                    <p className="text-xs" style={{ color: "#9CA3AF" }}>{product.dimensions}</p>
                    <p className="text-sm font-black mt-0.5" style={{ color: "#1A1A1A" }}>
                      ${formatPrice(product.price * quantity)}
                    </p>
                  </div>

                  {/* Quantity + Remove */}
                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="p-1 rounded transition-colors hover:bg-red-50"
                    >
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round">
                        <path d="M18 6L6 18M6 6l12 12"/>
                      </svg>
                    </button>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(product.id, -1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all hover:opacity-80"
                        style={{ backgroundColor: "#F3F4F6", color: "#1A1A1A" }}
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-bold" style={{ color: "#1A1A1A" }}>{quantity}</span>
                      <button
                        onClick={() => updateQuantity(product.id, 1)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-all hover:opacity-80"
                        style={{ backgroundColor: "#1A1A1A", color: "#FFFFFF" }}
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear */}
              <button
                onClick={clearCart}
                className="text-xs font-medium self-end transition-colors hover:text-red-500"
                style={{ color: "#9CA3AF" }}
              >
                Vaciar carrito
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        {cart.length > 0 && (
          <div className="px-5 py-4" style={{ borderTop: "1px solid #F3F4F6" }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: "#6B7280" }}>Total</span>
              <span className="text-xl font-black" style={{ color: "#1A1A1A" }}>${formatPrice(cartTotal)}</span>
            </div>
            <a
              href={buildCartWALink(cart, cartTotal)}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-bold transition-all hover:opacity-90"
              style={{ backgroundColor: "#25D366", color: "#FFFFFF" }}
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.125.558 4.126 1.532 5.862L0 24l6.305-1.508A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 01-5.032-1.386l-.36-.214-3.742.895.952-3.653-.234-.374A9.792 9.792 0 012.182 12C2.182 6.578 6.578 2.182 12 2.182S21.818 6.578 21.818 12 17.422 21.818 12 21.818z"/>
              </svg>
              Consultar pedido por WhatsApp
            </a>
          </div>
        )}
      </div>
    </>
  );
}
