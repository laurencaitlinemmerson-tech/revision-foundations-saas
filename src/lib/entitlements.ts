import { createServiceClient, Entitlement } from './supabase';

export type Product = 'osce' | 'quiz' | 'bundle';

function normalizeEmail(email?: string | null) {
  return email?.toLowerCase().trim() ?? null;
}

function applyIdentityFilter<T extends { or: Function; eq: Function }>(
  query: T,
  clerkUserId?: string | null,
  email?: string | null
): T {
  const normalizedEmail = normalizeEmail(email);

  if (clerkUserId && normalizedEmail) {
    return query.or(
      `clerk_user_id.eq.${clerkUserId},email.eq.${normalizedEmail}`
    ) as T;
  }

  if (clerkUserId) {
    return query.eq('clerk_user_id', clerkUserId) as T;
  }

  if (normalizedEmail) {
    return query.eq('email', normalizedEmail) as T;
  }

  return query;
}

export async function checkEntitlement(
  clerkUserId?: string | null,
  product?: Product,
  email?: string | null
): Promise<boolean> {
  const supabase = createServiceClient();
  const normalizedEmail = normalizeEmail(email);

  if (!clerkUserId && !normalizedEmail) {
    return false;
  }

  if (!product) {
    return false;
  }

  const now = new Date().toISOString();

  let bundleQuery = supabase
    .from('entitlements')
    .select('*')
    .eq('product', 'bundle')
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1);

  bundleQuery = applyIdentityFilter(bundleQuery, clerkUserId, normalizedEmail);

  const { data: bundleEntitlements, error: bundleError } = await bundleQuery;

  if (bundleError) {
    console.error('Error checking bundle entitlement:', bundleError);
    return false;
  }

  if (bundleEntitlements && bundleEntitlements.length > 0) {
    return true;
  }

  let productQuery = supabase
    .from('entitlements')
    .select('*')
    .eq('product', product)
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`)
    .limit(1);

  productQuery = applyIdentityFilter(productQuery, clerkUserId, normalizedEmail);

  const { data: productEntitlements, error: productError } = await productQuery;

  if (productError) {
    console.error('Error checking product entitlement:', productError);
    return false;
  }

  return !!(productEntitlements && productEntitlements.length > 0);
}

export async function getUserEntitlements(
  clerkUserId?: string | null,
  email?: string | null
): Promise<Entitlement[]> {
  const supabase = createServiceClient();
  const normalizedEmail = normalizeEmail(email);

  if (!clerkUserId && !normalizedEmail) {
    return [];
  }

  const now = new Date().toISOString();

  let query = supabase
    .from('entitlements')
    .select('*')
    .eq('status', 'active')
    .or(`expires_at.is.null,expires_at.gt.${now}`);

  query = applyIdentityFilter(query, clerkUserId, normalizedEmail);

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching entitlements:', error);
    return [];
  }

  return data ?? [];
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
  return entitlements.some(
    (e) =>
      e.status === 'active' &&
      (e.expires_at == null || new Date(e.expires_at) > new Date()) &&
      (e.product === 'bundle' || e.product === product)
  );
}
