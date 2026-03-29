import { createServiceClient, Entitlement } from './supabase';

export type Product = 'osce' | 'quiz' | 'bundle';

export async function checkEntitlement(
  clerkUserId: string,
  product: Product
): Promise<boolean> {
  const supabase = createServiceClient();

  const { data: bundleEntitlement } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', clerkUserId)
    .eq('entitlement', 'bundle')
    .eq('status', 'active')
    .maybeSingle();

  if (bundleEntitlement) return true;

  const { data: productEntitlement } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', clerkUserId)
    .eq('entitlement', product)
    .eq('status', 'active')
    .maybeSingle();

  return !!productEntitlement;
}

export async function getUserEntitlements(
  clerkUserId: string
): Promise<Entitlement[]> {
  const supabase = createServiceClient();

  const { data, error } = await supabase
    .from('entitlements')
    .select('*')
    .eq('user_id', clerkUserId)
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
  stripeCustomerId: string | null,
  stripeSubscriptionId: string | null,
  expiresAt: string | null = null
): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('entitlements')
    .upsert(
      {
        user_id: clerkUserId,
        entitlement: product,
        status: 'active',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        expires_at: expiresAt,
      },
      {
        onConflict: 'user_id,entitlement',
      }
    );

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
  if (entitlements.some((e) => e.entitlement === 'bundle' && e.status === 'active')) {
    return true;
  }

  return entitlements.some((e) => e.entitlement === product && e.status === 'active');
}
