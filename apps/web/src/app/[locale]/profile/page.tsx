import { setRequestLocale } from 'next-intl/server';
import { getTranslations } from 'next-intl/server';
import { getUserProfile, getUserToys, getReceivedRequests, getSentRequests } from '@/lib/actions/profile';
import ProfileTabs from '@/components/profile/ProfileTabs';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ProfilePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const [profile, userToys, receivedRequests, sentRequests] = await Promise.all([
    getUserProfile(),
    getUserToys(),
    getReceivedRequests(),
    getSentRequests()
  ]);

  if (!profile) {
    redirect('/login');
  }

  const t = await getTranslations({ locale });

  return (
    <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <h1 className="text-2xl sm:text-3xl font-heading font-bold mb-8">{t('profile.myProfile')}</h1>

      {/* Profile Header Card */}
      <div className="bg-white border-2 border-outline/5 rounded-3xl p-6 sm:p-8 shadow-card mb-8">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-3xl font-bold shadow-md overflow-hidden flex-shrink-0">
            {profile.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              profile.display_name.charAt(0)
            )}
          </div>
          <div className="min-w-0">
            <h2 className="text-2xl font-heading font-bold truncate">{profile.display_name}</h2>
            <p className="text-sm font-bold text-muted truncate">@{profile.username}</p>
            <div className="flex items-center gap-2 mt-1 text-xs text-muted font-medium">
              <span>📍 {profile.location_name || t('profile.setLocation')}</span>
            </div>
          </div>
        </div>

        {/* Credits Dashboard */}
        <div className="p-5 rounded-2xl bg-amber/10 border-2 border-amber/20 shadow-sm relative overflow-hidden group">
          <div className="absolute -right-4 -bottom-4 text-6xl opacity-10 group-hover:scale-110 transition-transform">💰</div>
          <div className="flex items-center justify-between relative z-10">
            <div>
              <span className="text-sm font-bold text-amber/80 block">{t('profile.creditsBalance')}</span>
              <span className="text-3xl font-bold text-amber">💰 {profile.credit_balance}</span>
            </div>
            <button className="bg-amber text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md hover:scale-105 transition-all">
              查看明细
            </button>
          </div>
        </div>
      </div>

      {/* Activity Tabs */}
      <ProfileTabs 
        userToys={userToys} 
        receivedRequests={receivedRequests} 
        sentRequests={sentRequests} 
      />
    </div>
  );
}
