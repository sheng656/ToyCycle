'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { useState } from 'react';

export default function Header() {
  const t = useTranslations();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    // Use warm surface-container-low so it feels light & in-palette, not a cold grey/white
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
              <Link
                href="/login"
                className="flex-1 text-center rounded-2xl border-2 border-outline/20 px-4 py-2.5 text-sm font-bold text-primary hover:bg-primary-container/10 transition-colors"
              >
                {t('common.login')}
              </Link>
              <Link
                href="/register"
                className="flex-1 text-center rounded-2xl bg-primary px-4 py-2.5 text-sm font-bold text-white hover:scale-[1.02] transition-all"
              >
                {t('common.register')}
              </Link>
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
