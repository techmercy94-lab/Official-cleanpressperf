import Link from 'next/link'
import { ProductCard } from '@/components/product-card'

export default function Home() {
  return (
    <main className="bg-slate-950 text-white">

      {/* Navigation */}

      <nav className="border-b border-slate-800 bg-slate-900/70 backdrop-blur sticky top-0 z-50">

        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

          <div className="text-2xl font-bold tracking-wide text-pink-400">
            CleanPressperf
          </div>

          <div className="flex items-center gap-6">

            <Link
              href="/auth/login"
              className="hover:text-pink-400 transition"
            >
              Login
            </Link>

            <Link
              href="/auth/sign-up"
              className="bg-pink-600 hover:bg-pink-700 px-5 py-2 rounded-lg transition"
            >
              Sign Up
            </Link>

          </div>

        </div>

      </nav>

      {/* Hero */}

      <section className="max-w-7xl mx-auto px-4 py-24 text-center">

        <h1 className="text-5xl md:text-6xl font-extrabold mb-6">

          Luxury Has A New Scent

        </h1>

        <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-8">

          Discover premium fragrances crafted for confidence,
          elegance and unforgettable moments.
          Experience the signature collection from
          <span className="text-pink-400 font-semibold">
            {" "}CleanPressperf.
          </span>

        </p>

        <div className="mt-10 flex justify-center gap-5">

          <Link
            href="#products"
            className="bg-pink-600 hover:bg-pink-700 px-8 py-4 rounded-xl font-semibold transition"
          >
            Shop Collection
          </Link>

          <Link
            href="/auth/sign-up"
            className="border border-pink-500 hover:bg-pink-600 px-8 py-4 rounded-xl font-semibold transition"
          >
            Become an Affiliate
          </Link>

        </div>

      </section>
            {/* Collection Image */}

      <section className="py-12">

        <div className="max-w-6xl mx-auto px-4">

          <img
            src="/perfumes.png"
            alt="CleanPressperf Signature Perfume Collection"
            className="w-full rounded-3xl shadow-2xl"
          />

        </div>

      </section>

      {/* Products */}

      <section
        id="products"
        className="bg-slate-900 py-20"
      >

        <div className="max-w-7xl mx-auto px-4">

          <h2 className="text-4xl font-bold text-center mb-4">
            Signature Collection
          </h2>

          <p className="text-slate-400 text-center mb-14">
            Luxury fragrances crafted for every personality.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">

            <ProductCard
              name="Blushé"
              price="$4"
              desc="For Her • Soft. Romantic. Unforgettable."
            />

            <ProductCard
              name="Crimson"
              price="$4"
              desc="For Him • Bold confidence that leaves a lasting impression."
            />

            <ProductCard
              name="Verde"
              price="$4"
              desc="Unisex • Fresh energy. Pure confidence."
            />

            <ProductCard
              name="Aureo"
              price="$4"
              desc="Luxury Unisex • Luxury bottled for unforgettable moments."
            />

            <ProductCard
              name="Argento"
              price="$4"
              desc="Unisex • Pure elegance. Timeless sophistication."
            />

          </div>

        </div>

      </section>
      {/* Affiliate Program */}

      <section className="py-20">

        <div className="max-w-6xl mx-auto px-4">

          <div className="rounded-3xl bg-gradient-to-r from-pink-700 via-red-700 to-orange-600 p-12 text-center shadow-2xl">

            <h2 className="text-4xl font-bold mb-6">
              Become a CleanPressperf Affiliate
            </h2>

            <p className="text-lg text-pink-100 max-w-3xl mx-auto leading-8 mb-10">

              Earn
              <span className="font-bold text-white"> $1 </span>
              on every successful perfume sale you refer.

              That's a

              <span className="font-bold text-white">
                {" "}25% commission{" "}
              </span>

              on every order.

              Withdraw your earnings once you reach

              <span className="font-bold text-white">
                {" "}$5
              </span>

              (only 5 successful sales).

            </p>

            <div className="flex flex-wrap justify-center gap-5">

              <Link
                href="/auth/sign-up"
                className="bg-white text-pink-700 hover:bg-slate-100 px-8 py-4 rounded-xl font-bold transition"
              >
                Become an Affiliate
              </Link>

              <Link
                href="/affiliate"
                className="border border-white hover:bg-white/10 px-8 py-4 rounded-xl font-bold transition"
              >
                Affiliate Dashboard
              </Link>

            </div>

          </div>

        </div>

      </section>

      {/* Final CTA */}

      <section className="py-20 text-center">

        <div className="max-w-4xl mx-auto px-4">

          <h2 className="text-4xl font-bold mb-5">

            Find Your Signature Fragrance

          </h2>

          <p className="text-slate-300 text-lg mb-10">

            Confidence begins with how you smell.
            Choose your favorite CleanPressperf fragrance today.

          </p>

          <Link
            href="/auth/sign-up"
            className="bg-pink-600 hover:bg-pink-700 px-10 py-4 rounded-xl font-bold transition"
          >
            Shop Now
          </Link>

        </div>

      </section>

      {/* Footer */}

      <footer className="border-t border-slate-800 py-10 bg-slate-900">

        <div className="max-w-6xl mx-auto px-4 text-center">

          <h3 className="text-2xl font-bold text-pink-400 mb-3">

            CleanPressperf

          </h3>

          <p className="text-slate-400 mb-5">

            Luxury Fragrances • Affiliate Rewards • Premium Experience

          </p>

          <p className="text-slate-500 text-sm">

            © 2026 CleanPressperf. All Rights Reserved.

          </p>

        </div>

      </footer>

    </main>
  )
}
      
      
      
