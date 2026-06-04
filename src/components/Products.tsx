"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Star, ShoppingCart, Check, Flame,
  Utensils, ChevronDown, Filter, ArrowUpDown, Tag
} from "lucide-react";
import type { Product } from "@/models/Products";
import Categories from "./Categories";
import { useCart } from "@/components/CartProvider";
import { ProductCardSkeleton } from "./Skeleton";
import Pagination from "./Pagination";


// ─── Constants ─────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

// ─── Component ─────────────────────────────────────────────────────────

export default function Products({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useCart();
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = featuredOnly ? 6 : 12;

  const [dbProducts, setDbProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          setDbProducts(data as Product[]);
        }
      })
      .catch(err => console.error("Failed to load products:", err))
      .finally(() => setLoading(false));
  }, []);

  // ── URL sync ───────────────────────────────────────────────────────────

  useEffect(() => {
    const cat = searchParams.get("category") || "All";
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleCategoryChange = useCallback((category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category === "All") {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    setSelectedCategory(category);
  }, [pathname, router, searchParams]);

  // ── Filtering & Sorting (out-of-stock excluded) ───────────────────────────

  const filteredAndSortedProducts = useMemo(() => {
    let result = dbProducts.filter(p => p.stock > 0);

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (featuredOnly) {
      result = result.filter(p => p.isHot);
    }

    switch (sortBy) {
      case "price-asc": result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "rating": result.sort((a, b) => b.rating - a.rating); break;
      default: break;
    }

    return result;
  }, [selectedCategory, sortBy, dbProducts, featuredOnly]);

  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredAndSortedProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredAndSortedProducts, currentPage, ITEMS_PER_PAGE]);

  // Reset page on filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, sortBy, featuredOnly]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  // ── Cart / Wishlist actions ───────────────────────────────────────────────

  const handleToggleWishlist = (id: string) => {
    const product = dbProducts.find(p => p.id === id);
    if (product) toggleWishlist(product);
  };

  const handleToggleCart = (id: string) => {
    const product = dbProducts.find(p => p.id === id);
    if (!product) return;

    const isInCart = cart.some(item => item.id === id);
    if (isInCart) {
      removeFromCart(id);
    } else {
      addToCart(product, 1);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────

  return (
    <div className="mt-10 relative overflow-x-hidden transition-colors duration-500">
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(99,102,241,0.8) 0%, rgba(139,92,246,0) 100%)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(168,85,247,0.8) 0%, rgba(139,92,246,0) 100%)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(59,130,246,0.8) 0%, rgba(139,92,246,0) 100%)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, rgba(236,72,153,0.8) 0%, rgba(139,92,246,0) 100%)" }} />
      </div>

      <section className="py-12 sm:py-16 lg:py-20 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto relative z-10 overflow-hidden">
        <header className="mb-8 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10">
            <div className="max-w-2xl">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold tracking-widest uppercase text-xs mb-3"
              >
                <Utensils size={13} className="animate-bounce" />
                <span>Savor the Excellence</span>
              </motion.div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="text-2xl sm:text-3xl lg:text-5xl font-black text-neutral-900 dark:text-white leading-[1.1]"
              >
                {featuredOnly ? (
                  <>
                    Featured <span className="bg-gradient-to-r from-red-600 to-orange-500 bg-clip-text text-transparent">Hot Deals</span>
                  </>
                ) : (
                  <>
                    Discover Our{" "}
                    <span className="bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
                      Signature Dishes
                    </span>
                  </>
                )}
              </motion.h2>
            </div>

            {/* Sort Dropdown */}
            {!featuredOnly && (
              <div className="relative self-start sm:self-auto">
                <button
                  onClick={() => setIsSortOpen(!isSortOpen)}
                  className="group flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all"
                >
                  <ArrowUpDown size={14} className="text-neutral-400 group-hover:text-indigo-500" />
                  <span className="text-xs sm:text-sm font-bold text-neutral-700 dark:text-neutral-300 whitespace-nowrap">
                    Sort: {SORT_OPTIONS.find(o => o.value === sortBy)?.label}
                  </span>
                  <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${isSortOpen ? "rotate-180" : ""}`} />
                </button>

                <AnimatePresence>
                  {isSortOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.95 }}
                      className="absolute right-0 top-full mt-2 w-48 sm:w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl sm:rounded-2xl shadow-2xl z-50 p-1.5 overflow-hidden"
                    >
                      {SORT_OPTIONS.map((option) => (
                        <button
                          key={option.value}
                          onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                          className={`w-full flex items-center justify-between px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-lg sm:rounded-xl text-xs sm:text-sm font-semibold transition-all ${sortBy === option.value ? "bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800"}`}
                        >
                          {option.label}
                          {sortBy === option.value && <Check size={13} />}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          {!featuredOnly && <Categories selectedCategory={selectedCategory} onChange={handleCategoryChange} />}
        </header>

        {/* Product Grid - Improved Responsiveness */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => <ProductCardSkeleton key={i} />)
          ) : (
            <AnimatePresence mode="popLayout">
              {paginatedProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  isWishlisted={wishlist.some(item => item.id === product.id)}
                  isInCart={cart.some(item => item.id === product.id)}
                  onWishlistToggle={() => handleToggleWishlist(product.id)}
                  onCartToggle={() => handleToggleCart(product.id)}
                />
              ))}
            </AnimatePresence>
          )}
        </div>

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />

        {/* Empty State */}
        {filteredAndSortedProducts.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-5">
              <Filter className="text-neutral-300 dark:text-neutral-700" size={26} />
            </div>
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">No products found</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mt-2 text-sm">Try adjusting your filters or category selection.</p>
            <button
              onClick={() => { handleCategoryChange("All"); setSortBy("recommended"); }}
              className="mt-5 text-indigo-600 dark:text-indigo-400 font-bold hover:underline text-sm"
            >
              Reset all filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  );
}

// ─── ProductCard ──────────────────────────────────────────────────────

interface CardProps {
  product: Product;
  index: number;
  isWishlisted: boolean;
  isInCart: boolean;
  onWishlistToggle: () => void;
  onCartToggle: () => void;
}

function ProductCard({
  product, isWishlisted, isInCart, onWishlistToggle, onCartToggle
}: CardProps) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ opacity: { duration: 0.3 }, layout: { type: "spring", stiffness: 250, damping: 25 } }}
      className="group relative flex flex-col h-full bg-white/50 dark:bg-neutral-900/50 backdrop-blur-2xl rounded-xl sm:rounded-2xl border border-white/70 dark:border-white/10 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1"
    >
      {/* Hover glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-3xl opacity-0 group-hover:opacity-15 dark:group-hover:opacity-10 pointer-events-none bg-indigo-400 transition-opacity duration-500" />

      {/* Image Container */}
      <Link href={`/shop/product/${product.id}`} className="z-10 relative flex-shrink-0">
        <div className="relative w-full aspect-square sm:aspect-auto sm:h-48 md:h-52 lg:h-56 overflow-hidden bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            loading="eager"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Badges */}
          <div className="absolute top-2 left-2 sm:top-3 sm:left-3 flex flex-col gap-1 z-10">
            {product.discountPercent && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-0.5 px-2 py-0.5 rounded-md sm:rounded-lg bg-indigo-600/95 backdrop-blur-md text-white text-[9px] sm:text-xs font-black uppercase tracking-wide shadow-lg"
              >
                <Tag size={8} fill="currentColor" />
                {product.discountPercent}%
              </motion.span>
            )}
            {product.isHot && (
              <span className="flex items-center gap-0.5 px-2 py-0.5 rounded-md sm:rounded-lg bg-orange-500/95 backdrop-blur-md text-white text-[9px] sm:text-xs font-black uppercase tracking-wide shadow-lg animate-pulse">
                <Flame size={8} fill="currentColor" />
                Hot
              </span>
            )}
          </div>

          {/* Low stock warning */}
          {product.stock <= 5 && (
            <div className="absolute bottom-2 right-2 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] bg-amber-500/90 backdrop-blur-md text-white font-black uppercase tracking-wide">
              Only {product.stock} left
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.preventDefault(); onWishlistToggle(); }}
        className={`absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 sm:p-2 rounded-lg sm:rounded-xl backdrop-blur-xl transition-all duration-300 z-20 ${isWishlisted ? "bg-rose-500/90 text-white scale-110 shadow-lg" : "bg-white/30 dark:bg-white/10 text-neutral-900 dark:text-white hover:bg-white/50 dark:hover:bg-white/20 scale-100"}`}
      >
        <Heart size={12} className="sm:size-4" fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
      </button>

      {/* Content */}
      <div className="p-2 sm:p-3 md:p-4 flex flex-col flex-1 z-10 gap-2 sm:gap-3">
        <Link href={`/shop/product/${product.id}`} className="flex flex-col flex-1 gap-1 sm:gap-2">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1">
            <span className="px-1.5 py-0.5 bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 text-[8px] sm:text-[9px] font-black uppercase tracking-widest rounded">
              {product.category}
            </span>
            <div className="flex items-center gap-0.5">
              <Star size={10} className="sm:size-3 text-yellow-500" fill="#EAB308" />
              <span className="text-xs font-black text-neutral-900 dark:text-white">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xs sm:text-sm font-black text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-tight line-clamp-2">
            {product.name}
          </h3>

          {/* Description — mobile hidden, visible on sm+ */}
          <p className="hidden sm:line-clamp-1 text-neutral-600 dark:text-neutral-400 text-[10px] sm:text-xs leading-snug font-medium">
            {product.description}
          </p>
        </Link>

        {/* Price & Action */}
        <div className="mt-auto pt-2 sm:pt-2.5 border-t border-neutral-200/50 dark:border-neutral-700/50 space-y-2">
          {/* Price */}
          <div className="flex items-baseline justify-between">
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[9px] sm:text-xs text-neutral-400 line-through font-semibold">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-sm sm:text-lg font-black text-neutral-900 dark:text-white flex items-baseline">
                <span className="text-[9px] sm:text-xs font-bold mr-0.5 text-indigo-500">$</span>
                {product.price.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={onCartToggle}
            className={`relative w-full h-8 sm:h-9 group/btn flex items-center justify-center gap-1 px-3 rounded-lg sm:rounded-xl font-bold text-xs sm:text-sm transition-all duration-300 overflow-hidden shadow-md hover:shadow-lg ${isInCart ? "bg-emerald-500/90 text-white hover:bg-emerald-600" : "bg-indigo-600 hover:bg-indigo-700 text-white"}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {isInCart ? (
                <motion.div key="in-cart" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex items-center gap-1">
                  <Check size={12} strokeWidth={3} />
                  <span className="hidden sm:inline">Added</span>
                </motion.div>
              ) : (
                <motion.div key="add-cart" initial={{ y: 8, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -8, opacity: 0 }} className="flex items-center gap-1">
                  <ShoppingCart size={12} strokeWidth={2.5} className="group-hover/btn:-rotate-12 transition-transform" />
                  <span className="hidden sm:inline">Add</span>
                </motion.div>
              )}
            </AnimatePresence>
            {!isInCart && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-400 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />}
          </button>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-0.5 w-full flex">
        <div className="h-full flex-1 bg-indigo-500/30" />
        <div className="h-full flex-1 bg-fuchsia-500/30" />
        <div className="h-full flex-1 bg-sky-500/30" />
      </div>
    </motion.div>
  );
}
