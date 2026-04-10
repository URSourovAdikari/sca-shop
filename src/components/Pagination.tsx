"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const renderPageNumbers = () => {
    const pages = [];
    const showMax = 5;

    if (totalPages <= showMax) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      // Logic for ellipsis
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, 'ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, 'ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    return pages.map((page, idx) => {
      if (page === 'ellipsis') {
        return (
          <div key={`ellipsis-${idx}`} className="w-10 h-10 flex items-center justify-center text-neutral-400">
            <MoreHorizontal size={16} />
          </div>
        );
      }

      const isCurrent = page === currentPage;
      return (
        <button
          key={page}
          onClick={() => onPageChange(page as number)}
          className={`relative w-10 h-10 rounded-xl font-black text-xs transition-all duration-300 ${
            isCurrent
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-110 z-10"
              : "bg-white/45 dark:bg-white/5 text-neutral-600 dark:text-neutral-400 border border-white/60 dark:border-white/10 hover:bg-white/80 dark:hover:bg-white/10 hover:scale-105"
          }`}
        >
          {page}
          {isCurrent && (
            <motion.div
              layoutId="pagination-glow"
              className="absolute inset-0 rounded-xl bg-indigo-400/20 blur-md -z-10"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
        </button>
      );
    });
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-12 sm:mt-16">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="w-10 h-10 rounded-xl bg-white/45 dark:bg-white/5 flex items-center justify-center text-neutral-600 dark:text-neutral-400 border border-white/60 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-white/10 transition-all active:scale-90"
      >
        <ChevronLeft size={18} />
      </button>

      <div className="flex items-center gap-1.5 shadow-sm">
        {renderPageNumbers()}
      </div>

      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="w-10 h-10 rounded-xl bg-white/45 dark:bg-white/5 flex items-center justify-center text-neutral-600 dark:text-neutral-400 border border-white/60 dark:border-white/10 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/80 dark:hover:bg-white/10 transition-all active:scale-90"
      >
        <ChevronRight size={18} />
      </button>
    </div>
  );
}
