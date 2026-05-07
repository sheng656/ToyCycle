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
      <h1 className="text-2xl sm:text-3xl font-bold mb-8">{t('profile.myProfile')}</h1>

      {/* Profile Card */}
      <div className="bg-surface border border-border rounded-2xl p-8 shadow-card mb-8">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold">
            🧸
          </div>
          <div>
            <h2 className="text-xl font-bold">请先登录</h2>
            <p className="text-sm text-muted">登录后查看个人资料</p>
          </div>
        </div>

        {/* Credits */}
        <div className="p-4 rounded-xl bg-gradient-to-r from-secondary/10 to-secondary/5 border border-secondary/20 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{t('profile.creditsBalance')}</span>
            <span className="text-2xl font-bold text-secondary-dark">💰 --</span>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-3">
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
    <button className="w-full flex items-center justify-between p-4 rounded-xl hover:bg-surface-elevated transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xl">{icon}</span>
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="flex items-center gap-2 text-sm text-muted">
        <span>{count}</span>
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
        </svg>
      </div>
    </button>
  );
}
