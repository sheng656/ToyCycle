'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import RequestItem from './RequestItem';
import ToyCard from '../toys/ToyCard';
import type { ToyWithImages } from '@toycycle/shared';

interface ProfileTabsProps {
  userToys: ToyWithImages[];
  receivedRequests: any[];
  sentRequests: any[];
}

export default function ProfileTabs({ userToys, receivedRequests, sentRequests }: ProfileTabsProps) {
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<'toys' | 'received' | 'sent'>('toys');

  const tabs = [
    { id: 'toys', label: t('profile.myToys'), icon: '🧸', count: userToys.length },
    { id: 'received', label: '收到的申请', icon: '📩', count: receivedRequests.filter(r => r.status === 'pending').length },
    { id: 'sent', label: '发出的申请', icon: '📤', count: sentRequests.length },
  ];

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-outline/10">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 flex flex-col items-center py-4 border-b-4 transition-all relative ${
              activeTab === tab.id
                ? 'border-primary text-primary'
                : 'border-transparent text-muted hover:text-foreground'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">{tab.icon}</span>
              <span className="font-bold text-sm">{tab.label}</span>
            </div>
            {tab.count > 0 && (
              <span className="absolute top-2 right-4 bg-error text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow-sm">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="animate-fade-in">
        {activeTab === 'toys' && (
          <div>
            {userToys.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {userToys.map((toy) => (
                  <ToyCard key={toy.id} toy={toy} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline/10">
                <div className="text-4xl mb-4">📭</div>
                <p className="text-muted font-bold">你还没有发布任何玩具</p>
                <a href="/toys/new" className="text-primary font-bold hover:underline mt-2 inline-block">去发布一个吧 →</a>
              </div>
            )}
          </div>
        )}

        {activeTab === 'received' && (
          <div>
            {receivedRequests.length > 0 ? (
              <div>
                {receivedRequests.map((req) => (
                  <RequestItem key={req.id} request={req} type="received" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline/10">
                <div className="text-4xl mb-4">💤</div>
                <p className="text-muted font-bold">暂无收到的申请</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'sent' && (
          <div>
            {sentRequests.length > 0 ? (
              <div>
                {sentRequests.map((req) => (
                  <RequestItem key={req.id} request={req} type="sent" />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-surface-container-low rounded-3xl border-2 border-dashed border-outline/10">
                <div className="text-4xl mb-4">💨</div>
                <p className="text-muted font-bold">你还没有发起过申请</p>
                <a href="/toys" className="text-primary font-bold hover:underline mt-2 inline-block">去发现有趣的玩具 →</a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
