'use client';

import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { ToyWithImages } from '@toycycle/shared';
import { TOY_CATEGORIES } from '@toycycle/shared';

interface ToyCardProps {
  toy: ToyWithImages;
}

export default function ToyCard({ toy }: ToyCardProps) {
  const t = useTranslations();
  const categoryEmoji = TOY_CATEGORIES[toy.category] || '📦';
  const conditionKey = toy.condition === 'like_new' ? 'likeNew' : toy.condition;

  return (
    <Link
      href={`/toys/${toy.id}`}
      className="group block rounded-2xl bg-surface border border-border shadow-card hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 overflow-hidden"
      id={`toy-card-${toy.id}`}
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-primary-50 to-primary-100 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-60 group-hover:scale-110 transition-transform duration-300">
            {categoryEmoji}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-primary-dark shadow-sm">
            {t(`toys.conditions.${conditionKey}`)}
          </span>
        </div>

        {/* Cleaned badge */}
        {toy.is_cleaned && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-white/90 backdrop-blur-sm text-success shadow-sm">
              ✨ {t('toys.cleaned')}
            </span>
          </div>
        )}

        {/* Credits */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-secondary/90 backdrop-blur-sm text-white shadow-md">
            💰 {toy.estimated_value}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {toy.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs text-muted">
          <span>{categoryEmoji} {t(`toys.categories.${toy.category}`)}</span>
          <span>·</span>
          <span>{t(`toys.ageRanges.${toy.age_range}`)}</span>
        </div>

        {toy.owner && (
          <div className="mt-3 pt-3 border-t border-border-light flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center text-white text-xs font-bold">
              {toy.owner.display_name.charAt(0)}
            </div>
            <span className="text-xs text-muted">{toy.owner.display_name}</span>
            {toy.owner.location_name && (
              <>
                <span className="text-xs text-muted">·</span>
                <span className="text-xs text-muted truncate">{toy.owner.location_name}</span>
              </>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
