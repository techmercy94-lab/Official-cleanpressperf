'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export async function getSession() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

export async function getProfile() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return null;
  }

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }

  return data;
}

export async function updateProfile(
  userId: string,
  updates: {
    first_name?: string;
    last_name?: string;
    phone?: string;
    profile_image_url?: string;
    bio?: string;
  }
) {
  const supabase = await createClient();

  const { error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId);

  if (error) {
    console.error('Error updating profile:', error);
    return { error };
  }

  return { success: true };
}

export async function signUp(email: string, password: string, firstName?: string, affiliateCode?: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/callback`,
      data: {
        first_name: firstName || '',
        affiliate_code: affiliateCode || null,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Track affiliate referral if affiliate code provided
  if (affiliateCode && data.user) {
    const { data: affiliate } = await supabase
      .from('profiles')
      .select('id')
      .eq('affiliate_code', affiliateCode)
      .single();

    if (affiliate) {
      await supabase.from('affiliate_customers').insert({
        affiliate_id: affiliate.id,
        customer_id: data.user.id,
        referral_source: 'signup_link',
      }).catch(() => null); // Ignore if duplicate
    }
  }

  return { data };
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  return { data };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/');
}
