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
        className="inline-flex items-center gap-2 text-sm font-bold text-muted hover:text-primary transition-all mb-6 group"
      >
        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
        </svg>
        {t('common.back')}
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary-container/10 to-primary-container/30 flex items-center justify-center overflow-hidden shadow-card border-2 border-white">
          <span className="text-9xl opacity-40 animate-float">{categoryEmoji}</span>
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary">
              {t(`toys.conditions.${conditionKey}`)}
            </span>
            {toy.is_cleaned && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-success/10 text-success">
                ✨ {t('toys.cleaned')}
              </span>
            )}
          </div>

          <h1 className="text-3xl sm:text-4xl font-heading font-bold mb-3">{toy.title}</h1>

          <div className="flex items-center gap-3 text-sm font-bold text-muted mb-6">
            <span className="bg-surface-container-low px-3 py-1 rounded-xl">{categoryEmoji} {t(`toys.categories.${toy.category}`)}</span>
            <span>·</span>
            <span className="bg-surface-container-low px-3 py-1 rounded-xl">{t(`toys.ageRanges.${toy.age_range}`)}</span>
          </div>

          {/* Credits */}
          <div className="p-5 rounded-3xl bg-amber/10 border-2 border-amber/20 mb-8 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-amber/80">{t('exchange.costLabel')}</span>
              <span className="text-2xl font-bold text-amber">
                💰 {toy.estimated_value} {t('exchange.credits')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <h2 className="text-base font-heading font-bold mb-3">{t('toys.description')}</h2>
            <p className="text-sm text-foreground/70 leading-relaxed bg-surface-container-low/50 p-4 rounded-2xl border-2 border-outline/5">{toy.description}</p>
          </div>

          {/* Owner */}
          {toy.owner && (
            <div className="p-4 rounded-3xl bg-white border-2 border-outline/5 mb-8 shadow-card">
              <h2 className="text-xs font-bold text-muted uppercase tracking-wider mb-4">{t('toys.detail.postedBy')}</h2>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xl font-bold shadow-md">
                  {toy.owner.display_name.charAt(0)}
                </div>
                <div>
                  <div className="font-bold text-base">{toy.owner.display_name}</div>
                  <div className="text-xs text-muted font-medium">{toy.owner.location_name}</div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-auto">
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-card hover:scale-[1.02] transition-all active:scale-[0.98]"
              id="request-exchange"
            >
              🔄 {t('toys.detail.requestExchange')}
            </button>
            <button
              className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-outline/20 px-6 py-4 text-sm font-bold hover:border-primary hover:text-primary hover:bg-primary-container/5 transition-all active:scale-[0.98]"
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
