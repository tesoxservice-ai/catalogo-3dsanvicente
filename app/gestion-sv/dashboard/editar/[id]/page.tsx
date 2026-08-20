'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase'

const CATEGORIES = [
  { value: 'cuadros-tripticos', label: 'Cuadros y Trípticos' },
  { value: 'decoracion-esculturas', label: 'Decoración y Esculturas' },
  { value: 'macetas', label: 'Macetas' },
  { value: 'animales-decorativos', label: 'Animales Decorativos' },
  { value: 'hogar-organizacion', label: 'Hogar y Organización' },
  { value: 'mundial-argentina-llaveros', label: 'Mundial / Argentina / Llaveros' },
  { value: 'nuevos-ingresos', label: 'Nuevos Ingresos' },
]

const COLORS = [
  { value: 'blanco', label: 'Blanco', hex: '#FFFFFF', border: true },
  { value: 'negro', label: 'Negro', hex: '#111111' },
  { value: 'celeste', label: 'Celeste', hex: '#7EC8E3' },
  { value: 'oro', label: 'Oro', hex: '#D4AF37' },
  { value: 'beige', label: 'Beige', hex: '#F5F0E8' },
  { value: 'rojo', label: 'Rojo', hex: '#E53E3E' },
  { value: 'amarillo', label: 'Amarillo', hex: '#ECC94B' },
  { value: 'rosa', label: 'Rosa', hex: '#F687B3' },
  { value: 'verde', label: 'Verde', hex: '#48BB78' },
  { value: 'natural', label: 'Natural', hex: '#A8845A' },
  { value: 'naranja', label: 'Naranja', hex: '#ED8936' },
  { value: 'piedra', label: 'Piedra', hex: '#9E9689' },
  { value: 'verde-neon', label: 'Verde Neón', hex: '#39FF14' },
]

function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined
  return document.cookie
    .split('; ')
    .find((row) => row.startsWith(name + '='))
    ?.split('=')[1]
}

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

interface FormState {
  name: string
  slug: string
  category: string
  price: string
  dimensions: string
  description: string
  colors: string[]
  has_3d_model: boolean
  model_path: string
  code: string
  featured: boolean
  active: boolean
  images: string[]
}

export default function EditarProductoPage() {
  const router = useRouter()
  const params = useParams()
  const productId = params.id as string

  const imageInputRef = useRef<HTMLInputElement>(null)
  const modelInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormState>({
    name: '',
    slug: '',
    category: '',
    price: '',
    dimensions: '',
    description: '',
    colors: [],
    has_3d_model: false,
    model_path: '',
    code: '',
    featured: false,
    active: true,
    images: [],
  })

  const [newImageFiles, setNewImageFiles] = useState<File[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [newModelFile, setNewModelFile] = useState<File | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(true)
  const [uploadProgress, setUploadProgress] = useState('')

  useEffect(() => {
    const session = getCookie('sv_admin_session')
    if (session !== 'authenticated') {
      router.replace('/gestion-sv')
      return
    }
    loadProduct()
  }, [productId])

  async function loadProduct() {
    setLoadingProduct(true)
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single()

    if (error || !data) {
      setErrors({ load: 'No se pudo cargar el producto.' })
      setLoadingProduct(false)
      return
    }

    setForm({
      name: data.name || '',
      slug: data.slug || '',
      category: data.category || '',
      price: String(data.price || ''),
      dimensions: data.dimensions || '',
      description: data.description || '',
      colors: data.colors || [],
      has_3d_model: data.has_3d_model || false,
      model_path: data.model_path || '',
      code: data.code || '',
      featured: data.featured || false,
      active: data.active ?? true,
      images: data.images || [],
    })
    setLoadingProduct(false)
  }

  function handleNameChange(value: string) {
    setForm((prev) => ({ ...prev, name: value, slug: generateSlug(value) }))
    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }))
  }

  function handleColorToggle(color: string) {
    setForm((prev) => ({
      ...prev,
      colors: prev.colors.includes(color)
        ? prev.colors.filter((c) => c !== color)
        : [...prev.colors, color],
    }))
  }

  function removeExistingImage(index: number) {
    setForm((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  function handleNewImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setNewImageFiles((prev) => [...prev, ...files])
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setNewImagePreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
  }

  function removeNewImage(index: number) {
    setNewImageFiles((prev) => prev.filter((_, i) => i !== index))
    setNewImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function handleModelChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setNewModelFile(file)
    setForm((prev) => ({ ...prev, has_3d_model: true }))
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    if (!form.name.trim()) newErrors.name = 'El nombre es requerido'
    if (!form.category) newErrors.category = 'La categoría es requerida'
    if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
      newErrors.price = 'El precio debe ser mayor a 0'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  async function uploadNewImages(): Promise<string[]> {
    const urls: string[] = []
    for (let i = 0; i < newImageFiles.length; i++) {
      const file = newImageFiles[i]
      setUploadProgress(`Subiendo imagen ${i + 1} de ${newImageFiles.length}...`)
      const ext = file.name.split('.').pop()
      const path = `${form.slug}-${Date.now()}-${i}.${ext}`
      const { error } = await supabase.storage
        .from('products-images')
        .upload(path, file, { upsert: true })
      if (!error) {
        const { data } = supabase.storage.from('products-images').getPublicUrl(path)
        urls.push(data.publicUrl)
      }
    }
    return urls
  }

  async function uploadNewModel(): Promise<string | null> {
    if (!newModelFile) return null
    setUploadProgress('Subiendo modelo 3D...')
    const ext = newModelFile.name.split('.').pop()
    const path = `${form.slug}-${Date.now()}.${ext}`
    const { error } = await supabase.storage
      .from('products-models')
      .upload(path, newModelFile, { upsert: true })
    if (error) return null
    const { data } = supabase.storage.from('products-models').getPublicUrl(path)
    return data.publicUrl
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return

    setSaving(true)
    try {
      const newImageUrls = await uploadNewImages()
      const allImages = [...form.images, ...newImageUrls]

      let modelPath = form.model_path
      if (newModelFile) {
        const uploaded = await uploadNewModel()
        if (uploaded) modelPath = uploaded
      }

      setUploadProgress('Guardando cambios...')

      const { error } = await supabase
        .from('products')
        .update({
          name: form.name.trim(),
          slug: form.slug || generateSlug(form.name),
          category: form.category,
          price: Number(form.price),
          dimensions: form.dimensions.trim() || null,
          description: form.description.trim() || null,
          colors: form.colors,
          images: allImages,
          has_3d_model: form.has_3d_model && !!modelPath,
          model_path: modelPath || null,
          code: form.code,
          featured: form.featured,
          active: form.active,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)

      if (error) throw error
      router.push('/gestion-sv/dashboard')
    } catch (err) {
      console.error(err)
      setErrors({ submit: 'Error al guardar los cambios. Intentá de nuevo.' })
    } finally {
      setSaving(false)
      setUploadProgress('')
    }
  }

  const inputStyle = (hasError?: boolean): React.CSSProperties => ({
    width: '100%',
    padding: '11px 14px',
    fontSize: '14px',
    border: `1.5px solid ${hasError ? '#ef4444' : '#e5e5e5'}`,
    borderRadius: '9px',
    outline: 'none',
    backgroundColor: '#ffffff',
    color: '#111111',
    boxSizing: 'border-box',
  })

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    fontWeight: '600',
    color: '#444444',
    marginBottom: '6px',
  }

  if (loadingProduct) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#f8f8f8',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          color: '#888888',
          fontSize: '14px',
        }}
      >
        Cargando producto...
      </div>
    )
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
          <button
            onClick={() => router.push('/gestion-sv/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#888888',
              fontSize: '20px',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            ←
          </button>
          <span style={{ fontSize: '15px', fontWeight: '700', color: '#111111' }}>
            Editar producto
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            padding: '8px 18px',
            backgroundColor: saving ? '#cccccc' : '#111111',
            color: '#ffffff',
            fontSize: '13px',
            fontWeight: '600',
            border: 'none',
            borderRadius: '8px',
            cursor: saving ? 'wait' : 'pointer',
          }}
        >
          {saving ? uploadProgress || 'Guardando...' : 'Guardar cambios'}
        </button>
      </header>

      <main style={{ padding: '24px', maxWidth: '720px', margin: '0 auto' }}>
        {errors.load && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '9px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#dc2626',
            }}
          >
            {errors.load}
          </div>
        )}
        {errors.submit && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: '9px',
              padding: '12px 16px',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#dc2626',
            }}
          >
            {errors.submit}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Card: Info básica */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0' }}>
              Información básica
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Nombre */}
              <div>
                <label style={labelStyle}>
                  Nombre <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  style={inputStyle(!!errors.name)}
                />
                {errors.name && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.name}</p>
                )}
              </div>

              {/* Slug */}
              <div>
                <label style={labelStyle}>Slug (URL)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm((prev) => ({ ...prev, slug: e.target.value }))}
                  style={{ ...inputStyle(), backgroundColor: '#f8f8f8', color: '#888888' }}
                />
              </div>

              {/* Código */}
              <div>
                <label style={labelStyle}>Código de producto</label>
                <input
                  type="text"
                  value={form.code}
                  onChange={(e) => setForm((prev) => ({ ...prev, code: e.target.value }))}
                  style={inputStyle()}
                />
              </div>

              {/* Categoría */}
              <div>
                <label style={labelStyle}>
                  Categoría <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <select
                  value={form.category}
                  onChange={(e) => {
                    setForm((prev) => ({ ...prev, category: e.target.value }))
                    if (errors.category) setErrors((prev) => ({ ...prev, category: '' }))
                  }}
                  style={{
                    ...inputStyle(!!errors.category),
                    appearance: 'none',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23888' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`,
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'right 14px center',
                    paddingRight: '36px',
                  }}
                >
                  <option value="">Seleccionar categoría</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.category}</p>
                )}
              </div>

              {/* Precio y Dimensiones */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>
                    Precio (ARS) <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => {
                      setForm((prev) => ({ ...prev, price: e.target.value }))
                      if (errors.price) setErrors((prev) => ({ ...prev, price: '' }))
                    }}
                    min="0"
                    style={inputStyle(!!errors.price)}
                  />
                  {errors.price && (
                    <p style={{ fontSize: '12px', color: '#ef4444', margin: '4px 0 0 0' }}>{errors.price}</p>
                  )}
                </div>
                <div>
                  <label style={labelStyle}>Dimensiones</label>
                  <input
                    type="text"
                    value={form.dimensions}
                    onChange={(e) => setForm((prev) => ({ ...prev, dimensions: e.target.value }))}
                    placeholder="Ej: 15x10x8 cm"
                    style={inputStyle()}
                  />
                </div>
              </div>

              {/* Descripción */}
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  rows={4}
                  style={{
                    ...inputStyle(),
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card: Colores */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0' }}>
              Colores disponibles
            </h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {COLORS.map((color) => {
                const selected = form.colors.includes(color.value)
                return (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() => handleColorToggle(color.value)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '7px',
                      padding: '7px 12px',
                      borderRadius: '20px',
                      border: selected ? '2px solid #111111' : '1.5px solid #e5e5e5',
                      backgroundColor: selected ? '#f0f0f0' : '#ffffff',
                      cursor: 'pointer',
                      transition: 'all 0.15s',
                    }}
                  >
                    <span
                      style={{
                        width: '16px',
                        height: '16px',
                        borderRadius: '50%',
                        backgroundColor: color.hex,
                        border: color.border ? '1px solid #ddd' : 'none',
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontSize: '13px', fontWeight: selected ? '600' : '400', color: '#333333' }}>
                      {color.label}
                    </span>
                  </button>
                )
              })}
            </div>
            {form.colors.length > 0 && (
              <p style={{ fontSize: '12px', color: '#888888', margin: '12px 0 0 0' }}>
                Seleccionados: {form.colors.join(', ')}
              </p>
            )}
          </div>

          {/* Card: Imágenes */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0' }}>
              Imágenes del producto
            </h3>

            {/* Existing images */}
            {form.images.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#888888', margin: '0 0 10px 0', fontWeight: '500' }}>
                  Imágenes actuales
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {form.images.map((url, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '90px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '1px solid #ebebeb',
                      }}
                    >
                      <img
                        src={url}
                        alt={`Imagen ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeExistingImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '11px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* New image previews */}
            {newImagePreviews.length > 0 && (
              <div style={{ marginBottom: '16px' }}>
                <p style={{ fontSize: '12px', color: '#888888', margin: '0 0 10px 0', fontWeight: '500' }}>
                  Nuevas imágenes a subir
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {newImagePreviews.map((preview, index) => (
                    <div
                      key={index}
                      style={{
                        position: 'relative',
                        width: '90px',
                        height: '90px',
                        borderRadius: '8px',
                        overflow: 'hidden',
                        border: '2px solid #111111',
                      }}
                    >
                      <img
                        src={preview}
                        alt={`Nueva ${index + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(index)}
                        style={{
                          position: 'absolute',
                          top: '4px',
                          right: '4px',
                          width: '22px',
                          height: '22px',
                          borderRadius: '11px',
                          backgroundColor: 'rgba(0,0,0,0.6)',
                          color: '#ffffff',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              style={{
                width: '100%',
                padding: '16px',
                border: '2px dashed #e5e5e5',
                borderRadius: '9px',
                backgroundColor: '#fafafa',
                cursor: 'pointer',
                color: '#888888',
                fontSize: '14px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span style={{ fontSize: '24px' }}>📷</span>
              <span style={{ fontWeight: '500' }}>Agregar más imágenes</span>
              <span style={{ fontSize: '12px' }}>JPG, PNG, WEBP</span>
            </button>
            <input
              ref={imageInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImageChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Card: Modelo 3D */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111111', margin: '0 0 4px 0' }}>
              Modelo 3D
            </h3>
            <p style={{ fontSize: '12px', color: '#888888', margin: '0 0 16px 0' }}>
              Opcional — acepta archivos .glb y .3mf
            </p>

            {/* Current model info */}
            {form.model_path && !newModelFile && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#f0fdf4',
                  border: '1px solid #bbf7d0',
                  borderRadius: '9px',
                  marginBottom: '12px',
                }}
              >
                <span style={{ fontSize: '20px' }}>📦</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#111111' }}>
                    Modelo 3D actual
                  </p>
                  <p
                    style={{
                      margin: '2px 0 0 0',
                      fontSize: '11px',
                      color: '#888888',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {form.model_path}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setForm((prev) => ({ ...prev, model_path: '', has_3d_model: false }))
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888888',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            )}

            {/* New model file */}
            {newModelFile ? (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  backgroundColor: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  borderRadius: '9px',
                }}
              >
                <span style={{ fontSize: '20px' }}>📦</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: 0, fontSize: '13px', fontWeight: '600', color: '#111111', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {newModelFile.name}
                  </p>
                  <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888888' }}>
                    {(newModelFile.size / 1024 / 1024).toFixed(2)} MB — nuevo archivo
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setNewModelFile(null)
                    if (modelInputRef.current) modelInputRef.current.value = ''
                  }}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#888888',
                    fontSize: '18px',
                    flexShrink: 0,
                  }}
                >
                  ×
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => modelInputRef.current?.click()}
                style={{
                  width: '100%',
                  padding: '16px',
                  border: '2px dashed #e5e5e5',
                  borderRadius: '9px',
                  backgroundColor: '#fafafa',
                  cursor: 'pointer',
                  color: '#888888',
                  fontSize: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span style={{ fontSize: '24px' }}>📦</span>
                <span style={{ fontWeight: '500' }}>
                  {form.model_path ? 'Reemplazar modelo 3D' : 'Subir modelo 3D'}
                </span>
                <span style={{ fontSize: '12px' }}>.glb o .3mf</span>
              </button>
            )}
            <input
              ref={modelInputRef}
              type="file"
              accept=".glb,.3mf"
              onChange={handleModelChange}
              style={{ display: 'none' }}
            />
          </div>

          {/* Card: Opciones */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              border: '1px solid #ebebeb',
              padding: '20px',
            }}
          >
            <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#111111', margin: '0 0 16px 0' }}>
              Opciones de publicación
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {[
                { key: 'active', label: 'Producto activo', desc: 'Visible en el catálogo público' },
                { key: 'featured', label: 'Destacado', desc: 'Aparece en la sección de destacados' },
              ].map(({ key, label, desc }) => (
                <div
                  key={key}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 0',
                    borderBottom: '1px solid #f0f0f0',
                  }}
                >
                  <div>
                    <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', color: '#111111' }}>{label}</p>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', color: '#888888' }}>{desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm((prev) => ({ ...prev, [key]: !prev[key as keyof FormState] }))}
                    style={{
                      width: '42px',
                      height: '24px',
                      borderRadius: '12px',
                      border: 'none',
                      backgroundColor: form[key as keyof FormState] ? '#111111' : '#dddddd',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'background-color 0.2s',
                      flexShrink: 0,
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        top: '3px',
                        left: form[key as keyof FormState] ? '21px' : '3px',
                        width: '18px',
                        height: '18px',
                        borderRadius: '9px',
                        backgroundColor: '#ffffff',
                        transition: 'left 0.2s',
                      }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit bottom */}
          <button
            type="submit"
            disabled={saving}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: saving ? '#cccccc' : '#111111',
              color: '#ffffff',
              fontSize: '15px',
              fontWeight: '600',
              border: 'none',
              borderRadius: '10px',
              cursor: saving ? 'wait' : 'pointer',
              marginBottom: '40px',
            }}
          >
            {saving ? uploadProgress || 'Guardando...' : 'Guardar cambios'}
          </button>
        </form>
      </main>
    </div>
  )
}
