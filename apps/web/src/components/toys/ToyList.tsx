'use client';

import ToyCard from '@/components/toys/ToyCard';
import { MOCK_TOYS } from '@/lib/mock-data';

export default function ToyList() {
  // TODO: Replace with Supabase query + geolocation filtering
  const toys = MOCK_TOYS;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {toys.map((toy, index) => (
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
