import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function LoginPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <LoginContent />;
}

function LoginContent() {
  const t = useTranslations();

  return (
    // Warm surface-container-low background keeps us in the palette, not plain white
    <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-12 bg-surface-container-low">
      <div className="w-full max-w-md animate-fade-in">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-5xl mb-4 block">🧸</span>
          <h1 className="text-3xl font-heading font-bold">{t('auth.loginTitle')}</h1>
          <p className="text-foreground/60 mt-2">{t('auth.loginSubtitle')}</p>
        </div>

        {/* Form Card — use white (surface-container-lowest) so it "floats" on the warm bg */}
        <div className="bg-white rounded-3xl p-8 shadow-card">
          <form className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="block text-sm font-bold mb-1.5">
                {t('auth.email')}
              </label>
              <input
                id="login-email"
                type="email"
                placeholder={t('auth.emailPlaceholder')}
                className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="login-password" className="block text-sm font-bold">
                  {t('auth.password')}
                </label>
                <a href="#" className="text-xs font-bold text-primary hover:text-primary/70 transition-colors">
                  {t('auth.forgotPassword')}
                </a>
              </div>
              <input
                id="login-password"
                type="password"
                placeholder={t('auth.passwordPlaceholder')}
                className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
                required
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              id="login-submit"
              className="w-full rounded-2xl bg-primary px-4 py-3 text-sm font-bold text-white shadow-card hover:scale-[1.02] transition-all active:scale-[0.98]"
            >
              {t('auth.loginButton')}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-outline/15" />
            </div>
            <div className="relative flex justify-center text-xs">
              <span className="bg-white px-3 font-bold text-outline">{t('auth.orContinueWith')}</span>
            </div>
          </div>

          {/* Social Login */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              id="wechat-login"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm font-bold hover:bg-primary-container/10 hover:border-primary/30 transition-all"
            >
              <svg className="w-5 h-5 text-[#07c160]" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8.691 2.188C3.891 2.188 0 5.476 0 9.53c0 2.212 1.17 4.203 3.002 5.55a.59.59 0 0 1 .213.665l-.39 1.48c-.019.07-.048.141-.048.213 0 .163.13.295.29.295a.326.326 0 0 0 .167-.054l1.903-1.114a.864.864 0 0 1 .717-.098 10.16 10.16 0 0 0 2.837.403c.276 0 .543-.027.811-.05-.857-2.578.157-4.972 1.932-6.446 1.703-1.415 3.882-1.98 5.853-1.838-.576-3.583-4.196-6.348-8.596-6.348zM5.785 5.991c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178A1.17 1.17 0 0 1 4.623 7.17c0-.651.52-1.18 1.162-1.18zm5.813 0c.642 0 1.162.529 1.162 1.18a1.17 1.17 0 0 1-1.162 1.178 1.17 1.17 0 0 1-1.162-1.178c0-.651.52-1.18 1.162-1.18zm5.34 2.867c-1.797-.052-3.746.512-5.28 1.786-1.72 1.428-2.687 3.72-1.78 6.22.942 2.453 3.666 4.229 6.884 4.229.826 0 1.622-.12 2.361-.336a.722.722 0 0 1 .598.082l1.584.926a.272.272 0 0 0 .14.047c.134 0 .24-.111.24-.247 0-.06-.023-.12-.038-.177l-.327-1.233a.582.582 0 0 1-.023-.156.49.49 0 0 1 .201-.398C23.024 18.48 24 16.82 24 14.98c0-3.21-2.931-5.837-7.062-6.122zm-2.18 2.909c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982zm4.36 0c.535 0 .969.44.969.982a.976.976 0 0 1-.969.983.976.976 0 0 1-.969-.983c0-.542.434-.982.97-.982z" />
              </svg>
              {t('auth.wechatLogin')}
            </button>
            <button
              type="button"
              id="google-login"
              className="flex items-center justify-center gap-2 rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm font-bold hover:bg-primary-container/10 hover:border-primary/30 transition-all"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              {t('auth.googleLogin')}
            </button>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center mt-6 text-sm text-foreground/60">
          {t('auth.noAccount')}{' '}
          <Link href="/register" className="text-primary font-bold hover:text-primary/70 transition-colors">
            {t('common.register')}
          </Link>
        </p>
      </div>
    </div>
  );
}
