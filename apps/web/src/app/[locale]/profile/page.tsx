import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ProfileContent />;
}

function ProfileContent() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-8">{t('profile.myProfile')}</h1>

      {/* Profile Card */}
      <div className="bg-white border-2 border-outline/5 rounded-3xl p-8 shadow-card mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-3xl font-bold shadow-md">
            🧸
          </div>
          <div>
            <h2 className="text-2xl font-heading font-bold">请先登录</h2>
            <p className="text-sm font-bold text-muted">登录后查看个人资料</p>
          </div>
        </div>

        {/* Credits */}
        <div className="p-5 rounded-2xl bg-amber/10 border-2 border-amber/20 mb-8 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-amber/80">{t('profile.creditsBalance')}</span>
            <span className="text-2xl font-bold text-amber">💰 --</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-2">
          <ProfileSection icon="🧸" label={t('profile.myToys')} count="--" />
          <ProfileSection icon="🔄" label={t('profile.exchangeHistory')} count="--" />
          <ProfileSection icon="📍" label={t('profile.location')} count={t('profile.setLocation')} />
        </div>
      </div>
    </div>
  );
}

function ProfileSection({ icon, label, count }: { icon: string; label: string; count: string }) {
  return (
    <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-primary-container/5 transition-all group">
      <div className="flex items-center gap-3">
        <span className="text-xl group-hover:scale-125 transition-transform">{icon}</span>
        <span className="text-sm font-bold text-foreground/80 group-hover:text-primary transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-sm font-bold text-muted">
        <span>{count}</span>
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  );
}
