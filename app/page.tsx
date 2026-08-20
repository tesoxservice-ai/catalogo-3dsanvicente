export const revalidate = 0

import { getProducts } from '@/lib/products'
import HomeClient from './HomeClient'

export default async function HomePage() {
  const products = await getProducts()
  return <HomeClient products={products} />
}