import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Spinner({ message = 'Loading…', fullPage = false }) {
  if (fullPage) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3 text-gray-400">
        <Loader2 className="w-10 h-10 animate-spin text-primary-500" />
        <p className="text-sm">{message}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 py-8 text-gray-400">
      <Loader2 className="w-5 h-5 animate-spin text-primary-500" />
      <span className="text-sm">{message}</span>
    </div>
  );
}
