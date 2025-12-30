import { useState, useCallback } from 'react';

interface PaginationState {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  totalPages: number;
}

export const usePagination = (initialItemsPerPage: number = 24) => {
  const [pagination, setPagination] = useState<PaginationState>({
    currentPage: 1,
    totalItems: 0,
    itemsPerPage: initialItemsPerPage,
    totalPages: 0,
  });

  const updatePagination = useCallback((totalItems: number) => {
    const totalPages = Math.ceil(totalItems / initialItemsPerPage);
    setPagination(prev => ({
      ...prev,
      totalItems,
      totalPages,
    }));
  }, [initialItemsPerPage]);

  const goToPage = useCallback((page: number) => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(1, Math.min(page, prev.totalPages)),
    }));
  }, []);

  const nextPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.min(prev.currentPage + 1, prev.totalPages),
    }));
  }, []);

  const prevPage = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: Math.max(prev.currentPage - 1, 1),
    }));
  }, []);

  const resetPagination = useCallback(() => {
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
    }));
  }, []);

  return {
    pagination,
    updatePagination,
    goToPage,
    nextPage,
    prevPage,
    resetPagination,
  };
};