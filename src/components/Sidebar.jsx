import React from 'react';

const weights = [
  'ultralight',
  'thin',
  'light',
  'regular',
  'medium',
  'semibold',
  'bold',
  'heavy',
  'black',
];

export default function Sidebar({ variant, setVariant, weight, setWeight, open }) {
  return (
    <div
      className={`
        w-65 shrink-0 h-full bg-[#fbfbfd] dark:bg-[rgba(235,235,245,.03)] border-r border-black/10 dark:border-[hsla(0,0%,100%,.1)]
        transition-all duration-300 ease-in-out flex flex-col
        ${open ? 'ml-0' : '-ml-65 border-r-0'}
      `}
    >
      <div className="p-6 border-b border-black/5 dark:border-[hsla(0,0%,100%,.05)]">
        <h2 className="text-lg text-black dark:text-white font-bold tracking-tight">Icon Finder</h2>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">60,000+ icons optimized</p>
      </div>

      <div className="p-6 flex-1 overflow-y-auto">
        {/* Variant Selection */}
        <div className="mb-8">
          <label className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mb-3 block">
            Variant
          </label>
          <div className="flex bg-black/5 dark:bg-[hsla(0,0%,100%,.05)] p-1 rounded-md">
            <button
              onClick={() => setVariant('path_outline')}
              className={`flex-1 py-1.5 text-xs rounded-sm transition-all ${
                variant === 'path_outline'
                  ? 'bg-white dark:bg-[#1f1f1f] text-black dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Outline
            </button>
            <button
              onClick={() => setVariant('path_fill')}
              className={`flex-1 py-1.5 text-xs rounded-sm transition-all ${
                variant === 'path_fill'
                  ? 'bg-white dark:bg-[#1f1f1f] text-black dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
              }`}
            >
              Filled
            </button>
          </div>
        </div>

        {/* Weight Selection */}
        <div>
          <label className="text-xs text-gray-400 dark:text-gray-500 uppercase tracking-wider font-bold mb-3 block">
            Weight
          </label>
          <div className="flex flex-col gap-1">
            {weights.map((w) => (
              <button
                key={w}
                onClick={() => setWeight(w)}
                className={`text-left px-3 py-2 text-sm rounded-md transition-all ${
                  weight === w
                    ? 'bg-[rgba(0,122,255,.1)] dark:bg-[rgba(0,122,255,.15)] text-[#007aff] font-semibold'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-black/5 dark:hover:bg-[hsla(0,0%,100%,.05)] hover:text-black dark:hover:text-white'
                }`}
              >
                <span className="capitalize">{w}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
