import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not found. Username tracking will be disabled.');
}

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Database table interface
export interface UsernameUsage {
  id: string;
  username: string;
  usage_count: number;
  created_at: string;
  updated_at: string;
}

// Service functions
export const usernameTrackingService = {
  // Record username usage (increment count or create new entry)
  async recordUsage(username: string): Promise<void> {
    if (!supabase) {
      console.warn('Supabase not configured, skipping username tracking');
      return;
    }

    try {
      // First, try to get existing record
      const { data: existing } = await supabase
        .from('username_usage')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (existing) {
        // Increment existing count
        const { error } = await supabase
          .from('username_usage')
          .update({
            usage_count: existing.usage_count + 1,
            updated_at: new Date().toISOString()
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Create new record
        const { error } = await supabase
          .from('username_usage')
          .insert({
            username: username.toLowerCase(),
            usage_count: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });

        if (error) throw error;
      }

      console.log(`Recorded usage for username: ${username}`);
    } catch (error) {
      console.error('Failed to record username usage:', error);
      // Don't throw error - tracking failure shouldn't break the app
    }
  },

  // Get usage statistics for a username
  async getUsageStats(username: string): Promise<UsernameUsage | null> {
    if (!supabase) return null;

    try {
      const { data, error } = await supabase
        .from('username_usage')
        .select('*')
        .eq('username', username.toLowerCase())
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Failed to get usage stats:', error);
      return null;
    }
  },

  // Get top used usernames (for analytics)
  async getTopUsernames(limit: number = 10): Promise<UsernameUsage[]> {
    if (!supabase) return [];

    try {
      const { data, error } = await supabase
        .from('username_usage')
        .select('*')
        .order('usage_count', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Failed to get top usernames:', error);
      return [];
    }
  }
};