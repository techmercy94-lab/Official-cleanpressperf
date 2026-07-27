import Link from 'next/link'

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="text-2xl font-bold">CleanPressperf</div>
          <div className="flex gap-6">
            <Link href="/auth/login" className="hover:text-slate-300 transition-colors">
              Login
            </Link>
            <Link href="/auth/sign-up" className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded transition-colors">
              Sign Up
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl font-bold mb-6">Luxury Perfume Reimagined</h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Experience the finest collection of premium fragrances handcrafted for discerning tastes. Pure elegance in every spray.
        </p>
        <div className="flex gap-4 justify-center">
          <button className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded font-semibold transition-colors">
            Shop Collection
          </button>
          <button className="border border-slate-600 hover:border-slate-400 px-8 py-3 rounded font-semibold transition-colors">
            Learn More
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-slate-400">Crafted from the finest ingredients sourced globally</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-semibold mb-2">Exclusive Scents</h3>
              <p className="text-slate-400">Limited edition fragrances you won&apos;t find anywhere else</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
              <p className="text-slate-400">Worldwide shipping with premium packaging</p>
            </div>
          </div>
        </div>
      </section>

      {/* Affiliate Program Section */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="bg-gradient-to-r from-blue-900 to-blue-800 rounded-lg p-12 text-center">
          <h2 className="text-4xl font-bold mb-4">Join Our Affiliate Program</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Earn 15% commission on every sale you refer. It&apos;s the perfect way to monetize your audience while sharing luxury perfumes they&apos;ll love.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/auth/sign-up" className="bg-white text-blue-900 hover:bg-slate-100 px-8 py-3 rounded font-semibold transition-colors">
              Become an Affiliate
            </Link>
            <Link href="/affiliate" className="border border-white hover:bg-white/10 px-8 py-3 rounded font-semibold transition-colors">
              Affiliate Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Featured Collection</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: "Midnight Elegance", price: "$89.99", desc: "Rich woody notes with hints of jasmine" },
              { name: "Citrus Serenity", price: "$79.99", desc: "Refreshing citrus blend with white musk" },
              { name: "Rose Luxe", price: "$99.99", desc: "Romantic rose bouquet with oud undertones" },
            ].map((product, i) => (
              <div key={i} className="border border-slate-700 rounded-lg p-6 hover:border-blue-500 transition-colors">
                <div className="bg-slate-800 h-48 rounded mb-4 flex items-center justify-center">
                  <span className="text-4xl">🧴</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">{product.name}</h3>
                <p className="text-slate-400 text-sm mb-4">{product.desc}</p>
                <p className="text-2xl font-bold text-blue-400 mb-4">{product.price}</p>
                <button className="w-full bg-blue-600 hover:bg-blue-700 py-2 rounded transition-colors">
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Elevate Your Scent Game?</h2>
        <p className="text-slate-300 mb-8">Join thousands of satisfied customers experiencing luxury perfumery.</p>
        <Link href="/auth/sign-up" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded font-semibold transition-colors">
          Shop Now
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-900 py-8 mt-20">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-400">
          <p>&copy; 2024 CleanPressperf. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
