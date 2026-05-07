import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ExchangesPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ExchangesContent />;
}

function ExchangesContent() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-bold mb-2">{t('exchange.title')}</h1>
      <p className="text-muted mb-8">管理你的交换请求</p>

      {/* Empty state */}
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🔄</span>
        <h2 className="text-lg font-semibold mb-2">{t('exchange.noRequests')}</h2>
        <p className="text-sm text-muted max-w-sm">
          浏览附近的玩具，找到喜欢的就发起交换请求吧！
        </p>
      </div>
    </div>
  );
}
