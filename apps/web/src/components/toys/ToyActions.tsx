'use client';

import { useState, useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { createExchangeRequest } from '@/lib/actions/exchange';
import { useRouter } from '@/i18n/navigation';

interface ToyActionsProps {
  toyId: string;
  ownerId: string;
  currentUserId?: string;
  status: string;
}

export default function ToyActions({ toyId, ownerId, currentUserId, status }: ToyActionsProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState('');

  const isOwner = currentUserId === ownerId;
  const isAvailable = status === 'available';

  const handleRequest = () => {
    if (!currentUserId) {
      router.push('/login');
      return;
    }

    startTransition(async () => {
      setError('');
      const res = await createExchangeRequest(toyId);
      if (res.error) {
        setError(res.error);
      } else {
        alert('申请成功！请等待玩具主人确认。');
        router.refresh();
      }
    });
  };

  if (isOwner) {
    return (
      <div className="flex flex-col gap-3 mt-auto">
        <button
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-surface-container-high px-6 py-4 text-sm font-bold text-muted cursor-not-allowed"
          disabled
        >
          {t('toys.detail.yourToy')}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 mt-auto">
      {error && <div className="text-error text-sm font-bold text-center">{error}</div>}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handleRequest}
          disabled={!isAvailable || isPending}
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-6 py-4 text-sm font-bold text-white shadow-card hover:scale-[1.02] transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
        >
          {isPending ? '🔄 处理中...' : '🔄 ' + t('toys.detail.requestExchange')}
        </button>
        <button
          className="flex-1 inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-outline/20 px-6 py-4 text-sm font-bold hover:border-primary hover:text-primary hover:bg-primary-container/5 transition-all active:scale-[0.98]"
        >
          💬 {t('toys.detail.sendMessage')}
        </button>
      </div>
    </div>
  );
}
