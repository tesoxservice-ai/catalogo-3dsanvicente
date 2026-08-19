/* ═══════════════════════════════════════════════════════════
   types/product.ts
   Tipos del catálogo digital — 3D San Vicente
═══════════════════════════════════════════════════════════ */

/**
 * Rango de precio mayorista para un tramo de cantidad.
 *
 * @example
 * { min: 10, max: 49, price: 1800 }  // 10–49 unidades → $1.800 c/u
 * { min: 50, max: 99, price: 1500 }  // 50–99 unidades → $1.500 c/u
 */
export interface WholesalePriceRange {
  /** Cantidad mínima del tramo (inclusive) */
  min: number
  /** Cantidad máxima del tramo (inclusive). Usar Infinity para "sin límite" */
  max: number
  /** Precio unitario para este tramo */
  price: number
}

/**
 * Producto del catálogo de impresión 3D.
 *
 * @example
 * const maceta: Product = {
 *   id:           1,
 *   slug:         'maceta-geometrica-m',
 *   name:         'Maceta Geométrica M',
 *   category:     'macetas',
 *   price:        2500,
 *   wholesalePrice: [
 *     { min: 10, max: 49, price: 2000 },
 *     { min: 50, max: Infinity, price: 1700 },
 *   ],
 *   dimensions:   '12 × 12 × 15 cm',
 *   description:  'Maceta de diseño geométrico con drenaje integrado.',
 *   colors:       ['blanco', 'negro', 'terracota'],
 *   images:       ['/products/maceta-geo-m-01.webp', '/products/maceta-geo-m-02.webp'],
 *   has3DModel:   true,
 *   modelPath:    '/models/maceta-geometrica-m.glb',
 *   code:         'MAC-GEO-M',
 *   featured:     true,
 *   active:       true,
 * }
 */
export interface Product {
  /** Identificador numérico único en la base de datos */
  id: number

  /** Slug URL-friendly único (kebab-case, sin acentos) */
  slug: string

  /** Nombre de exhibición del producto */
  name: string

  /**
   * Categoría del producto.
   * Valores sugeridos: 'regalos' | 'decoracion' | 'macetas' |
   * 'llaveros' | 'organizadores' | 'juguetes' | 'otros'
   */
  category: string

  /** Precio de venta al público (en centavos o la unidad monetaria base) */
  price: number

  /**
   * Tabla de precios mayoristas por tramos de cantidad.
   * Omitir si el producto no tiene precio mayorista.
   * Los rangos deben ser contiguos y no solaparse.
   */
  wholesalePrice?: WholesalePriceRange[]

  /**
   * Dimensiones del producto terminado.
   * Formato libre, e.g. "15 × 10 × 5 cm" o "Ø 8 cm × 12 cm alto"
   */
  dimensions: string

  /** Descripción larga del producto (HTML o Markdown). Opcional. */
  description?: string

  /**
   * Colores disponibles para este producto.
   * Pueden ser nombres ("negro", "blanco") o códigos HEX ("#000000").
   */
  colors: string[]

  /**
   * Rutas o URLs de las imágenes del producto.
   * El primer elemento se usa como imagen principal.
   * Usar paths relativos a /public o URLs absolutas de CDN.
   */
  images: string[]

  /** Indica si el producto tiene modelo 3D interactivo disponible */
  has3DModel: boolean

  /**
   * Ruta al archivo de modelo 3D (.glb / .gltf).
   * Requerido cuando `has3DModel` es `true`.
   */
  modelPath?: string

  /**
   * Código interno de referencia del producto (SKU).
   * Formato sugerido: 'CAT-NOMBRE-VARIANTE', e.g. 'MAC-GEO-M'
   */
  code: string

  /** Destacar el producto en la portada / sección featured */
  featured: boolean

  /** Controla si el producto es visible en el catálogo público */
  active: boolean
}

/* ─── Tipos de apoyo ─────────────────────────────────────────────── */

/** Categorías disponibles en el catálogo (para filtros y validación) */
export type ProductCategory =
  | 'regalos'
  | 'decoracion'
  | 'macetas'
  | 'llaveros'
  | 'organizadores'
  | 'juguetes'
  | 'otros'

/** Versión simplificada para listados y grillas (sin campos pesados) */
export type ProductCard = Pick<
  Product,
  'id' | 'slug' | 'name' | 'category' | 'price' | 'images' | 'colors' | 'featured' | 'active'
> & {
  wholesalePrice?: WholesalePriceRange[]
}
