'use client';

import { useTranslations } from 'next-intl';
import { TOY_CATEGORIES, AGE_RANGES } from '@toycycle/shared';

export default function NewToyForm() {
  const t = useTranslations();

  return (
    <form className="space-y-8">
      {/* Title */}
      <div className="animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <label htmlFor="toy-title" className="block text-sm font-bold mb-2">
          {t('toys.title')} <span className="text-error">*</span>
        </label>
        <input
          id="toy-title"
          type="text"
          placeholder={t('toys.titlePlaceholder')}
          className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all"
          required
        />
      </div>

      {/* Description */}
      <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <label htmlFor="toy-description" className="block text-sm font-bold mb-2">
          {t('toys.description')} <span className="text-error">*</span>
        </label>
        <textarea
          id="toy-description"
          rows={4}
          placeholder={t('toys.descriptionPlaceholder')}
          className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm placeholder:text-outline focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all resize-none"
          required
        />
      </div>

      {/* Category + Age Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div>
          <label htmlFor="toy-category" className="block text-sm font-bold mb-2">
            {t('toys.category')} <span className="text-error">*</span>
          </label>
          <select
            id="toy-category"
            className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all appearance-none"
            required
          >
            <option value="">-- 选择分类 --</option>
            {Object.entries(TOY_CATEGORIES).map(([key, emoji]) => (
              <option key={key} value={key}>
                {emoji} {t(`toys.categories.${key}`)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="toy-age-range" className="block text-sm font-bold mb-2">
            {t('toys.ageRange')} <span className="text-error">*</span>
          </label>
          <select
            id="toy-age-range"
            className="w-full rounded-2xl border-2 border-outline/20 bg-surface-container-low px-4 py-3 text-sm focus:border-primary focus:ring-2 focus:ring-primary/15 outline-none transition-all appearance-none"
            required
          >
            <option value="">-- 选择年龄段 --</option>
            {AGE_RANGES.map((range) => (
              <option key={range} value={range}>
                {t(`toys.ageRanges.${range}`)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Condition */}
      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <label className="block text-sm font-bold mb-3">
          {t('toys.condition')} <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <ConditionOption id="condition-new" value="new" label={t('toys.conditions.new')} emoji="✨" />
          <ConditionOption id="condition-like-new" value="like_new" label={t('toys.conditions.likeNew')} emoji="👍" />
          <ConditionOption id="condition-used" value="used" label={t('toys.conditions.used')} emoji="📦" />
        </div>
      </div>

      {/* Estimated Value */}
      <div className="animate-slide-up" style={{ animationDelay: '0.25s' }}>
        <label htmlFor="toy-value" className="block text-sm font-bold mb-1">
          {t('toys.estimatedValue')} <span className="text-error">*</span>
        </label>
        <p className="text-xs text-muted mb-3">{t('toys.estimatedValueHint')}</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg">💰</span>
          <input
            id="toy-value"
            type="number"
            min="1"
            max="500"
            placeholder="50"
            className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-outline/20 bg-surface-container-low text-sm font-bold focus:border-amber focus:ring-2 focus:ring-amber/15 outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Photos */}
      <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-bold mb-1">
          {t('toys.photos')} <span className="text-error">*</span>
        </label>
        <p className="text-xs text-muted mb-3">{t('toys.photosHint')}</p>
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <label
              key={i}
              className="aspect-square rounded-2xl border-2 border-dashed border-outline/20 hover:border-primary hover:bg-primary-container/10 cursor-pointer transition-all flex flex-col items-center justify-center gap-1 group"
              id={`photo-upload-${i}`}
            >
              <svg className="w-6 h-6 text-outline group-hover:text-primary transition-colors" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              {i === 0 && <span className="text-[10px] font-bold text-outline group-hover:text-primary transition-colors">封面</span>}
              <input type="file" accept="image/*" className="hidden" />
            </label>
          ))}
        </div>
      </div>

      {/* Cleaned checkbox */}
      <div className="flex items-center gap-3 p-4 rounded-2xl bg-primary-container/5 border-2 border-primary-container/20 animate-slide-up" style={{ animationDelay: '0.35s' }}>
        <input
          id="toy-cleaned"
          type="checkbox"
          className="w-5 h-5 rounded-lg border-outline/30 text-primary focus:ring-primary/20 transition-all cursor-pointer"
        />
        <label htmlFor="toy-cleaned" className="text-sm font-bold cursor-pointer">
          ✨ {t('toys.cleaned')}
        </label>
      </div>

      {/* Submit */}
      <div className="pt-4 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <button
          type="submit"
          id="publish-toy"
          className="w-full rounded-2xl bg-primary px-6 py-4 text-base font-bold text-white shadow-card hover:scale-[1.02] transition-all active:scale-[0.98]"
        >
          🧸 {t('toys.publish')}
        </button>
      </div>
    </form>
  );
}

function ConditionOption({
  id,
  value,
  label,
  emoji,
}: {
  id: string;
  value: string;
  label: string;
  emoji: string;
}) {
  return (
    <label
      htmlFor={id}
      className="flex flex-col items-center gap-1 p-4 rounded-2xl border-2 border-outline/10 hover:border-primary/50 cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary-container/10 group"
    >
      <input type="radio" name="condition" value={value} id={id} className="sr-only" required />
      <span className="text-2xl group-hover:scale-125 transition-transform">{emoji}</span>
      <span className="text-xs font-bold text-foreground/70 group-has-[:checked]:text-primary">{label}</span>
    </label>
  );
}
