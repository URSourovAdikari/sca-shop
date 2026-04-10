"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { useState, useMemo, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Star, ShoppingCart, Check, Flame,
  Utensils, ChevronDown, Filter, ArrowUpDown, Tag, Minus, Plus
} from "lucide-react";
import type { Product } from "@/models/Products";
import Categories from "./Categories";
import { useCart } from "@/components/CartProvider";
import { ProductCardSkeleton } from "./Skeleton";
import Pagination from "./Pagination";


// ─── Constants ───────────────────────────────────────────────────────────────

const SORT_OPTIONS = [
  { label: "Recommended", value: "recommended" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Top Rated", value: "rating" },
];

// ─── Component ───────────────────────────────────────────────────────────────

export default function Products({ featuredOnly = false }: { featuredOnly?: boolean }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category") || "All";

  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useCart();
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState("recommended");
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = featuredOnly ? 6 : 8;


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

  // ── Quantity helpers ──────────────────────────────────────────────────────

  const getQty = (id: string) => quantities[id] ?? 1;

  const changeQty = (id: string, delta: number) => {
    const product = dbProducts.find(p => p.id === id);
    if (!product) return;
    setQuantities(prev => ({
      ...prev,
      [id]: Math.min(product.stock, Math.max(1, (prev[id] ?? 1) + delta)),
    }));
  };

  const setQtyDirect = (id: string, raw: string) => {
    const product = dbProducts.find(p => p.id === id);
    if (!product) return;
    const parsed = parseInt(raw, 10);
    const clamped = isNaN(parsed) ? 1 : Math.min(product.stock, Math.max(1, parsed));
    setQuantities(prev => ({ ...prev, [id]: clamped }));
  };

  // ── URL sync ──────────────────────────────────────────────────────────────

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
    // Always hide products with no stock
    let result = dbProducts.filter(p => p.stock > 0);

    if (selectedCategory !== "All") {
      result = result.filter(p => p.category === selectedCategory);
    }

    if (featuredOnly) {
      result = result.filter(p => p.isHot); // Assuming isHot counts as "featured"
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
      addToCart(product, getQty(id));
    }
  };


  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="mt-10 relative overflow-x-hidden transition-colors duration-500">
      {/* ── Gradient Blobs (Same as Cart) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <section className="py-15 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative z-10 overflow-hidden">
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
              className="text-3xl sm:text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white leading-[1.1]"
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

          {/* Sort Dropdown - Hide if featuredOnly for cleaner look */}
          {!featuredOnly && (
            <div className="relative self-start sm:self-auto">
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="group flex items-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 rounded-xl bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 shadow-sm hover:border-indigo-300 dark:hover:border-indigo-700 transition-all"
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
                    className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl z-50 p-1.5 overflow-hidden"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => { setSortBy(option.value); setIsSortOpen(false); }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${sortBy === option.value ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400" : "text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-white/5"}`}
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

      {/* Product Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5 lg:gap-7">
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
                quantity={getQty(product.id)}
                onQuantityChange={(delta) => changeQty(product.id, delta)}
                onQuantitySet={(raw) => setQtyDirect(product.id, raw)}
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

// ─── ProductCard ──────────────────────────────────────────────────────────────

interface CardProps {
  product: Product;
  index: number;
  isWishlisted: boolean;
  isInCart: boolean;
  quantity: number;
  onQuantityChange: (delta: number) => void;
  onQuantitySet: (raw: string) => void;
  onWishlistToggle: () => void;
  onCartToggle: () => void;
}

function ProductCard({
  product, isWishlisted, isInCart, quantity,
  onQuantityChange, onQuantitySet, onWishlistToggle, onCartToggle
}: CardProps) {
  const atMin = quantity <= 1;
  const atMax = quantity >= product.stock;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ opacity: { duration: 0.3 }, layout: { type: "spring", stiffness: 250, damping: 25 } }}
      className="group relative flex flex-col bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/65 dark:border-white/10 overflow-hidden shadow-[0_8px_32px_rgba(100,60,255,0.06)] hover:shadow-[0_12px_48px_rgba(100,60,255,0.12)] transition-all duration-500"
    >
      {/* Hover glow blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] opacity-0 group-hover:opacity-10 dark:group-hover:opacity-[0.05] pointer-events-none transition-opacity duration-700 bg-gradient-to-tr from-indigo-500 via-fuchsia-500 to-orange-500" />

      {/* Image */}
      <Link href={`/shop/product/${product.id}`} className="z-10">
        <div className="relative h-36 sm:h-52 lg:h-60 w-full overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            priority
            loading="eager"
            className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-110"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

          {/* Badges */}
          <div className="absolute top-2.5 left-2.5 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10">
            {product.discountPercent && (
              <motion.span
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-indigo-600/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-lg border border-white/20"
              >
                <Tag size={9} fill="currentColor" />
                {product.discountPercent}%
              </motion.span>
            )}
            {product.isHot && (
              <span className="flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-orange-500/90 backdrop-blur-md text-white text-[10px] sm:text-xs font-black uppercase tracking-wide shadow-lg border border-white/20">
                <Flame size={9} fill="currentColor" />
                Hot
              </span>
            )}
          </div>

          {/* Low stock warning badge */}
          {product.stock <= 5 && (
            <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 px-2 py-0.5 rounded-lg bg-amber-500/90 backdrop-blur-md text-white text-[9px] sm:text-[10px] font-black uppercase tracking-wide border border-white/20">
              Only {product.stock} left
            </div>
          )}
        </div>
      </Link>

      {/* Wishlist Button */}
      <button
        onClick={(e) => { e.preventDefault(); onWishlistToggle(); }}
        className={`absolute top-2.5 right-2.5 sm:top-4 sm:right-4 p-2 sm:p-2.5 rounded-xl backdrop-blur-xl transition-all duration-500 z-20 ${isWishlisted ? "bg-rose-500 text-white scale-110 shadow-lg shadow-rose-500/40" : "bg-white/90 dark:bg-neutral-950/80 text-neutral-500 hover:text-rose-500 hover:scale-110 border border-white/30 dark:border-white/10"}`}
      >
        <Heart size={14} className="sm:size-[16px]" fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
      </button>

      {/* Content */}
      <div className="p-3 sm:p-5 flex flex-col flex-1 z-10">
        <Link href={`/shop/product/${product.id}`} className="flex flex-col flex-1">
          {/* Category & Rating */}
          <div className="flex items-center justify-between gap-1 mb-2 sm:mb-3">
            <span className="px-2 py-0.5 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest rounded-md">
              {product.category}
            </span>
            <div className="flex items-center gap-1">
              <Star size={11} className="sm:size-[13px] text-yellow-500" fill="#EAB308" />
              <span className="text-xs font-black text-neutral-900 dark:text-white">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-sm sm:text-base lg:text-lg font-black text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug mb-1 sm:mb-2 line-clamp-2">
            {product.name}
          </h3>

          {/* Description — desktop only */}
          <p className="hidden sm:block text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm leading-relaxed line-clamp-2 mb-3 font-medium">
            {product.description}
          </p>
        </Link>

        {/* Footer */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-neutral-100 dark:border-neutral-800 space-y-2">

          {/* Row 1: Price + Quantity Stepper */}
          <div className="flex items-center justify-between gap-2">
            {/* Price */}
            <div className="flex flex-col">
              {product.oldPrice && (
                <span className="text-[10px] sm:text-xs text-neutral-400 line-through font-semibold leading-none mb-0.5">
                  ${product.oldPrice.toFixed(2)}
                </span>
              )}
              <span className="text-base sm:text-xl lg:text-2xl font-black text-neutral-900 dark:text-white flex items-start">
                <span className="text-[10px] sm:text-sm font-bold mt-0.5 mr-0.5 text-indigo-500">$</span>
                {product.price.toFixed(2)}
              </span>
            </div>

            {/* Quantity Stepper: [−] [input] [+] */}
            <div className="flex items-center bg-neutral-100 dark:bg-neutral-800 rounded-lg overflow-hidden border border-neutral-200 dark:border-neutral-700">
              <button
                onClick={() => onQuantityChange(-1)}
                disabled={atMin}
                className="w-7 h-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Decrease quantity"
              >
                <Minus size={11} strokeWidth={3} />
              </button>

              <input
                type="number"
                value={quantity}
                min={1}
                max={product.stock}
                onChange={(e) => onQuantitySet(e.target.value)}
                onBlur={(e) => onQuantitySet(e.target.value)}
                className="w-8 sm:w-10 h-8 text-center text-xs sm:text-sm font-black bg-transparent border-none outline-none text-neutral-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                aria-label="Quantity"
              />

              <button
                onClick={() => onQuantityChange(+1)}
                disabled={atMax}
                className="w-7 h-8 flex items-center justify-center text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                aria-label="Increase quantity"
              >
                <Plus size={11} strokeWidth={3} />
              </button>
            </div>
          </div>

          {/* Row 2: Move to Cart + Add to Cart */}
          <div className="flex gap-1.5">
            {/* Add / Added */}
            <button
              onClick={onCartToggle}
              className={`relative flex-1 h-9 group/btn flex items-center justify-center gap-1.5 px-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-500 overflow-hidden shadow-sm ${isInCart ? "bg-emerald-100 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:shadow-lg hover:shadow-indigo-600/20 active:scale-95"}`}
            >
              <AnimatePresence mode="wait" initial={false}>
                {isInCart ? (
                  <motion.div key="in-cart" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-1.5">
                    <Check size={13} strokeWidth={3} />
                    <span className="hidden sm:inline font-bold">Added</span>
                  </motion.div>
                ) : (
                  <motion.div key="add-cart" initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }} className="flex items-center gap-1.5">
                    <ShoppingCart size={13} strokeWidth={2.5} className="group-hover/btn:-rotate-12 transition-transform" />
                    <span className="hidden sm:inline font-bold">Add</span>
                  </motion.div>
                )}
              </AnimatePresence>
              {!isInCart && <div className="absolute inset-x-0 bottom-0 h-0.5 bg-indigo-500 scale-x-0 group-hover/btn:scale-x-100 transition-transform origin-left" />}
            </button>
          </div>
        </div>
      </div>

      {/* Bottom accent bar */}
      <div className="h-1 w-full flex">
        <div className="h-full flex-1 bg-indigo-500/20" />
        <div className="h-full flex-1 bg-fuchsia-500/20" />
        <div className="h-full flex-1 bg-sky-500/20" />
      </div>
    </motion.div>
  );
}
