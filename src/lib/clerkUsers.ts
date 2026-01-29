import { clerkClient } from '@clerk/nextjs/server';
import { createServiceClient } from './supabase';

/**
 * Upserts a Clerk user into the Supabase users table
 * This ensures user data is synced between Clerk and Supabase
 */
export async function upsertClerkUser(clerkUserId: string) {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(clerkUserId);
    
    if (!user) {
      console.error('User not found in Clerk:', clerkUserId);
      return null;
    }

    const supabase = createServiceClient();
    
    // Upsert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        first_name: user.firstName || '',
        last_name: user.lastName || '',
        image_url: user.imageUrl || '',
        updated_at: new Date().toISOString(),
      }, {
        onConflict: 'id',
      })
      .select()
      .single();

    if (error) {
      console.error('Error upserting user to Supabase:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in upsertClerkUser:', error);
    return null;
  }
}

/**
 * Gets a user from Supabase by their Clerk ID
 */
export async function getUserFromSupabase(clerkUserId: string) {
  try {
    const supabase = createServiceClient();
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', clerkUserId)
      .single();

    if (error) {
      console.error('Error fetching user from Supabase:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getUserFromSupabase:', error);
    return null;
  }
}
