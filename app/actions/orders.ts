'use server';

import { createClient } from '@/lib/supabase/server';

export async function getUserOrders(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

export async function getOrder(orderId: string, userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, items:order_items(*, product:products(*))')
    .eq('id', orderId)
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching order:', error);
    return null;
  }

  return data;
}

export async function createOrder(
  userId: string,
  totalAmount: number,
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode?: string;
    country?: string;
  },
  customerEmail: string,
  customerPhone?: string,
  affiliateId?: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('orders')
    .insert({
      user_id: userId,
      total_amount_naira: totalAmount,
      shipping_address_line1: shippingAddress.line1,
      shipping_address_line2: shippingAddress.line2,
      shipping_city: shippingAddress.city,
      shipping_state: shippingAddress.state,
      shipping_postal_code: shippingAddress.postalCode,
      shipping_country: shippingAddress.country || 'Nigeria',
      customer_email: customerEmail,
      customer_phone: customerPhone,
      affiliate_id: affiliateId,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating order:', error);
    return { error };
  }

  return { data };
}

export async function addOrderItems(
  orderId: string,
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>
) {
  const supabase = await createClient();

  const orderItems = items.map((item) => ({
    order_id: orderId,
    product_id: item.productId,
    quantity: item.quantity,
    unit_price_naira: item.unitPrice,
  }));

  const { error } = await supabase.from('order_items').insert(orderItems);

  if (error) {
    console.error('Error adding order items:', error);
    return { error };
  }

  return { success: true };
}

export async function updateOrderStatus(orderId: string, status: string, stripeSessionId?: string) {
  const supabase = await createClient();

  const updateData: any = { status };
  if (stripeSessionId) {
    updateData.stripe_session_id = stripeSessionId;
  }

  const { error } = await supabase.from('orders').update(updateData).eq('id', orderId);

  if (error) {
    console.error('Error updating order status:', error);
    return { error };
  }

  return { success: true };
}
