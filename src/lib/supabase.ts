import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import { mockTeamLeaders } from './mock-data';
import type { TeamLeader } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

const isRealSupabase =
  !!SUPABASE_URL &&
  !!SUPABASE_ANON_KEY &&
  !SUPABASE_URL.includes('demo.supabase.co') &&
  SUPABASE_ANON_KEY !== 'demo-key';

let cachedClient: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isRealSupabase) return null;
  if (!cachedClient) {
    cachedClient = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!, {
      auth: { persistSession: false },
    });
  }
  return cachedClient;
}

export async function fetchPublishedTeamLeaders(): Promise<TeamLeader[]> {
  const client = getSupabaseClient();
  if (!client) {
    return mockTeamLeaders.filter((t) => t.status === 'published');
  }
  const { data, error } = await client
    .from('team_leader_profiles')
    .select('*')
    .eq('status', 'published')
    .order('created_at', { ascending: false });
  if (error || !data) {
    return mockTeamLeaders.filter((t) => t.status === 'published');
  }
  return data as TeamLeader[];
}

export async function fetchTeamLeaderBySlug(slug: string): Promise<TeamLeader | null> {
  const client = getSupabaseClient();
  if (!client) {
    return mockTeamLeaders.find((t) => t.slug === slug) ?? null;
  }
  const { data, error } = await client
    .from('team_leader_profiles')
    .select('*')
    .eq('slug', slug)
    .maybeSingle();
  if (error || !data) {
    return mockTeamLeaders.find((t) => t.slug === slug) ?? null;
  }
  return data as TeamLeader;
}

export async function fetchAllTeamLeaders(): Promise<TeamLeader[]> {
  const client = getSupabaseClient();
  if (!client) {
    return mockTeamLeaders;
  }
  const { data, error } = await client
    .from('team_leader_profiles')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) {
    return mockTeamLeaders;
  }
  return data as TeamLeader[];
}
