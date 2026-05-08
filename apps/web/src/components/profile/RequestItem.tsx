'use client';

import { useTransition } from 'react';
import { useTranslations } from 'next-intl';
import { acceptExchangeRequest, rejectExchangeRequest } from '@/lib/actions/exchange';
import { getOrCreateConversation } from '@/lib/actions/chat';
import { useRouter } from 'next/navigation';
import type { ExchangeStatus } from '@toycycle/shared';

interface RequestItemProps {
  request: {
    id: string;
    status: ExchangeStatus;
    credits_amount: number;
    message: string | null;
    created_at: string;
    toy: any;
    requester?: any;
    owner?: any;
  };
  type: 'received' | 'sent';
}

export default function RequestItem({ request, type }: RequestItemProps) {
  const t = useTranslations();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleContact = () => {
    startTransition(async () => {
      const res = await getOrCreateConversation(request.id);
      if (res.success && res.conversationId) {
        router.push(`/messages/${res.conversationId}`);
      } else if (res.error) {
        alert(res.error);
      }
    });
  };

  const handleAccept = () => {
// ... existing logic ...
    if (confirm('确认同意这次交换吗？')) {
      startTransition(async () => {
        const res = await acceptExchangeRequest(request.id);
        if (res.error) alert(res.error);
      });
    }
  };

  const handleReject = () => {
    if (confirm('确认拒绝这次交换吗？积分将退还给对方。')) {
      startTransition(async () => {
        const res = await rejectExchangeRequest(request.id);
        if (res.error) alert(res.error);
      });
    }
  };

  const statusColors = {
    pending: 'bg-amber/10 text-amber border-amber/20',
    accepted: 'bg-success/10 text-success border-success/20',
    rejected: 'bg-error/10 text-error border-error/20',
    completed: 'bg-primary/10 text-primary border-primary/20',
  };

  const toy = request.toy;
  const otherUser = type === 'received' ? request.requester : request.owner;
  const coverImage = toy?.images?.[0]?.image_url || '/placeholder-toy.png';

  return (
    <div className="bg-white border-2 border-outline/5 rounded-3xl p-4 sm:p-6 shadow-sm hover:shadow-card transition-all mb-4">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Toy Image */}
        <div className="w-full sm:w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0 bg-surface-container-low">
          <img src={coverImage} alt={toy?.title} className="w-full h-full object-cover" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border-2 ${statusColors[request.status]}`}>
              {t(`exchange.status.${request.status}`)}
            </span>
            <span className="text-xs text-muted font-medium">
              {new Date(request.created_at).toLocaleDateString()}
            </span>
          </div>

          <h3 className="font-bold text-lg truncate mb-1">{toy?.title}</h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center text-xs">
              {type === 'received' ? '👤' : '🏢'}
            </div>
            <span className="text-sm font-medium text-foreground/70">
              {type === 'received' ? '来自 ' : '发给 '}
              <span className="font-bold text-foreground">{otherUser?.display_name || '匿名用户'}</span>
            </span>
          </div>

          {request.message && (
            <div className="bg-surface-container-low/50 p-3 rounded-xl border border-outline/5 mb-4 italic text-sm text-muted">
              "{request.message}"
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="text-amber font-bold text-sm">
              💰 {request.credits_amount} {t('exchange.credits')}
            </div>

            {/* Actions */}
            <div className="flex gap-2">
              <button
                onClick={handleContact}
                disabled={isPending}
                className="px-4 py-2 rounded-xl bg-surface-container-high hover:bg-surface-container-highest text-foreground/80 text-xs font-bold transition-all disabled:opacity-50"
              >
                💬 联系对方
              </button>

              {type === 'received' && request.status === 'pending' && (
                <>
                  <button
                    onClick={handleReject}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-error hover:bg-error/5 transition-all disabled:opacity-50"
                  >
                    拒绝
                  </button>
                  <button
                    onClick={handleAccept}
                    disabled={isPending}
                    className="px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold shadow-md hover:scale-105 transition-all active:scale-95 disabled:opacity-50"
                  >
                    {isPending ? '加载中...' : '同意交换'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
