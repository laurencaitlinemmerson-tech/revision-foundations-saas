import { auth } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { createOrUpdateEntitlement } from '@/lib/entitlements';
import { createServiceClient } from '@/lib/supabase';


  const { userId, sessionClaims } = auth();
  if (!userId) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  const email = sessionClaims?.email;
  if (!email) return NextResponse.json({ error: 'No email found' }, { status: 400 });

  const supabase = createServiceClient();

  // Find all unclaimed purchases for this email
  const { data: purchases, error } = await supabase
    .from('purchases')
    .select('*')
    .eq('customer_email', email)
    .eq('status', 'unclaimed');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const results = [];
  for (const purchase of purchases) {
    // Upsert entitlement (idempotent)
    await createOrUpdateEntitlement(userId, purchase.product_key, null, null, null);
    // Mark purchase as claimed
    await supabase.from('purchases').update({
      status: 'claimed',
      claimed_by_clerk_user_id: userId,
      claimed_at: new Date().toISOString(),
    }).eq('id', purchase.id);
    results.push({ product_key: purchase.product_key, status: 'claimed' });
  }

  return NextResponse.json({ claimed: results });
}
