import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { MOCK_TOYS } from '@/lib/mock-data';
import { TOY_CATEGORIES } from '@toycycle/shared';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function ToyDetailPage({ params }: Props) {
  const { locale, id } = await params;
  setRequestLocale(locale);

  // TODO: Replace with Supabase query
  const toy = MOCK_TOYS.find((t) => t.id === id);
  if (!toy) notFound();

  return <ToyDetailContent toy={toy} />;
}

function ToyDetailContent({ toy }: { toy: (typeof MOCK_TOYS)[0] }) {
  const t = useTranslations();
  const categoryEmoji = TOY_CATEGORIES[toy.category] || '📦';
  const conditionKey = toy.condition === 'like_new' ? 'likeNew' : toy.condition;

  return (
    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Back */}
      <Link
        href="/toys"
        className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Image */}
        <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary-50 to-primary-100 flex items-center justify-center overflow-hidden">
          <span className="text-9xl opacity-50">{categoryEmoji}</span>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-dark">
              {t(`toys.conditions.${conditionKey}`)}
            </span>
            {toy.is_cleaned && (
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-50 text-green-700">
                ✨ {t('toys.cleaned')}
              </span>
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold mb-2">{toy.title}</h1>

          <div className="flex items-center gap-3 text-sm text-muted mb-4">
            <span>{categoryEmoji} {t(`toys.categories.${toy.category}`)}</span>
            <span>·</span>
            <span>{t(`toys.ageRanges.${toy.age_range}`)}</span>
          </div>

          {/* Credits */}
          <div className="p-4 rounded-xl bg-secondary/10 border border-secondary/20 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-secondary-dark">{t('exchange.costLabel')}</span>
              <span className="text-2xl font-bold text-secondary-dark">
                💰 {toy.estimated_value} {t('exchange.credits')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="text-sm font-semibold mb-2">{t('toys.description')}</h2>
            <p className="text-sm text-muted leading-relaxed">{toy.description}</p>
          </div>

          {/* Owner */}
          {toy.owner && (
            <div className="p-4 rounded-xl bg-surface-elevated border border-border mb-6">
              <h2 className="text-sm font-semibold mb-3">{t('toys.detail.postedBy')}</h2>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white font-bold">
                  {toy.owner.display_name.charAt(0)}
                </div>
                <div>
                  <div className="font-medium text-sm">{toy.owner.display_name}</div>
                  <div className="text-xs text-muted">{toy.owner.location_name}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all active:scale-[0.98]"
              id="request-exchange"
            >
              🔄 {t('toys.detail.requestExchange')}
            </button>
            <button
              className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-border px-6 py-3 text-sm font-semibold hover:border-primary hover:text-primary transition-all"
              id="send-message"
            >
              💬 {t('toys.detail.sendMessage')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
