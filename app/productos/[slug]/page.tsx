import { getProductBySlug } from '@/lib/products'
import { notFound } from 'next/navigation'
import ProductDetailClient from './ProductDetailClient'

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) notFound()
  return <ProductDetailClient product={product} />
}