import Link from 'next/link';
import { Header } from '@/components/header';
import { Footer } from '@/components/footer';
import { ProductCard } from '@/components/product-card';
import { getProducts, getCategories } from '@/app/actions/products';

export const revalidate = 60;

interface ShopPageProps {
  searchParams: Promise<{
    categoryId?: string;
    featured?: string;
    bestseller?: string;
    sort?: string;
  }>;
}

async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts({
      categoryId: params.categoryId,
      featured: params.featured === 'true',
      bestseller: params.bestseller === 'true',
    }),
    getCategories(),
  ]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <div className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="mb-8">
            <Link href="/" className="text-muted-foreground hover:text-primary">
              Home
            </Link>
            <span className="text-muted-foreground mx-2">/</span>
            <span className="text-foreground font-semibold">Shop</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card rounded-lg border border-border p-6 sticky top-20">
                <h3 className="font-bold text-foreground mb-4">Filters</h3>

                {/* Categories */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Categories</h4>
                  <div className="space-y-2">
                    <Link
                      href="/shop"
                      className={`block text-sm px-3 py-2 rounded transition ${
                        !params.categoryId
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      All Products
                    </Link>
                    {categories.map((cat) => (
                      <Link
                        key={cat.id}
                        href={`/shop?categoryId=${cat.id}`}
                        className={`block text-sm px-3 py-2 rounded transition ${
                          params.categoryId === cat.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Price</h4>
                  <div className="space-y-2">
                    <Link
                      href="/shop"
                      className="block text-sm px-3 py-2 rounded text-muted-foreground hover:text-foreground transition"
                    >
                      All Prices
                    </Link>
                    <Link
                      href="/shop"
                      className="block text-sm px-3 py-2 rounded text-muted-foreground hover:text-foreground transition"
                    >
                      Under ₦10,000
                    </Link>
                    <Link
                      href="/shop"
                      className="block text-sm px-3 py-2 rounded text-muted-foreground hover:text-foreground transition"
                    >
                      ₦10,000 - ₦50,000
                    </Link>
                    <Link
                      href="/shop"
                      className="block text-sm px-3 py-2 rounded text-muted-foreground hover:text-foreground transition"
                    >
                      Over ₦50,000
                    </Link>
                  </div>
                </div>

                {/* Special */}
                <div>
                  <h4 className="font-semibold text-foreground mb-3 text-sm">Special</h4>
                  <div className="space-y-2">
                    <Link
                      href="/shop?featured=true"
                      className={`block text-sm px-3 py-2 rounded transition ${
                        params.featured === 'true'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Featured
                    </Link>
                    <Link
                      href="/shop?bestseller=true"
                      className={`block text-sm px-3 py-2 rounded transition ${
                        params.bestseller === 'true'
                          ? 'bg-primary text-primary-foreground'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      Best Sellers
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {products.length > 0 ? (
                <>
                  <div className="flex justify-between items-center mb-6">
                    <p className="text-muted-foreground">
                      Showing {products.length} products
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No products found</p>
                  <Link href="/shop" className="text-primary hover:text-secondary">
                    View all products
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default ShopPage;
