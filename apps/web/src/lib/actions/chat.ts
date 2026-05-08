'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { Conversation, Message, Profile } from '@toycycle/shared';

const MESSAGE_LIMIT_PENDING = 3;

export async function getOrCreateConversation(exchangeRequestId?: string, otherUserId?: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '请先登录' };

  let participantId = otherUserId;

  // 1. If exchangeRequestId provided, get request info
  if (exchangeRequestId) {
    const { data: request } = await supabase
      .from('exchange_requests')
      .select('requester_id, owner_id')
      .eq('id', exchangeRequestId)
      .single();
    
    if (request) {
      participantId = request.requester_id === user.id ? request.owner_id : request.requester_id;
    }
  }

  if (!participantId) return { error: '未找到聊天对象' };

  // 2. Check if conversation already exists (either by exchangeId or by participants for direct chat)
  const query = supabase.from('conversations').select('id');
  if (exchangeRequestId) {
    query.eq('exchange_request_id', exchangeRequestId);
  } else {
    // For direct chat, we'd need a more complex check on participants. 
    // For MVP simplicity, we'll focus on exchange-based chat.
    return { error: '目前仅支持针对特定交换请求的聊天' };
  }

  const { data: existingConv } = await query.single();

  if (existingConv) {
    return { success: true, conversationId: existingConv.id };
  }

  // 3. Create new conversation
  const { data: newConv, error: convError } = await supabase
    .from('conversations')
    .insert({ exchange_request_id: exchangeRequestId || null })
    .select()
    .single();

  if (convError) return { error: convError.message };

  // 4. Add participants
  await supabase.from('conversation_participants').insert([
    { conversation_id: newConv.id, user_id: user.id },
    { conversation_id: newConv.id, user_id: participantId }
  ]);

  return { success: true, conversationId: newConv.id };
}

export async function getConversations() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('conversations')
    .select(`
      *,
      participants:conversation_participants(user_id, profile:profiles(*)),
      exchange_request:exchange_requests(id, status, toy:toys(title))
    `)
    .order('last_message_at', { ascending: false });

  if (error) return [];

  // Filter conversations where user is a participant and format
  return data.filter((c: any) => 
    c.participants.some((p: any) => p.user_id === user.id)
  ).map((c: any) => ({
    ...c,
    other_participant: c.participants.find((p: any) => p.user_id !== user.id)?.profile
  }));
}

export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true });

  if (error) return [];
  return data as Message[];
}

export async function sendMessage(conversationId: string, content: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: '请先登录' };

  // 1. Check message limit for pending requests
  const { data: conv } = await supabase
    .from('conversations')
    .select('id, exchange_request_id, exchange_request:exchange_requests(status)')
    .eq('id', conversationId)
    .single();

  if ((conv?.exchange_request as any)?.status === 'pending') {
    // Count last messages from this sender
    const { data: lastMessages } = await supabase
      .from('messages')
      .select('sender_id')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: false })
      .limit(MESSAGE_LIMIT_PENDING);

    if (lastMessages && lastMessages.length === MESSAGE_LIMIT_PENDING) {
      const allMine = lastMessages.every(m => m.sender_id === user.id);
      if (allMine) {
        return { error: '等待对方回复前，最多连续发送 3 条消息' };
      }
    }
  }

  // 2. Insert message
  const { data: message, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      sender_id: user.id,
      content: content.trim()
    })
    .select()
    .single();

  if (error) return { error: error.message };

  // 3. Update conversation timestamp
  await supabase
    .from('conversations')
    .update({ last_message_at: new Date().toISOString() })
    .eq('id', conversationId);

  return { success: true, message };
}
