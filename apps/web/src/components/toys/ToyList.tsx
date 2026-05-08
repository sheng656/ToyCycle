'use client';

import ToyCard from '@/components/toys/ToyCard';
import { MOCK_TOYS } from '@/lib/mock-data';
import type { ToyWithImages } from '@toycycle/shared';

interface ToyListProps {
  /** Real toys from Supabase. Falls back to mock data if empty/undefined. */
  toys?: ToyWithImages[];
}

export default function ToyList({ toys }: ToyListProps) {
  // Use real data if provided, otherwise fall back to mock data for development
  const displayToys = toys && toys.length > 0 ? toys : MOCK_TOYS;

  if (displayToys.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🧸</span>
        <h2 className="text-lg font-semibold mb-2">暂时没有附近的玩具</h2>
        <p className="text-sm text-muted max-w-sm">
          试试扩大搜索范围，或者成为第一个分享玩具的家庭！
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {displayToys.map((toy, index) => (
        <div
          key={toy.id}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <ToyCard toy={toy} />
        </div>
      ))}
    </div>
  );
}
