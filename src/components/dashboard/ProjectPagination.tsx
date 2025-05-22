
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface ProjectPaginationProps {
  currentPage: number;
  totalPages: number;
  handlePageChange: (page: number) => void;
}

const ProjectPagination = ({ currentPage, totalPages, handlePageChange }: ProjectPaginationProps) => {
  if (totalPages <= 1) return null;
  
  return (
    <Pagination className="mt-6">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious 
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
        
        {[...Array(Math.min(totalPages, 5))].map((_, i) => {
          // Display pagination links based on current page
          let pageToShow = i + 1;
          
          if (totalPages > 5 && currentPage > 3) {
            if (i === 0) {
              pageToShow = 1;
            } else if (i === 1) {
              return (
                <PaginationItem key="ellipsis-start">
                  <PaginationEllipsis />
                </PaginationItem>
              );
            } else {
              pageToShow = Math.min(currentPage + i - 2, totalPages);
            }
          }
          
          if (pageToShow <= totalPages) {
            return (
              <PaginationItem key={pageToShow}>
                <PaginationLink 
                  isActive={currentPage === pageToShow}
                  onClick={() => handlePageChange(pageToShow)}
                >
                  {pageToShow}
                </PaginationLink>
              </PaginationItem>
            );
          }
          return null;
        })}
        
        {totalPages > 5 && currentPage < totalPages - 2 && (
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
        )}
        
        {totalPages > 5 && currentPage < totalPages - 1 && (
          <PaginationItem>
            <PaginationLink 
              onClick={() => handlePageChange(totalPages)}
            >
              {totalPages}
            </PaginationLink>
          </PaginationItem>
        )}
        
        <PaginationItem>
          <PaginationNext 
            onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
            className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
};

export default ProjectPagination;
