import Link from 'next/link'

export default function ProductDetail({ params }: { params: { slug: string } }) {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Product</h1>
        <p className="text-muted-foreground">₦5,000 - FREE Delivery</p>
        <Link href="/shop" className="mt-6 inline-block px-6 py-2 bg-primary rounded">
          Back
        </Link>
      </div>
    </main>
  )
}
