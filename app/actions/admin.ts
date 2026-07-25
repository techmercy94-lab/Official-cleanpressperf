'use server';

import { createClient } from '@/lib/supabase/server';

export async function getAdminStats() {
  const supabase = await createClient();

  const [{ count: totalOrders }, { count: totalUsers }, { count: totalAffiliates }] =
    await Promise.all([
      supabase.from('orders').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('is_affiliate', true),
    ]);

  // Get total revenue
  const { data: ordersData } = await supabase
    .from('orders')
    .select('total_amount_naira')
    .eq('status', 'paid');

  const totalRevenue = ordersData?.reduce((sum, o) => sum + o.total_amount_naira, 0) || 0;

  // Get pending commissions
  const { data: commissionsData } = await supabase
    .from('commissions')
    .select('commission_amount_naira')
    .eq('status', 'pending');

  const totalPendingCommissions =
    commissionsData?.reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0;

  return {
    totalOrders: totalOrders || 0,
    totalUsers: totalUsers || 0,
    totalAffiliates: totalAffiliates || 0,
    totalRevenue,
    totalPendingCommissions,
  };
}

export async function getAdminOrders(limit = 10) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('orders')
    .select('*, user:profiles(first_name, last_name, email)')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching orders:', error);
    return [];
  }

  return data || [];
}

export async function getAdminCommissions(status?: string) {
  const supabase = await createClient();
  let query = supabase.from('commissions').select('*, affiliate:profiles(affiliate_username)');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching commissions:', error);
    return [];
  }

  return data || [];
}

export async function approveCommission(commissionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('commissions')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', commissionId);

  if (error) {
    console.error('Error approving commission:', error);
    return { error };
  }

  return { success: true };
}

export async function payCommission(commissionId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('commissions')
    .update({ status: 'paid', paid_at: new Date().toISOString() })
    .eq('id', commissionId);

  if (error) {
    console.error('Error paying commission:', error);
    return { error };
  }

  return { success: true };
}

export async function approveWithdrawal(withdrawalId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('withdrawal_requests')
    .update({ status: 'approved', approved_at: new Date().toISOString() })
    .eq('id', withdrawalId);

  if (error) {
    console.error('Error approving withdrawal:', error);
    return { error };
  }

  return { success: true };
}

export async function rejectWithdrawal(withdrawalId: string, reason: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('withdrawal_requests')
    .update({
      status: 'rejected',
      rejection_reason: reason,
      approved_at: new Date().toISOString(),
    })
    .eq('id', withdrawalId);

  if (error) {
    console.error('Error rejecting withdrawal:', error);
    return { error };
  }

  return { success: true };
}

export async function getAdminWithdrawals(status?: string) {
  const supabase = await createClient();
  let query = supabase
    .from('withdrawal_requests')
    .select('*, affiliate:profiles(affiliate_username, email)');

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query.order('requested_at', { ascending: false });

  if (error) {
    console.error('Error fetching withdrawals:', error);
    return [];
  }

  return data || [];
}
