import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import Button from './Button';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] gap-4 text-center px-4">
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-400" />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-700">{message}</p>
        <p className="text-xs text-gray-400 mt-1">Please try again or refresh the page.</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} id="error-retry-btn">
          <RefreshCw className="w-4 h-4" />
          Retry
        </Button>
      )}
    </div>
  );
}
