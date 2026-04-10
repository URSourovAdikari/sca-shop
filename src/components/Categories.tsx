"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import type { CategoryItem } from "@/models/Categories";
import { CategoryPillSkeleton } from "./Skeleton";


// ─── Component ───────────────────────────────────────────────────────────────

interface CategoriesProps {
  selectedCategory?: string;
  onChange?: (category: string) => void;
}

export default function Categories({ selectedCategory, onChange }: CategoriesProps) {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => setCategories(data as CategoryItem[]))
      .catch(err => console.error("Failed to load categories:", err))
      .finally(() => setLoading(false));
  }, []);


  const displayCategories = onChange
    ? categories
    : categories.filter(c => c.name !== "All");

  return (
    <div className="pt-4 pb-2 sm:pt-6 sm:pb-4" role="radiogroup" aria-label="Product Categories">
      <div className="overflow-x-auto pb-2 no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex gap-2.5 sm:gap-3 min-w-max sm:flex-wrap sm:min-w-0">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <CategoryPillSkeleton key={i} />)
          ) : (
            displayCategories.map((cat, index) => (
              <CategoryPill
                key={cat.name}
                category={cat}
                index={index}
                isChecked={selectedCategory === cat.name}
                onChange={() => onChange?.(cat.name)}
              />
            ))
          )}
        </div>
      </div>

    </div>
  );
}

// ─── Subcomponent ─────────────────────────────────────────────────────────────

interface CategoryPillProps {
  category: CategoryItem;
  index: number;
  isChecked?: boolean;
  onChange?: () => void;
}

function CategoryPill({ category, index, isChecked, onChange }: CategoryPillProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, type: "spring", stiffness: 120 }}
    >
      <label className="group relative flex items-center gap-2.5 px-3 py-1.5 sm:px-4 sm:py-2 rounded-2xl cursor-pointer transition-all duration-300 select-none border bg-white/45 dark:bg-white/5 backdrop-blur-md border-white/60 dark:border-white/10 hover:border-indigo-300 dark:hover:border-indigo-700 hover:shadow-md hover:shadow-indigo-500/10 data-[checked=true]:border-indigo-400 data-[checked=true]:shadow-md data-[checked=true]:shadow-indigo-500/15">

        <input
          type="radio"
          name="categoryFilter"
          value={category.name}
          checked={isChecked}
          onChange={onChange}
          className="peer sr-only"
        />

        {/* Active background tint */}
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${category.bgGrad} opacity-0 peer-checked:opacity-100 transition-opacity duration-300 pointer-events-none`} />

        {/* Food image */}
        <div className={`relative flex-shrink-0 w-8 h-8 sm:w-9 sm:h-9 rounded-xl overflow-hidden ring-2 ring-transparent peer-checked:${category.color} group-hover:scale-110 transition-all duration-300 shadow-sm`}>
          <Image
            src={category.image}
            alt={category.name}
            fill
            className="object-cover"
            sizes="36px"
          />
          {/* Dark overlay so the image doesn't fight the pill */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
        </div>

        {/* Label */}
        <span className="relative text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 peer-checked:text-indigo-700 dark:peer-checked:text-indigo-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors whitespace-nowrap">
          {category.name}
        </span>

        {/* Count badge */}
        {category.count !== undefined && (
          <span className="relative text-[9px] sm:text-[10px] font-black text-neutral-400 dark:text-neutral-600 peer-checked:text-indigo-400 transition-colors">
            {category.count}
          </span>
        )}

        {/* Active dot */}
        <div className="relative w-1.5 h-1.5 rounded-full bg-indigo-500 opacity-0 peer-checked:opacity-100 transition-opacity duration-300 flex-shrink-0" />
      </label>
    </motion.div>
  );
}
