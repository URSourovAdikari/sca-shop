"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Trash2, ArrowLeft, Star, ShoppingBag, Plus
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function WishlistPage() {
  const { wishlist, cart, toggleWishlist, addToCart } = useCart();

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <header className="mb-8 sm:mb-12">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-bold mb-4 px-4 py-2 rounded-xl transition-all bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-[oklch(0.35_0.12_280)] dark:text-indigo-400"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Menu
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[oklch(0.18_0.06_280)] dark:text-white">Your Wishlist</h1>
            <span className="text-[10px] sm:text-xs font-black px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg border border-rose-500/20 uppercase tracking-widest shadow-sm">
              {wishlist.length} {wishlist.length === 1 ? 'Fav' : 'Favs'}
            </span>
          </div>
          <p className="text-[oklch(0.55_0.06_280)] dark:text-neutral-500 font-bold mt-1 px-0.5 text-xs">A curated collection of your future meals.</p>
        </header>

        {wishlist.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-5">
            <AnimatePresence mode="popLayout">
              {wishlist.map((product, index) => (
                <WishlistItemCard
                  key={product.id}
                  product={product}
                  index={index}
                  onRemove={() => toggleWishlist(product)}
                  onAddToCart={() => addToCart(product, 1)}
                  isInCart={cart.some(item => item.id === product.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function WishlistItemCard({ product, index, onRemove, onAddToCart, isInCart }: {
  product: any;
  index: number;
  onRemove: () => void;
  onAddToCart: () => void;
  isInCart: boolean;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ delay: index * 0.03 }}
      className="group bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/65 dark:border-white/10 p-2.5 sm:p-3 shadow-sm hover:shadow-[0_12px_40px_rgba(100,60,255,0.08)] transition-all flex flex-col h-full relative"
    >
      <div className="relative aspect-square rounded-[1.25rem] overflow-hidden mb-3 bg-white/50 dark:bg-black/20 border border-white/80 dark:border-white/5 shadow-sm">
        <Image src={product.image} alt={product.name} fill className="object-cover group-hover:scale-110 transition-transform duration-700" />
        <button
          onClick={onRemove}
          className="absolute top-2 right-2 w-7 h-7 rounded-lg bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95 shadow-md shadow-rose-500/20 z-10"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="px-1 flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
           <span className="text-[8px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest">{product.category}</span>
           <div className="flex items-center gap-0.5 text-[9px] text-amber-500 font-black">
              <Star size={8} fill="currentColor" />
              {product.rating || '4.5'}
           </div>
        </div>
        <h3 className="text-xs font-black text-[oklch(0.18_0.06_280)] dark:text-white truncate mb-4">{product.name}</h3>
      </div>

      <div className="px-1 pb-1 flex items-center justify-between mt-auto">
        <span className="text-sm font-black text-[oklch(0.18_0.06_280)] dark:text-white">${product.price.toFixed(2)}</span>
        <button
          onClick={onAddToCart}
          disabled={isInCart}
          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isInCart ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/10 cursor-default" : "bg-[oklch(0.18_0.06_280)] dark:bg-white text-white dark:text-black hover:scale-110 active:scale-90 shadow-lg shadow-indigo-600/10"}`}
        >
          {isInCart ? <ShoppingBag size={12} /> : <Plus size={14} />}
        </button>
      </div>
    </motion.div>
  );
}

function EmptyWishlist() {
  return (
    <div className="text-center py-20 bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 dark:border-white/10 px-6">
      <div className="w-16 h-16 bg-white/50 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
        <Heart size={32} className="text-rose-300 dark:text-rose-900/50" />
      </div>
      <h2 className="text-xl font-black text-[oklch(0.18_0.06_280)] dark:text-white mb-2">Wishlist is empty</h2>
      <p className="text-neutral-500 text-sm font-medium mb-8 max-w-xs mx-auto">
        Save your future cravings here. Tap the heart on any item to build your list.
      </p>
      <Link
        href="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 text-xs uppercase tracking-widest"
      >
        Browse Menu
        <ArrowLeft size={14} className="rotate-180" />
      </Link>
    </div>
  );
}
