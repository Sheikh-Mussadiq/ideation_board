import React from "react";

export default function LoadingShimmer() {
  // Create arrays for columns and cards
  const columns = Array(5).fill(null);
  const cardsPerColumn = Array(4).fill(null);

  return (
    <div className="flex gap-6 overflow-x-auto pb-4 min-h-[calc(100vh-12rem)]">
      {columns.map((_, columnIndex) => (
        <div
          key={columnIndex}
          className="flex-shrink-0 w-80 bg-design-greyBG/50 border border-design-greyOutlines dark:bg-design-black/50 rounded-lg p-4 animate-pulse"
        >
          {/* Column Header Shimmer */}
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-md w-3/4 mb-4"></div>

          {/* Cards Shimmer */}
          <div className="space-y-3">
            {cardsPerColumn.map((_, cardIndex) => (
              //   <div
              //     key={cardIndex}
              //     className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 space-y-2"
              //   >
              //     <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              //     <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
              //     <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
              //     <div className="flex justify-between gap-2 mt-3">
              //       <div className="flex gap-2">
              //         <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              //         <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              //       </div>
              //       <div className="h-5 w-5 bg-gray-200 dark:bg-gray-700 rounded"></div>
              //     </div>
              //   </div>
              //   <div className="flex-shrink-0 w-80 bg-button-tertiary-fill rounded-lg p-4 relative overflow-hidden">
              //     <div className="animate-pulse">
              //       <div className="h-5 bg-gray-200 rounded w-1/3 mb-4"></div>
              //       <div className="space-y-3">
              //         <div className="h-24 bg-gray-200 rounded"></div>
              //         <div className="h-24 bg-gray-200 rounded"></div>
              //         <div className="h-24 bg-gray-200 rounded"></div>
              //       </div>
              //     </div>
              //     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer"></div>
              //   </div>
              <div
                key={cardIndex}
                className="card p-4 relative overflow-hidden"
              >
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="flex gap-2 mt-3">
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent shimmer"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
