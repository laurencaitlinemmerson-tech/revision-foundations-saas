import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Client-side Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client with service role (for admin operations)
export function createServiceClient() {
  return createClient(
    supabaseUrl,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );
}

// Database types
export interface User {
  id: string;
  clerk_user_id: string;
  email: string;
  created_at: string;
}

export interface Entitlement {
  id: string;
  clerk_user_id: string;
  product: 'osce' | 'quiz' | 'bundle';
  status: 'active' | 'cancelled' | 'expired';
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface OsceStation {
  id: string;
  topic: string;
  title: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_minutes: number;
  candidate_instructions: string;
  checklist: ChecklistItem[];
  tips: string[];
  premium_only: boolean;
  order_index: number;
}

export interface ChecklistItem {
  text: string;
  critical: boolean;
}

export interface QuizQuestion {
  id: string;
  topic: string;
  type: 'mcq' | 'tf' | 'multiselect';
  difficulty: 'easy' | 'medium' | 'hard';
  question: string;
  options: string[];
  correct: number | number[] | boolean;
  explanation: string;
  premium_only: boolean;
}

export interface UserProgress {
  id: string;
  clerk_user_id: string;
  product: 'osce' | 'quiz';
  topic: string;
  scores: number[];
  streak_count: number;
  last_activity: string;
}

export interface Bookmark {
  id: string;
  clerk_user_id: string;
  item_type: 'station' | 'question';
  item_id: string;
  created_at: string;
}
