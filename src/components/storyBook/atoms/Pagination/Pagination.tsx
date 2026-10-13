import React, { useMemo } from 'react';
import { PiCaretLeft, PiCaretRight } from 'react-icons/pi';
import { PaginationProps } from './Pagination.type';

/**
 * Builds the page range to display.
 * - Always shows first page and last page.
 * - Shows 4 consecutive pages centred around the current page.
 * - Inserts "..." where there are gaps.
 */
function buildPageRange(current: number, total: number): (number | '...')[] {
    if (total <= 6) {
        return Array.from({ length: total }, (_, i) => i + 1);
    }

    // Clamp so we always show a window of 4 consecutive pages
    const windowStart = Math.min(Math.max(current - 1, 1), total - 3);
    const windowEnd = Math.min(windowStart + 3, total);

    const pages: (number | '...')[] = [];

    // First page
    if (windowStart > 1) pages.push(1);
    if (windowStart > 2) pages.push('...');

    // Middle window
    for (let i = windowStart; i <= windowEnd; i++) pages.push(i);

    // Last page
    if (windowEnd < total - 1) pages.push('...');
    if (windowEnd < total) pages.push(total);

    return pages;
}

const Pagination: React.FC<PaginationProps> = ({
    totalPages,
    currentPage,
    onPageChange,
    siblingCount = 1,
    className = '',
}) => {
    const pages = useMemo(
        () => buildPageRange(currentPage, totalPages),
        [currentPage, totalPages],
    );

    const isPrev = currentPage > 1;
    const isNext = currentPage < totalPages;

    const btnBase =
        'w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center rounded-full text-sm font-medium transition-colors select-none';

    return (
        <div className={`flex items-center gap-1.5 ${className}`}>
            {/* ← Prev */}
            <button
                onClick={() => isPrev && onPageChange(currentPage - 1)}
                disabled={!isPrev}
                aria-label="Previous page"
                className={`${btnBase} primaryLightBg
          ${isPrev ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
                <PiCaretLeft className="text-xl rtl:rotate-180" />
            </button>

            {/* Page numbers */}
            {pages.map((page, idx) =>
                page === '...' ? (
                    <span
                        key={`dots-${idx}`}
                        className="w-6 h-6 sm:w-9 sm:h-9 flex items-center justify-center text-sm text-gray-400 select-none"
                    >
                        ...
                    </span>
                ) : (
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        aria-current={page === currentPage ? 'page' : undefined}
                        aria-label={`Page ${page}`}
                        className={`${btnBase}
              ${page === currentPage
                                ? 'primaryBg text-white shadow-sm'
                                : 'bg-white text-gray-700 hover:primaryLightBg'
                            }`}
                    >
                        {page}
                    </button>
                ),
            )}

            {/* → Next */}
            <button
                onClick={() => isNext && onPageChange(currentPage + 1)}
                disabled={!isNext}
                aria-label="Next page"
                className={`${btnBase} primaryLightBg
          ${isNext ? 'hover:bg-gray-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'}`}
            >
                <PiCaretRight className="text-xl rtl:rotate-180" />
            </button>
        </div>
    );
};

export default Pagination;
