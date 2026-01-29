import { createServiceClient } from './supabase';

export type ClerkUserProfile = {
  clerkUserId: string;
  email: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
};

export async function upsertClerkUser(profile: ClerkUserProfile): Promise<void> {
  const supabase = createServiceClient();

  const { error } = await supabase
    .from('users')
    .upsert(
      {
        clerk_user_id: profile.clerkUserId,
        email: profile.email,
        first_name: profile.firstName,
        last_name: profile.lastName,
        full_name: profile.fullName,
        username: profile.username,
      },
      { onConflict: 'clerk_user_id' }
    );

  if (error) {
    console.error('Error upserting Clerk user:', error);
  }
}
