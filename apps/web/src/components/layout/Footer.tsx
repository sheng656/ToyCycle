import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';

export default function Footer() {
  const t = useTranslations();

  return (
    <footer className="border-t border-outline/10 bg-surface-container-low">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">🧸</span>
              <span className="text-lg font-heading font-bold bg-gradient-to-r from-primary to-primary-container bg-clip-text text-transparent">
                {t('common.appName')}
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">{t('common.appName')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/toys" className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('nav.discover')}
                </Link>
              </li>
              <li>
                <Link href="/toys/new" className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('nav.listToy')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">{t('footer.about')}</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('footer.terms')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('footer.privacy')}
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-muted hover:text-foreground transition-colors">
                  {t('footer.contact')}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-outline/10 text-center">
          <p className="text-xs text-foreground/50">
            © {new Date().getFullYear()} {t('common.appName')}. Built with ❤️ for families, communities, and the planet.
          </p>
        </div>
      </div>
    </footer>
  );
}
