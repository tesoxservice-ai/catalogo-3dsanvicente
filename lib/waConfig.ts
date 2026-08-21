// Configuración de vendedoras
// Agregar nuevas vendedoras acá

export const VENDEDORAS: Record<string, string> = {
  roxana: "5491157187368",
}

export const WA_DEFAULT = "5491131074381" // Número del dueño

export function getWANumber(vendedora?: string | null): string {
  if (vendedora && VENDEDORAS[vendedora.toLowerCase()]) {
    return VENDEDORAS[vendedora.toLowerCase()]
  }
  return WA_DEFAULT
}

export function buildWALink(number: string, message: string): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}