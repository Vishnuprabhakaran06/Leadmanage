import React from 'react';
import { SearchX } from 'lucide-react';

export default function EmptyState({ message = 'No results found.', description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
        <SearchX className="w-8 h-8 text-gray-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{message}</p>
        {description && (
          <p className="text-xs text-gray-400 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
