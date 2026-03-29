import { createServiceClient, Entitlement } from './supabase';

export type Product = 'osce' | 'quiz' | 'bundle';

function normalizeEmail(email?: string | null) {
  return email?.toLowerCase().trim() ?? null;
}

export async function checkEntitlement(
  clerkUserId: string,
  product: Product,
  email?: string | null
): Promise<boolean> {
  const supabase = createServiceClient();
  const normalizedEmail = normalizeEmail(email);

  let bundleQuery = supabase
    .from('entitlements')
    .select('*')
    .eq('product', 'bundle')
    .eq('status', 'active');

  if (clerkUserId && normalizedEmail) {
    bundleQuery = bundleQuery.or(
      `clerk_user_id.eq.${clerkUserId},email.eq.${normalizedEmail}`
    );
  } else if (clerkUserId) {
    bundleQuery = bundleQuery.eq('clerk_user_id', clerkUserId);
  } else if (normalizedEmail) {
    bundleQuery = bundleQuery.eq('email', normalizedEmail);
  }

  const { data: bundleEntitlement } = await bundleQuery.single();
  if (bundleEntitlement) return true;

  let productQuery = supabase
    .from('entitlements')
    .select('*')
    .eq('product', product)
    .eq('status', 'active');

  if (clerkUserId && normalizedEmail) {
    productQuery = productQuery.or(
      `clerk_user_id.eq.${clerkUserId},email.eq.${normalizedEmail}`
    );
  } else if (clerkUserId) {
    productQuery = productQuery.eq('clerk_user_id', clerkUserId);
  } else if (normalizedEmail) {
    productQuery = productQuery.eq('email', normalizedEmail);
  }

  const { data: productEntitlement } = await productQuery.single();

  return !!productEntitlement;
}

export async function getUserEntitlements(
  clerkUserId?: string,
  email?: string | null
): Promise<Entitlement[]> {
  const supabase = createServiceClient();
  const normalizedEmail = normalizeEmail(email);

  if (!clerkUserId && !normalizedEmail) {
    return [];
  }

  let query = supabase
    .from('entitlements')
    .select('*')
    .eq('status', 'active');

  if (clerkUserId && normalizedEmail) {
    query = query.or(
      `clerk_user_id.eq.${clerkUserId},email.eq.${normalizedEmail}`
    );
  } else if (clerkUserId) {
    query = query.eq('clerk_user_id', clerkUserId);
  } else if (normalizedEmail) {
    query = query.eq('email', normalizedEmail);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching entitlements:', error);
    return [];
  }

  return data || [];
}

export async function createOrUpdateEntitlement(
  clerkUserId: string,
  email: string,
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
        clerk_user_id: clerkUserId,
        email: normalizeEmail(email),
        product,
        status: 'active',
        stripe_customer_id: stripeCustomerId,
        stripe_subscription_id: stripeSubscriptionId,
        expires_at: expiresAt,
      },
      {
        onConflict: 'clerk_user_id,product',
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
  if (entitlements.some((e) => e.product === 'bundle' && e.status === 'active')) {
    return true;
  }

  return entitlements.some(
    (e) => e.product === product && e.status === 'active'
  );
}
