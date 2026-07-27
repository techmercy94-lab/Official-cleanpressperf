'use server';

import { createClient } from '@/lib/supabase/server';

function generateAffiliateCode(): string {
  return 'AFF_' + Math.random().toString(36).substring(2, 11).toUpperCase();
}

async function registerViaAuthMetadata(userId: string, username?: string) {
  const supabase = await createClient()
  const affiliateCode = generateAffiliateCode()
  
  try {
    // Update user metadata with affiliate information
    const { error } = await supabase.auth.updateUser({
      data: {
        is_affiliate: true,
        affiliate_username: username || `affiliate_${userId.substring(0, 8)}`,
        affiliate_code: affiliateCode,
      },
    })

    if (error) {
      console.error('[v0] Metadata update failed:', error)
      return { error: 'Failed to register affiliate account' }
    }

    return {
      success: true,
      affiliateCode: affiliateCode,
      username: username || `affiliate_${userId.substring(0, 8)}`,
      method: 'auth_metadata',
    }
  } catch (err) {
    console.error('[v0] Auth metadata error:', err)
    return { error: 'Failed to register affiliate account' }
  }
}

export async function registerAsAffiliate(
  userId: string,
  username?: string,
  bio?: string
) {
  const supabase = await createClient()

  try {
    // Try to query profiles table first
    const { data: currentProfile, error: profileError } = await supabase
      .from('profiles')
      .select('id, is_affiliate, affiliate_username, email')
      .eq('id', userId)
      .maybeSingle()
      .catch(err => ({ data: null, error: err }))

    // If table doesn't exist or query fails, use auth metadata instead
    if (profileError && profileError.message?.includes('relation')) {
      console.log('[v0] Profiles table not accessible, using auth metadata');
      return await registerViaAuthMetadata(userId, username)
    }

    // If profile doesn't exist, try to create it
    if (!currentProfile) {
      const { error: createError, data: newProfile } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          email: userId + '@affiliate.local',
        })
        .select('id, is_affiliate, affiliate_username, email')
        .maybeSingle()
        .catch(err => ({ error: err, data: null }))

      if (createError) {
        console.log('[v0] Profile creation failed, using auth metadata');
        return await registerViaAuthMetadata(userId, username)
      }
    }

    const affiliateCode = generateAffiliateCode()
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_affiliate: true,
        affiliate_username: username || `affiliate_${userId.substring(0, 8)}`,
        affiliate_code: affiliateCode,
      })
      .eq('id', userId)
      .catch(err => ({ error: err }))

    if (updateError) {
      return await registerViaAuthMetadata(userId, username)
    }

    return {
      success: true,
      affiliateCode: affiliateCode,
      username: username || `affiliate_${userId.substring(0, 8)}`,
    }
  } catch (error) {
    console.log('[v0] Unexpected error in registerAsAffiliate:', error)
    return await registerViaAuthMetadata(userId, username)
  }
}

export async function getAffiliateStats(affiliateId: string) {
  const supabase = await createClient()

  try {
    const { count: clicksCount, error: e1 } = await supabase
      .from('affiliate_clicks')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .catch(() => ({ count: null, error: null }))

    const { count: customersCount, error: e2 } = await supabase
      .from('affiliate_customers')
      .select('*', { count: 'exact', head: true })
      .eq('affiliate_id', affiliateId)
      .catch(() => ({ count: null, error: null }))

    const { data: commissionsData, error: e3 } = await supabase
      .from('commissions')
      .select('commission_amount_naira, status')
      .eq('affiliate_id', affiliateId)
      .catch(() => ({ data: [], error: null }))

    const totalCommissions =
      commissionsData?.reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

    const paidCommissions =
      commissionsData
        ?.filter((c) => c.status === 'paid')
        .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

    const pendingCommissions =
      commissionsData
        ?.filter((c) => c.status === 'pending')
        .reduce((sum, c) => sum + c.commission_amount_naira, 0) || 0

    return {
      totalClicks: clicksCount || 0,
      totalCustomersReferred: customersCount || 0,
      totalCommissions,
      paidCommissions,
      pendingCommissions,
    }
  } catch (error) {
    console.log('[v0] Database unavailable for stats, returning defaults')
    return {
      totalClicks: 0,
      totalCustomersReferred: 0,
      totalCommissions: 0,
      paidCommissions: 0,
      pendingCommissions: 0,
    }
  }
}

export async function getAffiliateCommissions(affiliateId: string) {
  const supabase = await createClient()

  try {
    const { data, error } = await supabase
      .from('commissions')
      .select('*, order:orders(*)')
      .eq('affiliate_id', affiliateId)
      .order('created_at', { ascending: false })
      .catch(() => ({ data: [], error: null }))

    return data || []
  } catch (error) {
    console.log('[v0] Database unavailable for commissions')
    return []
  }
}

export async function requestWithdrawal(
  affiliateId: string,
  amount: number,
  bankName: string,
  accountNumber: string,
  accountHolder: string
) {
  const supabase = await createClient()

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
    .single()

  if (error) {
    console.error('Error creating withdrawal request:', error)
    return { error }
  }

  return { data }
}

export async function getAffiliateWithdrawals(affiliateId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('withdrawal_requests')
    .select('*')
    .eq('affiliate_id', affiliateId)
    .order('requested_at', { ascending: false })

  if (error) {
    console.error('Error fetching withdrawals:', error)
    return []
  }

  return data || []
}
