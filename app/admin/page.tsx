import Link from 'next/link'

export default function Admin() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <div className="space-y-4">
          <Link href="/admin/dashboard" className="block">Dashboard</Link>
          <Link href="/admin/commissions" className="block">Commissions</Link>
          <Link href="/admin/withdrawals" className="block">Withdrawals</Link>
        </div>
      </div>
    </main>
  )
}
