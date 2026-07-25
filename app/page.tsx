import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getProducts, getCategories } from '@/app/actions/products';
import { ArrowRight, Sparkles, TrendingUp } from 'lucide-react';

export const revalidate = 60;

async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getProducts({ featured: true }),
    getCategories(),
  ]);

  const bestsellingProducts = await getProducts({ bestseller: true });

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left content */}
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
                <span className="text-primary">Smell Premium.</span>
                <br />
                <span className="text-primary">Earn Premium.</span>
              </h1>

              <p className="text-lg text-muted-foreground">
                Discover our exquisite collection of luxury perfumes crafted for discerning tastes. Join our affiliate program and earn up to 15% on every sale.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
                >
                  Shop Now
                  <ArrowRight size={18} className="ml-2" />
                </Link>

                <Link
                  href="/auth/sign-up?affiliate=true"
                  className="inline-flex items-center justify-center px-6 py-3 border border-primary text-primary font-semibold rounded-lg hover:bg-primary hover:text-primary-foreground transition"
                >
                  Become an Affiliate
                </Link>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <p className="text-2xl font-bold text-primary">500+</p>
                  <p className="text-sm text-muted-foreground">Premium Fragrances</p>
                </div>
                <div>
                  <p className="text-2xl font-bold text-primary">15%</p>
                  <p className="text-sm text-muted-foreground">Affiliate Commission</p>
                </div>
              </div>
            </div>

            {/* Right - Hero Image */}
            <div className="relative h-96 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-xl flex items-center justify-center">
              <div className="text-center">
                <Sparkles size={64} className="text-primary mx-auto mb-4" />
                <p className="text-primary font-semibold">Luxury Perfume Collection</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-card border-b border-border">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-2">Featured Scents</h2>
                <p className="text-muted-foreground">Curated collection of our finest fragrances</p>
              </div>
              <Link href="/shop" className="text-primary hover:text-secondary transition font-semibold">
                View All
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Bestsellers Section */}
      {bestsellingProducts.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div className="flex items-center gap-3">
                <TrendingUp className="text-primary" size={28} />
                <div>
                  <h2 className="text-3xl font-bold text-foreground">Bestsellers</h2>
                  <p className="text-muted-foreground">Most loved by our customers</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {bestsellingProducts.slice(0, 4).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Affiliate CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-secondary/5 border-y border-border">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Turn Your Influence Into Income
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join our affiliate program and earn 15% commission on every sale. No limits, lifetime tracking on every customer you refer.
          </p>
          <Link
            href="/auth/sign-up?affiliate=true"
            className="inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-semibold rounded-lg hover:bg-secondary transition"
          >
            Start Earning Today
            <ArrowRight size={20} className="ml-2" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default HomePage;
