import { setRequestLocale } from 'next-intl/server';
import { getMessages } from '@/lib/actions/chat';
import { createClient } from '@/lib/supabase/server';
import ChatRoom from '@/components/chat/ChatRoom';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface Props {
  params: Promise<{ locale: string; id: string }>;
}

export default async function ConversationPage({ params }: Props) {
  const { locale, id: conversationId } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  // Fetch initial messages and conversation context
  const [messages, { data: conv }] = await Promise.all([
    getMessages(conversationId),
    supabase
      .from('conversations')
      .select(`
        *,
        participants:conversation_participants(user_id, profile:profiles(*)),
        exchange_request:exchange_requests(toy:toys(title))
      `)
      .eq('id', conversationId)
      .single()
  ]);

  if (!conv) redirect('/messages');

  const otherParticipant = conv.participants.find((p: any) => p.user_id !== user.id)?.profile;

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-6 flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Link href="/messages" className="p-2 hover:bg-surface-container-low rounded-xl transition-colors">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </Link>
        
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-heading font-bold truncate">
            {otherParticipant?.display_name || '对话'}
          </h1>
          <p className="text-xs text-muted font-bold truncate">
            关于: {conv.exchange_request?.toy?.title}
          </p>
        </div>

        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center font-bold text-sm">
          {otherParticipant?.display_name?.charAt(0)}
        </div>
      </div>

      {/* Chat Room */}
      <ChatRoom 
        conversationId={conversationId} 
        initialMessages={messages} 
        currentUserId={user.id} 
      />
    </div>
  );
}
