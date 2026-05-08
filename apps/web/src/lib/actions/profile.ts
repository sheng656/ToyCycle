'use server';

import { createClient } from '@/lib/supabase/server';
import type { Profile, ToyWithImages, ExchangeRequestWithDetails } from '@toycycle/shared';

export async function getUserProfile() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (error) return null;
  return profile as Profile;
}

export async function getUserToys() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('toys')
    .select(`
      *,
      images:toy_images(*)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as ToyWithImages[];
}

export async function getReceivedRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('exchange_requests')
    .select(`
      *,
      toy:toys(*, images:toy_images(*)),
      requester:profiles(*)
    `)
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as any[];
}

export async function getSentRequests() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from('exchange_requests')
    .select(`
      *,
      toy:toys(*, images:toy_images(*)),
      owner:profiles(*)
    `)
    .eq('requester_id', user.id)
    .order('created_at', { ascending: false });

  if (error) return [];
  return data as any[];
}
