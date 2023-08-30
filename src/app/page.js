import ProductItem from '@/components/ProductItem'
import { data } from '@/utils/data'
import Link from 'next/link'

export default function Home() {
  const { products } = data
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3 lg:grid-cols-4">
        <Link href="/shipping">Registrar datos</Link>
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </div>
  )
}
