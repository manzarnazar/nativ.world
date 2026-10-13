export interface PaginationProps {
  /** Total number of pages */
  totalPages: number;
  /** Currently active page (1-indexed) */
  currentPage: number;
  /** Called when user clicks a page */
  onPageChange: (page: number) => void;
  /** How many sibling pages to show around the active page */
  siblingCount?: number;
  /** Additional CSS classes */
  className?: string;
}
