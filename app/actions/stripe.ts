'use server';

import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function createCheckoutSession(
  orderId: string,
  orderAmount: number,
  customerEmail: string
) {
  const supabase = await createClient();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://official-cleanpressperf.vercel.app';

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'CleanPressperf Order',
              description: `Order ID: ${orderId}`,
            },
            unit_amount: Math.round(orderAmount / 100), // Convert from kobo to cents, assuming 1 USD = 100 kobo
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${appUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/checkout/cancelled`,
      customer_email: customerEmail,
      metadata: {
        orderId,
      },
    });

    // Update order with session ID
    const { error } = await supabase
      .from('orders')
      .update({
        stripe_session_id: session.id,
        status: 'pending',
      })
      .eq('id', orderId);

    if (error) {
      console.error('Error updating order:', error);
    }

    return { sessionId: session.id };
  } catch (error) {
    console.error('Error creating checkout session:', error);
    return { error: 'Failed to create checkout session' };
  }
}

export async function getCheckoutSession(sessionId: string) {
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return session;
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    return null;
  }
}

export async function processPaymentSuccess(sessionId: string) {
  const supabase = await createClient();

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.payment_status === 'paid') {
      const orderId = session.metadata?.orderId;

      // Update order status
      await supabase
        .from('orders')
        .update({
          status: 'paid',
          stripe_session_id: sessionId,
        })
        .eq('id', orderId);

      // Create commission if affiliate
      const { data: order } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();

      if (order?.affiliate_id) {
        const commissionRate = 15; // Default 15%
        const commissionAmount = Math.floor((order.total_amount_naira * commissionRate) / 100);

        await supabase.from('commissions').insert({
          affiliate_id: order.affiliate_id,
          order_id: orderId,
          commission_rate: commissionRate,
          commission_amount_naira: commissionAmount,
          status: 'pending',
        });
      }

      return { success: true, orderId };
    }

    return { error: 'Payment not completed' };
  } catch (error) {
    console.error('Error processing payment:', error);
    return { error: 'Failed to process payment' };
  }
}
