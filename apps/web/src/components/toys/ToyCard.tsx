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
      className="group block rounded-3xl bg-white border-2 border-outline/5 shadow-card hover:shadow-card-hover transition-all duration-500 hover:-translate-y-2 overflow-hidden"
      id={`toy-card-${toy.id}`}
    >
      {/* Image placeholder */}
      <div className="aspect-[4/3] bg-gradient-to-br from-primary-container/10 to-primary-container/30 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-6xl opacity-40 group-hover:scale-125 transition-transform duration-700 ease-out">
            {categoryEmoji}
          </span>
        </div>

        {/* Status badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-primary shadow-sm">
            {t(`toys.conditions.${conditionKey}`)}
          </span>
        </div>

        {/* Cleaned badge */}
        {toy.is_cleaned && (
          <div className="absolute top-3 right-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-white/90 backdrop-blur-md text-success shadow-sm">
              ✨ {t('toys.cleaned')}
            </span>
          </div>
        )}

        {/* Credits */}
        <div className="absolute bottom-3 right-3">
          <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-bold bg-amber text-amber-container-on shadow-card border border-white/20">
            💰 {toy.estimated_value}
          </span>
        </div>
      </div>

      {/* Info */}
      <div className="p-5">
        <h3 className="font-heading font-bold text-base leading-snug line-clamp-2 group-hover:text-primary transition-colors">
          {toy.title}
        </h3>

        <div className="mt-2 flex items-center gap-2 text-xs font-bold text-muted">
          <span className="bg-surface-container-low px-2 py-0.5 rounded-lg">{categoryEmoji} {t(`toys.categories.${toy.category}`)}</span>
          <span className="bg-surface-container-low px-2 py-0.5 rounded-lg">{t(`toys.ageRanges.${toy.age_range}`)}</span>
        </div>

        {toy.owner && (
          <div className="mt-4 pt-4 border-t border-outline/10 flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary-container flex items-center justify-center text-white text-xs font-bold shadow-sm">
              {toy.owner.display_name.charAt(0)}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-foreground truncate">{toy.owner.display_name}</span>
              {toy.owner.location_name && (
                <span className="text-[10px] text-muted truncate">{toy.owner.location_name}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </Link>
  );
}
