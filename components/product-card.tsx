'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Product } from '@/lib/types';
import { formatNaira } from '@/lib/utils-custom';
import { Heart } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
  onWishlist?: (productId: string) => void;
  isWishlisted?: boolean;
}

export function ProductCard({ product, onWishlist, isWishlisted }: ProductCardProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlist = async () => {
    setIsLoading(true);
    onWishlist?.(product.id);
    setIsLoading(false);
  };

  return (
    <Link href={`/products/${product.slug}`}>
      <div className="group relative bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all duration-300">
        {/* Image Container */}
        <div className="relative h-64 w-full bg-muted overflow-hidden">
          {product.image_urls && product.image_urls[0] ? (
            <Image
              src={product.image_urls[0]}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No image
            </div>
          )}

          {/* Wishlist button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              handleWishlist();
            }}
            disabled={isLoading}
            className={`absolute top-3 right-3 p-2 rounded-full transition ${
              isWishlisted
                ? 'bg-primary text-primary-foreground'
                : 'bg-background/80 backdrop-blur text-foreground hover:bg-primary hover:text-primary-foreground'
            }`}
          >
            <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
          </button>

          {/* Badge */}
          {product.is_bestseller && (
            <div className="absolute top-3 left-3 bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold">
              Bestseller
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-foreground mb-2 line-clamp-2">{product.name}</h3>

          {/* Rating */}
          {product.rating_count > 0 && (
            <div className="flex items-center gap-2 mb-2">
              <div className="flex text-accent">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.round(product.rating) ? 'text-primary' : ''}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">({product.rating_count})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-lg font-bold text-primary">{formatNaira(product.price_naira)}</span>
            {product.stock_quantity === 0 && (
              <span className="text-xs text-destructive font-semibold">Out of Stock</span>
            )}
          </div>

          {/* Stock info */}
          {product.stock_quantity > 0 && product.stock_quantity < 5 && (
            <p className="text-xs text-destructive mt-1">Only {product.stock_quantity} left</p>
          )}
        </div>
      </div>
    </Link>
  );
}
