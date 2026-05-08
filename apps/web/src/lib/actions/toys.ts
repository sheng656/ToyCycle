'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import type { ToyCategory, AgeRange, ToyCondition } from '@toycycle/shared';

export async function createToy(formData: FormData) {
  const supabase = await createClient();

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '请先登录' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as ToyCategory;
  const ageRange = formData.get('ageRange') as AgeRange;
  const condition = formData.get('condition') as ToyCondition;
  const estimatedValue = parseInt(formData.get('estimatedValue') as string);
  const isCleaned = formData.get('isCleaned') === 'on';

  // Get user's location from profile, or use default (Beijing center for now)
  const { data: profile } = await supabase
    .from('profiles')
    .select('latitude, longitude')
    .eq('id', user.id)
    .single();

  const latitude = profile?.latitude || 39.9042;
  const longitude = profile?.longitude || 116.4074;

  // Upload images
  const imageUrls: string[] = [];
  for (let i = 0; i < 5; i++) {
    const file = formData.get(`photo-${i}`) as File | null;
    if (file && file.size > 0) {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('toy-images')
        .upload(filePath, file);

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('toy-images')
          .getPublicUrl(filePath);
        imageUrls.push(publicUrl);
      }
    }
  }

  // Insert toy
  const { data: toy, error: toyError } = await supabase
    .from('toys')
    .insert({
      owner_id: user.id,
      title,
      description,
      category,
      age_range: ageRange,
      condition,
      estimated_value: estimatedValue,
      is_cleaned: isCleaned,
      latitude,
      longitude,
    })
    .select()
    .single();

  if (toyError) {
    return { error: toyError.message };
  }

  // Insert images
  if (imageUrls.length > 0 && toy) {
    await supabase.from('toy_images').insert(
      imageUrls.map((url, index) => ({
        toy_id: toy.id,
        image_url: url,
        display_order: index,
      }))
    );
  }

  redirect(`/toys/${toy.id}`);
}

export async function getToys() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('toys')
    .select(`
      *,
      images:toy_images(*),
      owner:profiles(id, display_name, avatar_url, location_name)
    `)
    .eq('status', 'available')
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('Failed to fetch toys:', error);
    return [];
  }

  return data || [];
}

export async function getToyById(id: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('toys')
    .select(`
      *,
      images:toy_images(*),
      owner:profiles(id, display_name, avatar_url, location_name, credit_balance)
    `)
    .eq('id', id)
    .single();

  if (error) {
    return null;
  }

  return data;
}
