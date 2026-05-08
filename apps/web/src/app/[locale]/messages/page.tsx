import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getConversations } from '@/lib/actions/chat';
import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';
import { redirect } from 'next/navigation';

export default async function MessagesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const conversations = await getConversations();
  const t = await getTranslations({ locale });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-8">我的消息</h1>

      <div className="space-y-4">
        {conversations.length > 0 ? (
          conversations.map((conv: any) => (
            <Link 
              key={conv.id} 
              href={`/messages/${conv.id}`}
              className="flex items-center gap-4 p-4 bg-white border-2 border-outline/5 rounded-3xl hover:shadow-card hover:border-primary/10 transition-all group"
            >
              {/* Avatar */}
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold flex-shrink-0 overflow-hidden">
                {conv.other_participant?.avatar_url ? (
                  <img src={conv.other_participant.avatar_url} className="w-full h-full object-cover" />
                ) : (
                  conv.other_participant?.display_name?.charAt(0) || '?'
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold truncate text-foreground group-hover:text-primary transition-colors">
                    {conv.other_participant?.display_name || '未知用户'}
                  </h3>
                  <span className="text-[10px] text-muted font-medium whitespace-nowrap">
                    {new Date(conv.last_message_at).toLocaleDateString()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted bg-surface-container-low px-2 py-0.5 rounded-lg">
                    关于: {conv.exchange_request?.toy?.title}
                  </span>
                </div>

                <p className="text-sm text-muted truncate">
                  点击开始聊天...
                </p>
              </div>

              {/* Arrow */}
              <div className="text-muted group-hover:translate-x-1 transition-transform">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
            </Link>
          ))
        ) : (
          <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline/10">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-muted font-bold">暂无消息对话</p>
            <p className="text-xs text-muted mt-2">发起玩具交换后，在这里与对方沟通</p>
          </div>
        )}
      </div>
    </div>
  );
}
