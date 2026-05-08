'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { User } from '@supabase/supabase-js';
import { signOut } from '@/lib/actions/auth';

export default function Header() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check initial auth state
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-outline/10 bg-surface-container-low/90 backdrop-blur-xl">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl" role="img" aria-label="toy">
              🧸
            </span>
            <span className="text-xl font-heading font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
              {t('common.appName')}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1" id="main-nav">
            <NavLink href="/">{t('nav.home')}</NavLink>
            <NavLink href="/toys">{t('nav.discover')}</NavLink>
            <NavLink href="/toys/new">{t('nav.listToy')}</NavLink>
            <NavLink href="/chat">{t('nav.messages')}</NavLink>
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <Link
                  href="/profile"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary/80 hover:text-primary transition-colors"
                  id="profile-button"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
                    {user.user_metadata?.display_name?.charAt(0) || '👤'}
                  </div>
                </Link>
                <form action={signOut}>
                  <button
                    type="submit"
                    className="text-sm font-medium text-muted hover:text-error transition-colors"
                    id="logout-button"
                  >
                    {t('common.logout')}
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-bold text-primary/80 hover:text-primary transition-colors"
                  id="login-button"
                >
                  {t('common.login')}
                </Link>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center rounded-2xl bg-primary px-5 py-2 text-sm font-bold text-white shadow-card hover:scale-[1.03] transition-all active:scale-[0.97]"
                  id="register-button"
                >
                  {t('common.register')}
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl hover:bg-primary-container/10 transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            id="mobile-menu-button"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-outline/10 py-4 animate-fade-in" id="mobile-menu">
            <nav className="flex flex-col gap-1">
              <MobileNavLink href="/" onClick={() => setMobileMenuOpen(false)}>{t('nav.home')}</MobileNavLink>
              <MobileNavLink href="/toys" onClick={() => setMobileMenuOpen(false)}>{t('nav.discover')}</MobileNavLink>
              <MobileNavLink href="/toys/new" onClick={() => setMobileMenuOpen(false)}>{t('nav.listToy')}</MobileNavLink>
              <MobileNavLink href="/chat" onClick={() => setMobileMenuOpen(false)}>{t('nav.messages')}</MobileNavLink>
            </nav>
            <div className="mt-4 pt-4 border-t border-outline/10 flex gap-3">
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className="flex-1 text-center rounded-2xl border-2 border-outline/20 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary-container/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('profile.myProfile')}
                  </Link>
                  <form action={signOut} className="flex-1">
                    <button
                      type="submit"
                      className="w-full text-center rounded-2xl bg-error/10 px-4 py-2.5 text-sm font-bold text-error transition-colors"
                    >
                      {t('common.logout')}
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex-1 text-center rounded-2xl border-2 border-outline/20 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary-container/10 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.login')}
                  </Link>
                  <Link
                    href="/register"
                    className="flex-1 text-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:scale-[1.02] transition-all"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('common.register')}
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="px-3 py-2 rounded-xl text-sm font-bold text-foreground/70 hover:text-primary hover:bg-primary-container/10 transition-all"
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <Link
      href={href}
      className="px-3 py-2.5 rounded-xl text-base font-bold text-foreground/70 hover:text-primary hover:bg-primary-container/10 transition-all"
      onClick={onClick}
    >
      {children}
    </Link>
  );
}
