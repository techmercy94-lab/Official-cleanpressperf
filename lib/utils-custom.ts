// Currency formatter for Nigerian Naira
export function formatNaira(amountInKobo: number): string {
  const amountInNaira = amountInKobo / 100;
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amountInNaira);
}

// Convert Naira to Kobo
export function nairaToKobo(amountInNaira: number): number {
  return Math.round(amountInNaira * 100);
}

// Convert Kobo to Naira
export function koboToNaira(amountInKobo: number): number {
  return amountInKobo / 100;
}

// Generate affiliate code
export function generateAffiliateCode(): string {
  return 'AFF' + Math.random().toString(36).substring(2, 10).toUpperCase();
}

// Calculate commission
export function calculateCommission(orderAmount: number, commissionRate: number): number {
  return Math.floor((orderAmount * commissionRate) / 100);
}

// Format date
export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Get initials from name
export function getInitials(firstName: string, lastName?: string): string {
  return (firstName?.[0] || '') + (lastName?.[0] || '');
}

// Slugify text
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Check if user is authenticated
export async function checkAuth() {
  const { createClient } = await import('@/lib/supabase/client');
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
