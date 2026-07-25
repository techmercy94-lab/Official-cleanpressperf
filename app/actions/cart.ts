'use server';

import { createClient } from '@/lib/supabase/server';

export async function getCart(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('cart')
    .select('*, product:products(*)')
    .eq('user_id', userId);

  if (error) {
    console.error('Error fetching cart:', error);
    return [];
  }

  return data || [];
}

export async function addToCart(userId: string, productId: string, quantity: number = 1) {
  const supabase = await createClient();

  // Check if product already in cart
  const { data: existingItem } = await supabase
    .from('cart')
    .select('*')
    .eq('user_id', userId)
    .eq('product_id', productId)
    .single();

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from('cart')
      .update({ quantity: existingItem.quantity + quantity })
      .eq('id', existingItem.id);

    if (error) {
      console.error('Error updating cart:', error);
      return { error };
    }

    return { success: true };
  }

  // Add new item
  const { error } = await supabase.from('cart').insert({
    user_id: userId,
    product_id: productId,
    quantity,
  });

  if (error) {
    console.error('Error adding to cart:', error);
    return { error };
  }

  return { success: true };
}

export async function updateCartItem(cartItemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    return removeFromCart(cartItemId);
  }

  const { error } = await supabase.from('cart').update({ quantity }).eq('id', cartItemId);

  if (error) {
    console.error('Error updating cart item:', error);
    return { error };
  }

  return { success: true };
}

export async function removeFromCart(cartItemId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('cart').delete().eq('id', cartItemId);

  if (error) {
    console.error('Error removing from cart:', error);
    return { error };
  }

  return { success: true };
}

export async function clearCart(userId: string) {
  const supabase = await createClient();
  const { error } = await supabase.from('cart').delete().eq('user_id', userId);

  if (error) {
    console.error('Error clearing cart:', error);
    return { error };
  }

  return { success: true };
}
