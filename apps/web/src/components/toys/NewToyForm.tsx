'use client';

import { useTranslations } from 'next-intl';
import { TOY_CATEGORIES, AGE_RANGES } from '@toycycle/shared';
import { createToy } from '@/lib/actions/toys';
import { useState } from 'react';

export default function NewToyForm() {
  const t = useTranslations();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    // Rename form fields to match server action expectations
    const submitData = new FormData();
    submitData.set('title', formData.get('title') as string);
    submitData.set('description', formData.get('description') as string);
    submitData.set('category', formData.get('category') as string);
    submitData.set('ageRange', formData.get('ageRange') as string);
    submitData.set('condition', formData.get('condition') as string);
    submitData.set('estimatedValue', formData.get('estimatedValue') as string);
    if (formData.get('isCleaned')) {
      submitData.set('isCleaned', 'on');
    }

    // Forward photo files
    for (let i = 0; i < 5; i++) {
      const file = formData.get(`photo-${i}`) as File | null;
      if (file && file.size > 0) {
        submitData.set(`photo-${i}`, file);
      }
    }

    const result = await createToy(submitData);
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
    // Successful createToy will redirect, no need to reset loading
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="p-3 rounded-lg bg-error/10 border border-error/20 text-error text-sm">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="toy-title" className="block text-sm font-medium mb-1.5">
          {t('toys.title')} <span className="text-error">*</span>
        </label>
        <input
          id="toy-title"
          name="title"
          type="text"
          placeholder={t('toys.titlePlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          required
        />
      </div>

      {/* Description */}
      <div>
        <label htmlFor="toy-description" className="block text-sm font-medium mb-1.5">
          {t('toys.description')} <span className="text-error">*</span>
        </label>
        <textarea
          id="toy-description"
          name="description"
          rows={4}
          placeholder={t('toys.descriptionPlaceholder')}
          className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm placeholder:text-muted-light focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
          required
        />
      </div>

      {/* Category + Age Range */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="toy-category" className="block text-sm font-medium mb-1.5">
            {t('toys.category')} <span className="text-error">*</span>
          </label>
          <select
            id="toy-category"
            name="category"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
          <label htmlFor="toy-age-range" className="block text-sm font-medium mb-1.5">
            {t('toys.ageRange')} <span className="text-error">*</span>
          </label>
          <select
            id="toy-age-range"
            name="ageRange"
            className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
      <div>
        <label className="block text-sm font-medium mb-3">
          {t('toys.condition')} <span className="text-error">*</span>
        </label>
        <div className="grid grid-cols-3 gap-3">
          <ConditionOption id="condition-new" value="new" label={t('toys.conditions.new')} emoji="✨" />
          <ConditionOption id="condition-like-new" value="like_new" label={t('toys.conditions.likeNew')} emoji="👍" />
          <ConditionOption id="condition-used" value="used" label={t('toys.conditions.used')} emoji="📦" />
        </div>
      </div>

      {/* Estimated Value */}
      <div>
        <label htmlFor="toy-value" className="block text-sm font-medium mb-1.5">
          {t('toys.estimatedValue')} <span className="text-error">*</span>
        </label>
        <p className="text-xs text-muted mb-2">{t('toys.estimatedValueHint')}</p>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm">💰</span>
          <input
            id="toy-value"
            name="estimatedValue"
            type="number"
            min="1"
            max="500"
            placeholder="50"
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            required
          />
        </div>
      </div>

      {/* Photos */}
      <div>
        <label className="block text-sm font-medium mb-1.5">
          {t('toys.photos')} <span className="text-error">*</span>
        </label>
        <p className="text-xs text-muted mb-2">{t('toys.photosHint')}</p>
        <div className="grid grid-cols-5 gap-3">
          {[0, 1, 2, 3, 4].map((i) => (
            <label
              key={i}
              className="aspect-square rounded-xl border-2 border-dashed border-border hover:border-primary hover:bg-primary-50 cursor-pointer transition-all flex flex-col items-center justify-center gap-1"
              id={`photo-upload-${i}`}
            >
              <svg className="w-6 h-6 text-muted" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
              </svg>
              {i === 0 && <span className="text-[10px] text-muted">封面</span>}
              <input type="file" name={`photo-${i}`} accept="image/*" className="hidden" />
            </label>
          ))}
        </div>
      </div>

      {/* Cleaned checkbox */}
      <div className="flex items-center gap-3 p-4 rounded-xl bg-surface-elevated border border-border">
        <input
          id="toy-cleaned"
          name="isCleaned"
          type="checkbox"
          className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
        />
        <label htmlFor="toy-cleaned" className="text-sm font-medium cursor-pointer">
          ✨ {t('toys.cleaned')}
        </label>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={loading}
        id="publish-toy"
        className="w-full rounded-xl bg-primary px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-primary/25 hover:bg-primary-dark transition-all hover:shadow-xl active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? '发布中...' : `🧸 ${t('toys.publish')}`}
      </button>
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
      className="flex flex-col items-center gap-1 p-3 rounded-xl border-2 border-border hover:border-primary cursor-pointer transition-all has-[:checked]:border-primary has-[:checked]:bg-primary-50"
    >
      <input type="radio" name="condition" value={value} id={id} className="sr-only" required />
      <span className="text-xl">{emoji}</span>
      <span className="text-xs font-medium">{label}</span>
    </label>
  );
}
