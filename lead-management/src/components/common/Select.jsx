import React, { forwardRef } from 'react';
import { ChevronDown } from 'lucide-react';

/**
 * Select component with label and error message support.
 */
const Select = forwardRef(function Select(
  { label, error, id, placeholder, options = [], className = '', ...props },
  ref
) {
  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}
      <div className="relative">
        <select
          id={id}
          ref={ref}
          className={`appearance-none block w-full rounded-lg border px-3 py-2 pr-8 text-sm text-gray-900
            focus:outline-none focus:ring-1 disabled:bg-gray-100 disabled:cursor-not-allowed
            transition-colors duration-150 bg-white
            ${error
              ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500'}
            ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="">{placeholder}</option>
          )}
          {options.map((opt) => (
            typeof opt === 'string'
              ? <option key={opt} value={opt}>{opt}</option>
              : <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

export default Select;
