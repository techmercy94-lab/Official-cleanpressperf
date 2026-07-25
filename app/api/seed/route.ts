import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Insert categories
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .insert([
        {
          name: 'Premium Collection',
          slug: 'premium-collection',
          description: 'Luxury fragrances at ₦5,000 each - Free nationwide delivery',
          image_url: '/images/perfume-purple.png',
        },
        {
          name: 'Exclusive Scents',
          slug: 'exclusive-scents',
          description: 'Signature perfume collection',
          image_url: '/images/perfume-gold.png',
        },
        {
          name: 'Daily Wear',
          slug: 'daily-wear',
          description: 'Perfect for everyday elegance',
          image_url: '/images/perfume-blue.png',
        },
      ])
      .select()

    if (catError) throw catError

    // Get category IDs
    const { data: catData } = await supabase.from('categories').select('id, slug')
    const catMap = Object.fromEntries(catData?.map((c: any) => [c.slug, c.id]) || [])

    // Insert products - All ₦5,000 with free nationwide delivery
    const { data: products, error: prodError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Purple Essence',
          slug: 'purple-essence',
          description: 'Luxurious violet and amber blend',
          long_description:
            'Premium perfume with sophisticated notes of violet, amber, and musk. Free nationwide delivery included.',
          price_naira: 500000,
          category_id: catMap['premium-collection'],
          image_urls: ['/images/perfume-purple.png'],
          stock_quantity: 100,
          is_featured: true,
          is_bestseller: true,
          rating: 4.8,
          rating_count: 245,
        },
        {
          name: 'Azure Wave',
          slug: 'azure-wave',
          description: 'Fresh aquatic fragrance with citrus',
          long_description:
            'Crisp and refreshing scent with sea salt and citrus top notes. Perfect for daily wear. Free nationwide delivery.',
          price_naira: 500000,
          category_id: catMap['daily-wear'],
          image_urls: ['/images/perfume-blue.png'],
          stock_quantity: 150,
          is_featured: true,
          is_bestseller: false,
          rating: 4.6,
          rating_count: 189,
        },
        {
          name: 'Amber Gold',
          slug: 'amber-gold',
          description: 'Warm and sensual golden fragrance',
          long_description:
            'Luxurious blend featuring bergamot, rose, sandalwood and vanilla. A timeless classic. Free nationwide delivery.',
          price_naira: 500000,
          category_id: catMap['exclusive-scents'],
          image_urls: ['/images/perfume-gold.png'],
          stock_quantity: 75,
          is_featured: false,
          is_bestseller: true,
          rating: 4.9,
          rating_count: 312,
        },
        {
          name: 'Midnight Mystery',
          slug: 'midnight-mystery',
          description: 'Dark and mysterious essence',
          long_description:
            'Intriguing fragrance with leather, oud, and dark berries. Make a bold statement. Free nationwide delivery.',
          price_naira: 500000,
          category_id: catMap['exclusive-scents'],
          image_urls: ['/images/perfume-black.png'],
          stock_quantity: 60,
          is_featured: true,
          is_bestseller: false,
          rating: 4.7,
          rating_count: 201,
        },
        {
          name: 'Rose Garden',
          slug: 'rose-garden',
          description: 'Classic floral perfume with elegance',
          long_description:
            'Elegant rose fragrance with delicate floral notes. Timeless and sophisticated. Free nationwide delivery.',
          price_naira: 500000,
          category_id: catMap['daily-wear'],
          image_urls: ['/images/perfume-purple.png'],
          stock_quantity: 120,
          is_featured: false,
          is_bestseller: false,
          rating: 4.7,
          rating_count: 156,
        },
        {
          name: 'Ocean Fresh',
          slug: 'ocean-fresh',
          description: 'Refreshing coastal-inspired scent',
          long_description:
            'Invigorating blend capturing the essence of the ocean. Perfect summer fragrance. Free nationwide delivery.',
          price_naira: 500000,
          category_id: catMap['daily-wear'],
          image_urls: ['/images/perfume-blue.png'],
          stock_quantity: 110,
          is_featured: true,
          is_bestseller: false,
          rating: 4.5,
          rating_count: 142,
        },
      ])
      .select()

    if (prodError) throw prodError

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded with ₦5,000 perfumes and free nationwide delivery',
        categories: categories?.length,
        products: products?.length,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
