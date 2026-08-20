import { supabase } from './supabase'
import type { Product } from '@/components/ProductCard'

export async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('active', true)
    .order('id', { ascending: true })

  if (error) {
    console.error('Error fetching products:', error)
    return []
  }

  return data.map((p) => ({
    id: p.id,
    slug: p.slug,
    name: p.name,
    category: p.category,
    price: p.price,
    dimensions: p.dimensions,
    description: p.description,
    colors: p.colors,
    images: p.images,
    has3DModel: p.has_3d_model,
    modelPath: p.model_path,
    code: p.code,
    featured: p.featured,
    active: p.active,
  }))
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('slug', slug)
    .eq('active', true)
    .single()

  if (error || !data) return null

  return {
    id: data.id,
    slug: data.slug,
    name: data.name,
    category: data.category,
    price: data.price,
    dimensions: data.dimensions,
    description: data.description,
    colors: data.colors,
    images: data.images,
    has3DModel: data.has_3d_model,
    modelPath: data.model_path,
    code: data.code,
    featured: data.featured,
    active: data.active,
  }
}