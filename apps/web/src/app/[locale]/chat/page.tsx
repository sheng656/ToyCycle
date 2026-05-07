import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ChatPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ChatContent />;
}

function ChatContent() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('chat.conversations')}</h1>
      <p className="text-muted mb-8">与附近家庭沟通交换细节</p>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">💬</span>
        <h2 className="text-lg font-semibold mb-2">{t('chat.noConversations')}</h2>
        <p className="text-sm text-muted max-w-sm">
          当你发起交换请求或收到交换请求后，就可以在这里和对方聊天了。
        </p>
      </div>
    </div>
  );
}
