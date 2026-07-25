'use server';

import { createClient } from '@/lib/supabase/server';
import { generateAffiliateCode } from '@/lib/utils-custom';

export async function registerAsAffiliate(
  userId: string,
  username: string,
  bio?: string
) {
  const supabase = await createClient();

  // Check if username is taken
  const { data: existing } = await supabase
    .from('profiles')
    .select('affiliate_username')
    .eq('affiliate_username', username)
    .single();

  if (existing) {
    return { error: 'Username already taken' };
  }

  const affiliateCode = generateAffiliateCode();

  const { error } = await supabase
    .from('profiles')
    .update({
      is_affiliate: true,
      affiliate_username: username,
      affiliate_code: affiliateCode,
      bio,
    })
    .eq('id', userId);

  if (error) {
    console.error('Error registering as affiliate:', error);
    return { error };
  }

  return { success: true, affiliateCode };
}

export async function getAffiliateProfile(userId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .eq('is_affiliate', true)
    .single();

  if (error) {
    console.error('Error fetching affiliate profile:', error);
    return null;
  }

  return data;
}

export async function trackAffiliateClick(affiliateCode: string, ipAddress?: string, userAgent?: string) {
  const supabase = await createClient();

  // Get affiliate by code
  const { data: affiliate } = await supabase
    .from('profiles')
    .select('id')
    .eq('affiliate_code', affiliateCode)
    .single();

  if (!affiliate) {
    return { error: 'Affiliate not found' };
  }

  const { error } = await supabase.from('affiliate_clicks').insert({
    affiliate_id: affiliate.id,
    ip_address: ipAddress,
    user_agent: userAgent,
    referral_code: affiliateCode,
  });

  if (error) {
    console.error('Error tracking affiliate click:', error);
    return { error };
  }

  return { success: true, affiliateId: affiliate.id };
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = await createClient();

  // Get total clicks
  const { count: clicksCount } = await supabase
    .from('affiliate_clicks')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliateId);

  // Get total customers referred
  const { count: customersCount } = await supabase
    .from('affiliate_customers')
    .select('*', { count: 'exact', head: true })
    .eq('affiliate_id', affiliateId);

  // Get total commissions
  const { data: commissionsData } = await supabase
    .from('commissions')
    .select('commission_amount_naira, status')
    .eq('affiliate_id', affiliateId);

  const totalCommissions = commissionsData?.reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0;
  const paidCommissions = commissionsData
    ?.filter((c) => c.status === 'paid')
    .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0;
  const pendingCommissions = commissionsData
    ?.filter((c) => c.status === 'pending')
    .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0;

  return {
    totalClicks: clicksCount || 0,
    totalCustomersReferred: customersCount || 0,
    totalCommissions,
    paidCommissions,
    pendingCommissions,
  };
}

export async function getAffiliateCommissions(affiliateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('commissions')
    .select('*, order:orders(*)')
    .eq('affiliate_id', affiliateId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching commissions:', error);
    return [];
  }

  return data || [];
}

export async function requestWithdrawal(
  affiliateId: string,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountHolder: string
) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .insert({
      affiliate_id: affiliateId,
      amount_naira: amount,
      bank_name: bankName,
      bank_account_number: accountNumber,
      account_holder_name: accountHolder,
      status: 'pending',
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating withdrawal request:', error);
    return { error };
  }

  return { data };
}

export async function getAffiliateWithdrawals(affiliateId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('requested_at', { ascending: false });

  if (error) {
    console.error('Error fetching withdrawals:', error);
    return [];
  }

  return data || [];
}
