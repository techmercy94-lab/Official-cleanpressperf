import Link from 'next/link'

export default function Account() {
  return (
    <main className="min-h-screen bg-background pt-32 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">My Account</h1>
        <Link href="/auth/login" className="px-6 py-2 bg-primary rounded inline-block">
          Sign In
        </Link>
      </div>
    </main>
  )
}
