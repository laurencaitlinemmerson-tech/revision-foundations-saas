'use client';

import { WifiOff, BookOpen, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-800 rounded-full border-2 border-gray-600 mb-6">
            <WifiOff className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">You&apos;re Offline</h1>
          <p className="text-gray-400 mb-2">
            Don&apos;t worry! Hospital WiFi can be unpredictable.
          </p>
          <p className="text-gray-500 text-sm">
            Pages you&apos;ve visited before may still be available offline.
          </p>
        </div>

        <div className="bg-gray-800/50 rounded-xl p-6 border border-gray-700 mb-8">
          <div className="flex items-center gap-3 text-left mb-4">
            <BookOpen className="w-5 h-5 text-purple-400 flex-shrink-0" />
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Tip:</strong> Visit study pages while online 
              to cache them for offline reading later!
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => window.location.reload()}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Try Again
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            Go Home
          </Link>
        </div>

        <p className="text-gray-600 text-xs mt-8">
          Your study progress is saved locally and will sync when you&apos;re back online.
        </p>
      </div>
    </div>
  );
}
