'use client';

import { useState, useEffect, useRef, useTransition } from 'react';
import { createClient } from '@/lib/supabase/client';
import { sendMessage } from '@/lib/actions/chat';
import type { Message } from '@toycycle/shared';

interface ChatRoomProps {
  conversationId: string;
  initialMessages: Message[];
  currentUserId: string;
}

export default function ChatRoom({ conversationId, initialMessages, currentUserId }: ChatRoomProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const [isPending, startTransition] = useTransition();
  const scrollRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  // Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`conversation:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`
        },
        (payload) => {
          const newMessage = payload.new as Message;
          setMessages((prev) => {
            // Prevent duplicates if the sender already added it locally
            if (prev.find((m) => m.id === newMessage.id)) return prev;
            return [...prev, newMessage];
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, supabase]);

  const handleSend = () => {
    if (!inputValue.trim() || isPending) return;

    const content = inputValue;
    setInputValue('');

    startTransition(async () => {
      const res = await sendMessage(conversationId, content);
      if (res.error) {
        alert(res.error);
        setInputValue(content); // Restore if failed
      }
    });
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] max-h-[700px] bg-white border-2 border-outline/5 rounded-3xl overflow-hidden shadow-card">
      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => {
          const isMine = msg.sender_id === currentUserId;
          return (
            <div 
              key={msg.id} 
              className={`flex ${isMine ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2 duration-300`}
            >
              <div 
                className={`max-w-[80%] px-4 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                  isMine 
                    ? 'bg-primary text-white rounded-br-none' 
                    : 'bg-surface-container-low text-foreground rounded-bl-none'
                }`}
              >
                {msg.content}
                <div className={`text-[10px] mt-1 opacity-60 ${isMine ? 'text-right' : 'text-left'}`}>
                  {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t-2 border-outline/5 bg-surface-container-lowest">
        <div className="flex gap-2 bg-white border-2 border-outline/10 p-1 rounded-2xl focus-within:border-primary/30 transition-all shadow-sm">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="输入消息..."
            className="flex-1 px-4 py-2 bg-transparent outline-none text-sm font-bold"
          />
          <button
            onClick={handleSend}
            disabled={isPending || !inputValue.trim()}
            className="px-6 py-2 bg-primary text-white rounded-xl text-sm font-bold hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isPending ? '...' : '发送'}
          </button>
        </div>
      </div>
    </div>
  );
}
