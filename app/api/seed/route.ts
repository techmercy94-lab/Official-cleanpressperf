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
          name: 'Eau de Parfum',
          slug: 'eau-de-parfum',
          description: 'Premium concentration fragrances',
          image_url: '/images/perfume-purple.png',
        },
        {
          name: 'Eau de Toilette',
          slug: 'eau-de-toilette',
          description: 'Light and fresh fragrances',
          image_url: '/images/perfume-blue.png',
        },
        {
          name: 'Fragrances',
          slug: 'fragrances',
          description: 'Exclusive luxury collection',
          image_url: '/images/perfume-gold.png',
        },
      ])
      .select()

    if (catError) throw catError

    // Get category IDs
    const { data: catData } = await supabase.from('categories').select('id, slug')
    const catMap = Object.fromEntries(catData?.map((c: any) => [c.slug, c.id]) || [])

    // Insert products
    const { data: products, error: prodError } = await supabase
      .from('products')
      .insert([
        {
          name: 'Luxe Purple Edition',
          slug: 'luxe-purple-edition',
          description: 'A sophisticated blend of violet and amber',
          long_description:
            'Experience luxury with our signature purple edition. This exquisite fragrance combines the delicate notes of violet, amber, and musk for a sophisticated scent that lasts all day.',
          price_naira: 5000000,
          category_id: catMap['eau-de-parfum'],
          image_urls: ['/images/perfume-purple.png'],
          stock_quantity: 100,
          is_featured: true,
          is_bestseller: true,
          rating: 4.8,
          rating_count: 245,
        },
        {
          name: 'Ocean Breeze Blue',
          slug: 'ocean-breeze-blue',
          description: 'Fresh and crisp aquatic fragrance',
          long_description:
            'Dive into the fresh and invigorating scent of our Ocean Breeze collection. With top notes of sea salt and citrus, this fragrance captures the essence of a perfect coastal day.',
          price_naira: 4500000,
          category_id: catMap['eau-de-toilette'],
          image_urls: ['/images/perfume-blue.png'],
          stock_quantity: 150,
          is_featured: true,
          is_bestseller: false,
          rating: 4.6,
          rating_count: 189,
        },
        {
          name: 'Golden Elegance',
          slug: 'golden-elegance',
          description: 'Warm and sensual golden fragrance',
          long_description:
            'Embrace warmth and elegance with our Golden Elegance fragrance. This luxurious blend features top notes of bergamot, middle notes of rose, and a base of sandalwood and vanilla.',
          price_naira: 5500000,
          category_id: catMap['fragrances'],
          image_urls: ['/images/perfume-gold.png'],
          stock_quantity: 75,
          is_featured: false,
          is_bestseller: true,
          rating: 4.9,
          rating_count: 312,
        },
        {
          name: 'Midnight Noir',
          slug: 'midnight-noir',
          description: 'Dark and mysterious essence',
          long_description:
            'Unleash your mysterious side with Midnight Noir. This deep and intriguing fragrance features notes of leather, oud, and dark berries for a truly captivating experience.',
          price_naira: 6000000,
          category_id: catMap['eau-de-parfum'],
          image_urls: ['/images/perfume-black.png'],
          stock_quantity: 60,
          is_featured: true,
          is_bestseller: false,
          rating: 4.7,
          rating_count: 201,
        },
      ])
      .select()

    if (prodError) throw prodError

    return NextResponse.json(
      {
        success: true,
        message: 'Database seeded successfully',
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
