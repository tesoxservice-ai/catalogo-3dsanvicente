'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

interface Product {
  id: string
  slug: string
  name: string
  category: string
  price: number
  images: string[]
  has_3d_model: boolean
  active: boolean
  featured: boolean
  created_at: string
}

const CATEGORY_LABELS: Record<string, string> = {
  'cuadros-tripticos': 'Cuadros y Trípticos',
  'decoracion-esculturas': 'Decoración y Esculturas',
  'macetas': 'Macetas',
  'animales-decorativos': 'Animales Decorativos',
  'hogar-organizacion': 'Hogar y Organización',
  'mundial-argentina-llaveros': 'Mundial / Argentina / Llaveros',
  'nuevos-ingresos': 'Nuevos Ingresos',
}

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1]
}

export default function DashboardPage() {
  const router = useRouter()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)
  const [togglingId, setTogglingId] = useState<string | null>(null)

  useEffect(() => {
    const session = getCookie('sv_admin_session')
    if (session !== 'authenticated') {
      router.replace('/gestion-sv')
      return
    }
    fetchProducts()
  }, [])

  async function fetchProducts() {
    setLoading(true)
    const { data, error } = await supabase
      .from('products')
      .select('id, slug, name, category, price, images, has_3d_model, active, featured, created_at')
      .order('created_at', { ascending: false })

    if (!error && data) setProducts(data)
    setLoading(false)
  }

  function handleLogout() {
    document.cookie = 'sv_admin_session=; path=/; max-age=0'
    router.replace('/gestion-sv')
  }

  async function toggleActive(product: Product) {
    setTogglingId(product.id)
    const { error } = await supabase
      .from('products')
      .update({ active: !product.active, updated_at: new Date().toISOString() })
      .eq('id', product.id)

    if (!error) {
      setProducts((prev) =>
        prev.map((p) => (p.id === product.id ? { ...p, active: !p.active } : p))
      )
    }
    setTogglingId(null)
  }

  async function deleteProduct(id: string) {
    setDeletingId(id)
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) {
      setProducts((prev) => prev.filter((p) => p.id !== id))
    }
    setDeletingId(null)
    setConfirmDelete(null)
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f8f8', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Header */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #ebebeb',
          padding: '0 24px',
          height: '60px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              backgroundColor: '#111111',
              borderRadius: '7px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="16" height="16" viewBox="0 0 28 28" fill="none">
              <path d="M14 2L26 8V20L14 26L2 20V8L14 2Z" stroke="white" strokeWidth="2" fill="none" />
              <path d="M14 8L20 11V17L14 20L8 17V11L14 8Z" fill="white" />
            </svg>
          </div>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111', letterSpacing: '-0.3px' }}>
            San Vicente <span style={{ fontWeight: '400', color: '#888888' }}>— Admin</span>
          </span>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button
            onClick={() => router.push('/gestion-sv/dashboard/nuevo')}
            style={{
              padding: '8px 16px',
              backgroundColor: '#111111',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            + Nuevo producto
          </button>
          <button
            onClick={handleLogout}
            style={{
              padding: '8px 14px',
              backgroundColor: 'transparent',
              color: '#888888',
              fontSize: '13px',
              fontWeight: '500',
              border: '1px solid #e5e5e5',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
          >
            Salir
          </button>
        </div>
      </header>

      {/* Content */}
      <main style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#111111', margin: '0 0 4px 0' }}>
            Productos
          </h2>
          <p style={{ fontSize: '13px', color: '#888888', margin: 0 }}>
            {products.length} productos en total
          </p>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '80px 0', color: '#888888', fontSize: '14px' }}>
            Cargando productos...
          </div>
        ) : products.length === 0 ? (
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '80px 24px',
              textAlign: 'center',
            }}
          >
            <p style={{ color: '#888888', fontSize: '15px', margin: '0 0 16px 0' }}>
              No hay productos todavía
            </p>
            <button
              onClick={() => router.push('/gestion-sv/dashboard/nuevo')}
              style={{
                padding: '10px 20px',
                backgroundColor: '#111111',
                color: '#ffffff',
                fontSize: '14px',
                fontWeight: '600',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Crear primer producto
            </button>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #ebebeb',
                overflow: 'hidden',
              }}
            >
              {/* Table header */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '56px 1fr 160px 90px 60px 80px 120px',
                  padding: '12px 16px',
                  borderBottom: '1px solid #ebebeb',
                  backgroundColor: '#fafafa',
                  gap: '12px',
                  alignItems: 'center',
                }}
              >
                {['Foto', 'Nombre', 'Categoría', 'Precio', '3D', 'Activo', 'Acciones'].map((h) => (
                  <span
                    key={h}
                    style={{ fontSize: '11px', fontWeight: '600', color: '#888888', textTransform: 'uppercase', letterSpacing: '0.5px' }}
                  >
                    {h}
                  </span>
                ))}
              </div>

              {/* Rows */}
              {products.map((product) => (
                <div
                  key={product.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '56px 1fr 160px 90px 60px 80px 120px',
                    padding: '12px 16px',
                    borderBottom: '1px solid #f0f0f0',
                    gap: '12px',
                    alignItems: 'center',
                    backgroundColor: product.active ? '#ffffff' : '#fafafa',
                  }}
                >
                  {/* Thumbnail */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f0f0f0',
                      flexShrink: 0,
                    }}
                  >
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '100%',
                          height: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#cccccc',
                          fontSize: '18px',
                        }}
                      >
                        □
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '600', color: '#111111' }}>
                      {product.name}
                    </p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#aaaaaa' }}>
                      {product.slug}
                    </p>
                  </div>

                  {/* Category */}
                  <span
                    style={{
                      fontSize: '12px',
                      color: '#555555',
                      backgroundColor: '#f0f0f0',
                      padding: '3px 8px',
                      borderRadius: '20px',
                      display: 'inline-block',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      maxWidth: '150px',
                    }}
                    title={CATEGORY_LABELS[product.category] || product.category}
                  >
                    {CATEGORY_LABELS[product.category] || product.category}
                  </span>

                  {/* Price */}
                  <span style={{ fontSize: '14px', fontWeight: '600', color: '#111111' }}>
                    ${product.price.toLocaleString('es-AR')}
                  </span>

                  {/* 3D */}
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '500',
                      color: product.has_3d_model ? '#16a34a' : '#aaaaaa',
                    }}
                  >
                    {product.has_3d_model ? '✓ Sí' : '—'}
                  </span>

                  {/* Active toggle */}
                  <div>
                    <button
                      onClick={() => toggleActive(product)}
                      disabled={togglingId === product.id}
                      style={{
                        width: '42px',
                        height: '24px',
                        borderRadius: '12px',
                        border: 'none',
                        backgroundColor: product.active ? '#111111' : '#dddddd',
                        cursor: togglingId === product.id ? 'wait' : 'pointer',
                        position: 'relative',
                        transition: 'background-color 0.2s',
                        flexShrink: 0,
                      }}
                      title={product.active ? 'Desactivar' : 'Activar'}
                    >
                      <span
                        style={{
                          position: 'absolute',
                          top: '3px',
                          left: product.active ? '21px' : '3px',
                          width: '18px',
                          height: '18px',
                          borderRadius: '9px',
                          backgroundColor: '#ffffff',
                          transition: 'left 0.2s',
                        }}
                      />
                    </button>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      onClick={() => router.push(`/gestion-sv/dashboard/editar/${product.id}`)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: 'transparent',
                        color: '#444444',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #e5e5e5',
                        borderRadius: '7px',
                        cursor: 'pointer',
                      }}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => setConfirmDelete(product.id)}
                      style={{
                        padding: '6px 10px',
                        backgroundColor: 'transparent',
                        color: '#ef4444',
                        fontSize: '12px',
                        fontWeight: '500',
                        border: '1px solid #fecaca',
                        borderRadius: '7px',
                        cursor: 'pointer',
                      }}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Confirm delete modal */}
      {confirmDelete && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '24px',
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              padding: '28px',
              width: '100%',
              maxWidth: '360px',
              boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '17px', fontWeight: '700', color: '#111111', margin: '0 0 8px 0' }}>
              Eliminar producto
            </h3>
            <p style={{ fontSize: '14px', color: '#666666', margin: '0 0 24px 0' }}>
              Esta acción no se puede deshacer. ¿Confirmas que querés eliminar este producto?
            </p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setConfirmDelete(null)}
                style={{
                  flex: 1,
                  padding: '11px',
                  backgroundColor: 'transparent',
                  color: '#444444',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: '1px solid #e5e5e5',
                  borderRadius: '9px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => deleteProduct(confirmDelete)}
                disabled={deletingId === confirmDelete}
                style={{
                  flex: 1,
                  padding: '11px',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontSize: '14px',
                  fontWeight: '600',
                  border: 'none',
                  borderRadius: '9px',
                  cursor: deletingId === confirmDelete ? 'wait' : 'pointer',
                }}
              >
                {deletingId === confirmDelete ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
