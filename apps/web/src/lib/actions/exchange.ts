'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { ExchangeStatus } from '@toycycle/shared';

export async function createExchangeRequest(toyId: string, message: string = '') {
  const supabase = await createClient();

  // 1. Verify user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return { error: '请先登录' };
  }

  // 2. Get toy
  const { data: toy, error: toyError } = await supabase
    .from('toys')
    .select('id, owner_id, estimated_value, status')
    .eq('id', toyId)
    .single();

  if (toyError || !toy) {
    return { error: '玩具不存在' };
  }

  if (toy.status !== 'available') {
    return { error: '该玩具不可交换' };
  }

  if (toy.owner_id === user.id) {
    return { error: '不能交换自己的玩具' };
  }

  // 3. Check credits
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('credit_balance')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    return { error: '无法获取用户信息' };
  }

  if (profile.credit_balance < toy.estimated_value) {
    return { error: '玩具币不足' };
  }

  // 4. Check if already requested
  const { data: existingReq } = await supabase
    .from('exchange_requests')
    .select('id')
    .eq('toy_id', toyId)
    .eq('requester_id', user.id)
    .in('status', ['pending', 'accepted'])
    .single();

  if (existingReq) {
    return { error: '您已经申请过该玩具了' };
  }

  // 5. Create request (In a real app, use RPC for transaction to deduct credits safely)
  // For MVP: We just create the request, and we'll deduct credits when accepted.
  // Or we deduct them now. Let's deduct now.
  const { data: request, error: requestError } = await supabase
    .from('exchange_requests')
    .insert({
      toy_id: toyId,
      requester_id: user.id,
      owner_id: toy.owner_id,
      status: 'pending' as ExchangeStatus,
      credits_amount: toy.estimated_value,
      message: message,
    })
    .select()
    .single();

  if (requestError) {
    return { error: requestError.message };
  }

  // Deduct credits temporarily (hold)
  await supabase
    .from('profiles')
    .update({ credit_balance: profile.credit_balance - toy.estimated_value })
    .eq('id', user.id);
    
  // Record transaction
  await supabase
    .from('credit_transactions')
    .insert({
      user_id: user.id,
      amount: -toy.estimated_value,
      type: 'spend',
      description: '申请交换扣除预留金',
      related_exchange_id: request.id
    });

  // Revalidate paths
  revalidatePath('/toys');
  revalidatePath(`/toys/${toyId}`);
  revalidatePath('/profile');

  return { success: true, data: request };
}
