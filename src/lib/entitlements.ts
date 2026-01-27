import { createServiceClient, Entitlement } from './supabase';

export type Product = 'osce' | 'quiz' | 'bundle';

export async function checkEntitlement(
  clerkUserId: string,
  product: Product
): Promise<boolean> {
  const supabase = createServiceClient();

  // Check for bundle first (gives access to everything)
  const { data: bundleEntitlement } = await supabase
    .from('entitlements')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('product', 'bundle')
    .eq('status', 'active')
    .single();

  if (bundleEntitlement) return true;

  // Check for specific product
  const { data: productEntitlement } = await supabase
    .from('entitlements')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('product', product)
    .eq('status', 'active')
    .single();

  return !!productEntitlement;
}

export async function getUserEntitlements(
  clerkUserId: string
): Promise<Entitlement[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('entitlements')
    .select('*')
    .eq('clerk_user_id', clerkUserId)
    .eq('status', 'active');

  if (error) {
    console.error('Error fetching entitlements:', error);
    return [];
  }

  return data || [];
}

export async function createOrUpdateEntitlement(
  clerkUserId: string,
  product: Product,
  stripeCustomerId: string,
  stripeSubscriptionId: string | null,
  expiresAt: string | null = null
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('entitlements')
    .upsert({
      clerk_user_id: clerkUserId,
      product,
      status: 'active',
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      expires_at: expiresAt,
    }, {
      onConflict: 'clerk_user_id,product'
    });

  if (error) {
    console.error('Error creating entitlement:', error);
    throw error;
  }
}

export async function cancelEntitlement(
  stripeSubscriptionId: string
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('entitlements')
    .update({ status: 'cancelled' })
    .eq('stripe_subscription_id', stripeSubscriptionId);

  if (error) {
    console.error('Error cancelling entitlement:', error);
    throw error;
  }
}

export function hasAccessToContent(
  entitlements: Entitlement[],
  product: Product
): boolean {
  // Bundle gives access to everything
  if (entitlements.some(e => e.product === 'bundle' && e.status === 'active')) {
    return true;
  }
  // Check specific product
  return entitlements.some(e => e.product === product && e.status === 'active');
}
