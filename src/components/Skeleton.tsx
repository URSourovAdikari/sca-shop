"use client";

import { motion } from "framer-motion";

export const Skeleton = ({ className }: { className?: string }) => (
  <motion.div
    initial={{ opacity: 0.5 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
    className={`bg-neutral-200 dark:bg-neutral-800 rounded-lg ${className}`}
  />
);

export const ProductCardSkeleton = () => (
  <div className="flex flex-col bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 overflow-hidden shadow-sm p-4 space-y-4">
    <Skeleton className="h-40 sm:h-52 w-full rounded-2xl" />
    <div className="flex justify-between items-center">
      <Skeleton className="h-4 w-16" />
      <Skeleton className="h-4 w-12" />
    </div>
    <Skeleton className="h-6 w-3/4" />
    <Skeleton className="h-4 w-full" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-8 w-24" />
      <Skeleton className="h-8 w-16" />
    </div>
  </div>
);

export const CategoryPillSkeleton = () => (
  <div className="flex items-center gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 w-32">
    <Skeleton className="w-8 h-8 rounded-xl" />
    <Skeleton className="h-4 w-16" />
  </div>
);
