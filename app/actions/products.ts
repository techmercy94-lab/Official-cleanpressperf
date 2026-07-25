'use server';

import { createClient } from '@/lib/supabase/server';
import { Product, Category } from '@/lib/types';

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('categories').select('*');

  if (error) {
    console.error('Error fetching categories:', error);
    return [];
  }

  return data || [];
}

export async function getProducts(
  filters?: { categoryId?: string; featured?: boolean; bestseller?: boolean }
): Promise<Product[]> {
  const supabase = await createClient();
  let query = supabase.from('products').select('*');

  if (filters?.categoryId) {
    query = query.eq('category_id', filters.categoryId);
  }

  if (filters?.featured) {
    query = query.eq('is_featured', true);
  }

  if (filters?.bestseller) {
    query = query.eq('is_bestseller', true);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching products:', error);
    return [];
  }

  return data || [];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('slug', slug).single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();
  const { data, error } = await supabase.from('products').select('*').eq('id', id).single();

  if (error) {
    console.error('Error fetching product:', error);
    return null;
  }

  return data;
}

export async function getProductReviews(productId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('reviews')
    .select('*, user:profiles(first_name, last_name)')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }

  return data || [];
}

export async function addProductReview(
  productId: string,
  userId: string,
  rating: number,
  title: string,
  comment: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('reviews')
    .insert({
      product_id: productId,
      user_id: userId,
      rating,
      title,
      comment,
      verified_purchase: true,
    })
    .select()
    .single();

  if (error) {
    console.error('Error adding review:', error);
    return { error };
  }

  return { data };
}
