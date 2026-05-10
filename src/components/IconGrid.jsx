import React, { useState } from 'react';
import { VirtuosoGrid } from 'react-virtuoso';

// The baseUrl allows overriding for production
const BASE_URL = import.meta.env.VITE_ICON_BASE_URL || '/icons';

export default function IconGrid({ icons, variant, weight }) {
  const [copiedIndex, setCopiedIndex] = useState(null);

  const handleCopy = async (content, index, type) => {
    try {
      let textToCopy = content;
      if (type === 'svg') {
        const response = await fetch(content);
        textToCopy = await response.text();
      }
      await navigator.clipboard.writeText(textToCopy);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  // Use a custom ItemContainer to style the grid items
  const ItemContainer = ({ children, ...props }) => (
    <div
      {...props}
      className="flex flex-col items-center justify-center p-4 bg-white dark:bg-[hsla(0,0%,100%,.02)] border border-black/5 dark:border-[hsla(0,0%,100%,.05)] rounded-[10px] hover:bg-black/5 dark:hover:bg-[hsla(0,0%,100%,.05)] hover:border-black/10 dark:hover:border-[hsla(0,0%,100%,.1)] transition-colors cursor-pointer group relative overflow-hidden"
    >
      {children}
    </div>
  );

  // Use a custom ListContainer to style the grid wrapper
  const ListContainer = ({ children, ...props }) => (
    <div
      {...props}
      className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4 p-4"
    >
      {children}
    </div>
  );

  if (icons.length === 0) {
    return (
      <div className="w-full h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        No icons found matching your search.
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <VirtuosoGrid
        style={{ height: '100%' }}
        totalCount={icons.length}
        components={{
          Item: ItemContainer,
          List: ListContainer,
        }}
        itemContent={(index) => {
          const icon = icons[index];
          // Find the path corresponding to the variant and weight
          // variant is either 'path_fill' or 'path_outline'
          const paths = icon[variant] || [];
          const pathObj = paths.find((p) => p.name === weight);
          
          if (!pathObj) {
            return (
              <>
                <div className="w-8 h-8 flex items-center justify-center bg-black/5 dark:bg-[hsla(0,0%,100%,.05)] rounded text-[10px] text-gray-400 dark:text-gray-500">N/A</div>
                <p className="mt-3 text-[11px] text-center text-gray-400 dark:text-gray-500 truncate w-full">
                  {icon.name}
                </p>
              </>
            );
          }

          // We check if content exists (for inline SVG) or fallback to path
          const isInline = !!pathObj.content;
          const svgContent = pathObj.content;
          let src = pathObj.path;
          
          if (!isInline) {
            if (src.startsWith('/icons') && BASE_URL !== '/icons') {
              src = BASE_URL + src.slice(6);
            } else if (!src.startsWith('/icons')) {
              src = `${BASE_URL}/${src}`;
            }
          }

          return (
            <>
              {isInline ? (
                <svg
                  viewBox="0 0 24 24"
                  className="w-8 h-8 opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-sm dark:drop-shadow-md text-black dark:text-white fill-current"
                  dangerouslySetInnerHTML={{ __html: svgContent }}
                />
              ) : (
                <img
                  src={src}
                  alt={icon.name}
                  loading="lazy"
                  className="w-8 h-8 filter brightness-0 dark:invert opacity-60 group-hover:opacity-100 transition-opacity drop-shadow-sm dark:drop-shadow-md"
                />
              )}
              
              <p className="mt-3 text-[11px] text-center text-gray-500 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white truncate w-full transition-colors">
                {icon.name}
              </p>

              {/* Hover Copy Action */}
              <div 
                className="absolute inset-0 bg-white/95 dark:bg-[#121212]/95 backdrop-blur-sm opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center gap-2 transition-opacity duration-200 z-10"
              >
                {copiedIndex === index ? (
                  <span className="text-green-500 dark:text-green-400 text-xs font-bold flex flex-col items-center gap-2 animate-in fade-in zoom-in duration-200">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                    Copied!
                  </span>
                ) : (
                  <>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(isInline ? `<svg viewBox="0 0 24 24">${svgContent}</svg>` : src, index, isInline ? 'raw' : 'svg'); }}
                      className="bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded w-[85%] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                      Copy SVG
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCopy(icon.name, index, 'name'); }}
                      className="bg-black/5 hover:bg-black/10 dark:bg-white/10 dark:hover:bg-white/20 text-black dark:text-white text-[10px] uppercase font-bold py-1.5 px-3 rounded w-[85%] flex items-center justify-center gap-1.5 transition-colors"
                    >
                      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"></path></svg>
                      Copy Name
                    </button>
                  </>
                )}
              </div>
            </>
          );
        }}
      />
    </div>
  );
}
