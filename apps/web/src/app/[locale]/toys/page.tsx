import { useTranslations } from 'next-intl';
import { setRequestLocale } from 'next-intl/server';
import ToyList from '@/components/toys/ToyList';

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function ToysPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ToysContent />;
}

function ToysContent() {
  const t = useTranslations();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-heading font-bold">{t('nav.discover')}</h1>
          <p className="text-muted mt-1">{t('home.subtitle')}</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-outline/20 text-sm font-bold hover:bg-primary-container/10 hover:border-primary/30 transition-all"
            id="filter-walk"
          >
            🚶 {t('home.walkMode')}
          </button>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-primary bg-primary-container/20 text-primary text-sm font-bold hover:bg-primary-container/30 transition-all"
            id="filter-drive"
          >
            🚗 {t('home.driveMode')}
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder={t('common.search') + '...'}
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-outline/20 bg-white text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
            id="toy-search"
          />
        </div>
      </div>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2 mb-8" id="category-filters">
        <CategoryChip emoji="🧱" label={t('toys.categories.building')} />
        <CategoryChip emoji="🧸" label={t('toys.categories.figures')} />
        <CategoryChip emoji="🚗" label={t('toys.categories.vehicles')} />
        <CategoryChip emoji="🧩" label={t('toys.categories.puzzles')} />
        <CategoryChip emoji="⚽" label={t('toys.categories.outdoor')} />
        <CategoryChip emoji="🎮" label={t('toys.categories.electronic')} />
        <CategoryChip emoji="🐻" label={t('toys.categories.stuffed')} />
        <CategoryChip emoji="📐" label={t('toys.categories.educational')} />
        <CategoryChip emoji="🎨" label={t('toys.categories.creative')} />
      </div>

      {/* Toy Grid */}
      <ToyList />
    </div>
  );
}

function CategoryChip({ emoji, label }: { emoji: string; label: string }) {
  return (
    <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-2 border-outline/20 text-sm font-bold hover:border-primary hover:text-primary hover:bg-primary-container/10 transition-all">
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
