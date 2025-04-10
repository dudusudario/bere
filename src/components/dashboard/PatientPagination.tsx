import React from 'react';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface PatientPaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const PatientPagination: React.FC<PatientPaginationProps> = ({ 
  currentPage, 
  totalPages, 
  setCurrentPage 
}) => {
  return (
    <Pagination className="mt-4">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className={`${currentPage === 1 ? 'pointer-events-none opacity-50' : ''} flex gap-1`}
            aria-label="Go to previous page"
          >
          </PaginationPrevious>
        </PaginationItem>
        
        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
          <PaginationItem key={page}>
            <PaginationLink 
              isActive={page === currentPage}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className={`${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''} flex gap-1`}
            aria-label="Go to next page"
          >
          </PaginationNext>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};
