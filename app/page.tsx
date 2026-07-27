import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

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
          <Link href="#products" className="inline-block bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded font-semibold transition-colors">
            Shop Collection
          </Link>
          <Link href="#features" className="inline-block border border-slate-600 hover:border-slate-400 px-8 py-3 rounded font-semibold transition-colors">
            Learn More
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="bg-slate-900 py-16">
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

      {/* Perfume Collection Image */}
      <section className="bg-slate-950 py-12">
        <div className="max-w-6xl mx-auto px-4">
          <img 
            src="/perfumes.png" 
            alt="CleanPressperf Luxury Perfume Collection - Noir, Azure, Solstice, Amethyst"
            className="w-full h-auto rounded-lg shadow-2xl"
          />
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="products" className="bg-slate-900 py-16">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Signature Collection</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <ProductCard name="Noir" price="$4" desc="Deep mystery with dark musk and oud. The essence of sophistication." />
            <ProductCard name="Azure" price="$4" desc="Crisp clarity with blue tangerine and sea salt. Pure refreshment." />
            <ProductCard name="Solstice" price="$4" desc="Warm radiance with golden amber and vanilla. Captivating elegance." />
            <ProductCard name="Amethyst" price="$4" desc="Regal enchantment with violet and precious woods. Luxury personified." />
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
