import Link from 'next/link'

export default function Products() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Products</h1>
        <Link href="/shop" className="px-6 py-2 bg-primary rounded inline-block">
          Shop Now
        </Link>
      </div>
    </main>
  )
}
