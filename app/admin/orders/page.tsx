import Link from 'next/link'

export default function AdminOrders() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Orders</h1>
        <div className="space-y-4">
          <p className="text-muted-foreground">Order management dashboard</p>
          <Link href="/admin/dashboard" className="inline-block px-6 py-2 bg-primary rounded">
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  )
}
