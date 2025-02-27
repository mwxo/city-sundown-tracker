"use client";

import dynamic from 'next/dynamic';

// Use dynamic import for the component that uses browser APIs
const SundownTracker = dynamic(
  () => import('@/components/SundownTracker'),
  { ssr: false }
);

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="container mx-auto">
        <SundownTracker />
      </div>
    </main>
  );
}