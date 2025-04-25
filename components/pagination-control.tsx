import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function PaginationControl({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationControlProps) {
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  // Generate pagination items
  const generatePaginationItems = () => {
    // For small number of pages, show all
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <PaginationItem key={page}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(page);
            }}
            isActive={page === currentPage}
          >
            {page}
          </PaginationLink>
        </PaginationItem>
      ));
    }

    // For large number of pages, show with ellipsis
    const items: React.ReactNode[] = [];

    // Always show first page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(1);
          }}
          isActive={1 === currentPage}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );

    // Show ellipsis or second page
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis-1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    } else if (currentPage > 2) {
      items.push(
        <PaginationItem key={2}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(2);
            }}
            isActive={2 === currentPage}
          >
            2
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Show current page and surrounding pages
    const surroundingPages = [
      currentPage - 1,
      currentPage,
      currentPage + 1,
    ].filter((page) => page > 1 && page < totalPages);

    // Keep track of pages we've already added to avoid duplicates
    const addedPages = new Set<number>([1]); // We already added page 1
    if (currentPage > 2) addedPages.add(2); // We might have added page 2

    surroundingPages.forEach((page) => {
      // Only add if we haven't already added this page
      if (!addedPages.has(page)) {
        addedPages.add(page);
        items.push(
          <PaginationItem key={page}>
            <PaginationLink
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePageChange(page);
              }}
              isActive={page === currentPage}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        );
      }
    });

    // Show ellipsis or second-to-last page
    if (currentPage < totalPages - 2) {
      items.push(
        <PaginationItem key="ellipsis-2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    } else if (currentPage < totalPages - 1) {
      items.push(
        <PaginationItem key={totalPages - 1}>
          <PaginationLink
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(totalPages - 1);
            }}
            isActive={totalPages - 1 === currentPage}
          >
            {totalPages - 1}
          </PaginationLink>
        </PaginationItem>
      );
    }

    // Always show last page
    items.push(
      <PaginationItem key={totalPages}>
        <PaginationLink
          href="#"
          onClick={(e) => {
            e.preventDefault();
            handlePageChange(totalPages);
          }}
          isActive={totalPages === currentPage}
        >
          {totalPages}
        </PaginationLink>
      </PaginationItem>
    );

    return items;
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage - 1);
            }}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>

        {generatePaginationItems()}

        <PaginationItem>
          <PaginationNext
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handlePageChange(currentPage + 1);
            }}
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
