'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ToyList from '@/components/toys/ToyList';
import dynamic from 'next/dynamic';
import type { ToyWithImages } from '@toycycle/shared';

// Dynamically import MapViewer with SSR disabled because AMap relies on window
const MapViewer = dynamic(() => import('@/components/map/MapViewer'), { ssr: false });

interface ToysViewToggleProps {
  toys: ToyWithImages[];
}

export default function ToysViewToggle({ toys }: ToysViewToggleProps) {
  const t = useTranslations();
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex items-center justify-end">
        <div className="inline-flex bg-surface-elevated p-1 rounded-xl border border-border shadow-sm">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'grid'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
            列表视图
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              viewMode === 'map'
                ? 'bg-primary text-white shadow-md'
                : 'text-muted hover:text-foreground'
            }`}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z" />
            </svg>
            地图视图
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-in relative min-h-[500px]">
        {viewMode === 'grid' ? (
          <ToyList toys={toys} />
        ) : (
          <div className="w-full h-[600px] animate-fade-in">
            <MapViewer toys={toys} />
          </div>
        )}
      </div>
    </div>
  );
}
