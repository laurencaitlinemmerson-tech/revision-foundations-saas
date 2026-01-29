import { clerkClient } from '@clerk/nextjs/server';
import { createServiceClient } from './supabase';

interface UpsertUserParams {
  clerkUserId: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
}

/**
 * Upserts a Clerk user into the Supabase users table
 * This ensures user data is synced between Clerk and Supabase
 */
export async function upsertClerkUser(params: UpsertUserParams) {
  try {
    const { clerkUserId, email, firstName, lastName, fullName, username } = params;
    
    const supabase = createServiceClient();
    
    // Upsert user into Supabase
    const { data, error } = await supabase
      .from('users')
      .upsert({
        id: clerkUserId,
        email: email,
        first_name: firstName,
        last_name: lastName,
        full_name: fullName,
        username: username,
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
