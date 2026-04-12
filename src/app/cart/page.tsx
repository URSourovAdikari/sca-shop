"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag, Trash2, Minus, Plus, ArrowLeft,
  ChevronRight, CreditCard, Tag, ShieldCheck, Truck
} from "lucide-react";
import { useCart } from "@/components/CartProvider";

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();

  return (
    <div className="min-h-screen pt-15 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">

      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 sm:mb-12"
        >
          <div>
            <Link href="/shop" className="group inline-flex items-center gap-2 text-sm font-semibold mb-4 px-4 py-2 rounded-xl transition-all bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-[oklch(0.35_0.12_280)] dark:text-indigo-400">
              <ArrowLeft size={15} className="group-hover:-translate-x-1 transition-transform" />
              Back to Menu
            </Link>
            <h1 className="text-3xl sm:text-4xl font-black flex items-center gap-3 text-[oklch(0.18_0.06_280)] dark:text-white">
              Your Cart
              <span className="text-xl font-bold px-3 py-1 rounded-full bg-white/55 dark:bg-white/10 backdrop-blur-md border border-white/70 dark:border-white/10 text-[oklch(0.40_0.20_280)] dark:text-indigo-300">
                {cartCount} {cartCount === 1 ? "item" : "items"}
              </span>
            </h1>
          </div>
        </motion.div>

        {cart.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

            {/* ── Cart Items ── */}
            <div className="lg:col-span-8 space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45 }}
                className="rounded-3xl overflow-hidden bg-white/45 dark:bg-neutral-900/40 backdrop-blur-2xl border border-white/65 dark:border-white/10 shadow-[0_8px_40px_rgba(120,80,255,0.08)] dark:shadow-none"
              >
                {/* Table Header */}
                <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 text-[10px] font-black uppercase tracking-widest border-b border-white/50 dark:border-white/5 text-[oklch(0.55_0.08_280)] dark:text-neutral-500">
                  <div className="col-span-6">Product Details</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-2 text-center">Qty</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>

                <div>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <CartItemRow
                        key={item.id}
                        item={item}
                        onRemove={() => removeFromCart(item.id)}
                        onUpdateQty={(q) => updateQuantity(item.id, q)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* ── Feature Badges ── */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="grid grid-cols-1 sm:grid-cols-3 gap-4"
              >
                {[
                  { icon: <Truck size={22} />, title: "Free Delivery", sub: "On orders over $50", lightColor: "text-[oklch(0.55_0.18_160)]", darkColor: "dark:text-[oklch(0.72_0.15_160)]", lightBg: "bg-[rgba(120,220,160,0.18)]", darkBg: "dark:bg-[rgba(120,220,160,0.1)]" },
                  { icon: <ShieldCheck size={22} />, title: "Secure Checkout", sub: "100% Protection", lightColor: "text-[oklch(0.50_0.20_260)]", darkColor: "dark:text-[oklch(0.70_0.15_260)]", lightBg: "bg-[rgba(120,160,255,0.18)]", darkBg: "dark:bg-[rgba(120,160,255,0.1)]" },
                  { icon: <Tag size={22} />, title: "Promo Codes", sub: "Apply at checkout", lightColor: "text-[oklch(0.55_0.20_50)]", darkColor: "dark:text-[oklch(0.75_0.15_50)]", lightBg: "bg-[rgba(255,180,80,0.18)]", darkBg: "dark:bg-[rgba(255,180,80,0.1)]" },
                ].map((badge) => (
                  <div key={badge.title} className="flex items-center gap-4 p-4 rounded-2xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-[0_4px_20px_rgba(120,80,255,0.06)]">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${badge.lightBg} ${badge.darkBg} ${badge.lightColor} ${badge.darkColor}`}>
                      {badge.icon}
                    </div>
                    <div>
                      <div className="text-xs font-black text-[oklch(0.22_0.06_280)] dark:text-white">{badge.title}</div>
                      <div className="text-[10px] mt-0.5 text-[oklch(0.55_0.05_280)] dark:text-neutral-500">{badge.sub}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* ── Summary Sidebar ── */}
            <motion.div
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-4"
            >
              <div className="sticky top-28 space-y-4">

                {/* Summary Card */}
                <div className="rounded-3xl p-7 relative overflow-hidden bg-white/35 dark:bg-neutral-900/60 backdrop-blur-3xl border border-white/70 dark:border-white/10 shadow-[0_16px_60px_rgba(100,60,255,0.12)]">

                  {/* Inner blob accent */}
                  <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full pointer-events-none opacity-50 dark:opacity-20" style={{ background: "radial-gradient(circle, oklch(0.78 0.18 280), transparent 70%)", filter: "blur(40px)" }} />

                  <h2 className="text-xl font-black mb-6 relative text-[oklch(0.18_0.08_280)] dark:text-white">Order Summary</h2>

                  <div className="space-y-4 mb-7 relative">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[oklch(0.50_0.05_280)] dark:text-neutral-500">Subtotal</span>
                      <span className="font-bold text-[oklch(0.22_0.06_280)] dark:text-white">${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[oklch(0.50_0.05_280)] dark:text-neutral-500">Delivery Fee</span>
                      <span className="font-black text-[10px] uppercase tracking-widest px-2 py-1 rounded-lg bg-[rgba(120,220,160,0.20)] dark:bg-emerald-500/10 text-[oklch(0.42_0.18_160)] dark:text-emerald-400">Free</span>
                    </div>
                    <div className="pt-4 flex justify-between items-center border-t border-[oklch(0.18_0.08_280)]/10 dark:border-white/5">
                      <span className="text-base font-black text-[oklch(0.18_0.08_280)] dark:text-white">Total</span>
                      <div className="text-right">
                        <div className="text-2xl font-black text-[oklch(0.40_0.22_280)] dark:text-indigo-400">${cartTotal.toFixed(2)}</div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-[oklch(0.60_0.05_280)] dark:text-neutral-500">Inc. all taxes</div>
                      </div>
                    </div>
                  </div>

                  <Link href="/checkout" className="w-full py-4 rounded-2xl font-black flex items-center justify-center gap-2 group relative transition-all" style={{ background: "linear-gradient(135deg, oklch(0.50 0.25 280), oklch(0.55 0.22 320))", color: "white", boxShadow: "0 8px 32px oklch(0.50 0.25 280 / 0.35)" }}>
                    <CreditCard size={18} />
                    Checkout Now
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <div className="mt-4 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest py-2.5 rounded-xl bg-[rgba(120,220,160,0.15)] dark:bg-emerald-500/10 text-[oklch(0.42_0.18_160)] dark:text-emerald-400">
                    <ShieldCheck size={12} />
                    Encrypted & Secure
                  </div>
                </div>

                {/* Continue browsing */}
                <Link href="/shop" className="w-full py-4 rounded-2xl font-bold text-center block transition-all bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white/65 dark:border-white/10 text-[oklch(0.40_0.12_280)] dark:text-indigo-400 shadow-[0_4px_16px_rgba(100,60,255,0.06)] hover:bg-white/60 dark:hover:bg-white/10">
                  Continue Browsing
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}

function CartItemRow({ item, onRemove, onUpdateQty }: { item: any; onRemove: () => void; onUpdateQty: (q: number) => void }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20, height: 0 }}
      className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center p-5 border-b border-white/45 dark:border-white/5"
    >
      {/* Product */}
      <div className="sm:col-span-6 flex items-center gap-4">
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden shrink-0 bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10">
          <Image src={item.image} alt={item.name} fill className="object-cover" />
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-black uppercase tracking-widest mb-1 text-[oklch(0.50_0.20_280)] dark:text-indigo-400">{item.category}</div>
          <h3 className="text-base font-black truncate pr-4 text-[oklch(0.18_0.06_280)] dark:text-white">{item.name}</h3>
          <button onClick={onRemove} className="mt-2 text-xs font-bold flex items-center gap-1.5 transition-colors text-[oklch(0.55_0.22_25)] dark:text-rose-400 hover:text-rose-600 dark:hover:text-rose-300">
            <Trash2 size={11} /> Remove
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="hidden sm:block sm:col-span-2 text-center text-base font-black text-[oklch(0.22_0.06_280)] dark:text-white">
        ${item.price.toFixed(2)}
      </div>

      {/* Qty */}
      <div className="sm:col-span-2 flex justify-center">
        <div className="flex items-center rounded-xl overflow-hidden bg-white/60 dark:bg-white/5 border border-white/80 dark:border-white/10 backdrop-blur-md">
          <button onClick={() => onUpdateQty(item.quantity - 1)} className="w-9 h-10 flex items-center justify-center transition-colors text-[oklch(0.45_0.10_280)] dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white">
            <Minus size={12} strokeWidth={3} />
          </button>
          <div className="w-9 text-center text-sm font-black text-[oklch(0.20_0.08_280)] dark:text-white">{item.quantity}</div>
          <button onClick={() => onUpdateQty(item.quantity + 1)} className="w-9 h-10 flex items-center justify-center transition-colors text-[oklch(0.45_0.10_280)] dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-white">
            <Plus size={12} strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Line total */}
      <div className="sm:col-span-2 text-right text-base font-black text-[oklch(0.40_0.22_280)] dark:text-indigo-400">
        ${(item.price * item.quantity).toFixed(2)}
      </div>
    </motion.div>
  );
}

function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-24 sm:py-32 px-4 rounded-[3rem] bg-white/40 dark:bg-neutral-900/40 backdrop-blur-3xl border-2 border-dashed border-[oklch(0.70_0.10_280)]/30 dark:border-white/10 shadow-[0_8px_40px_rgba(100,60,255,0.08)]"
    >
      <div className="relative inline-block mb-6">
        <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto bg-white/55 dark:bg-white/5 border border-white/80 dark:border-white/10">
          <ShoppingBag size={44} className="text-[oklch(0.72_0.12_280)] dark:text-neutral-500" />
        </div>
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 p-2 rounded-xl shadow-lg bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white"
        >
          <Minus size={14} strokeWidth={3} />
        </motion.div>
      </div>
      <h2 className="text-2xl sm:text-3xl font-black mb-4 text-[oklch(0.20_0.08_280)] dark:text-white">Your bag is empty!</h2>
      <p className="max-w-sm mx-auto mb-8 text-sm sm:text-base text-[oklch(0.50_0.06_280)] dark:text-neutral-500">
        Looks like you haven't added anything yet. Head back to discover our menu.
      </p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-4 font-black rounded-2xl group transition-all bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white shadow-[0_8px_32px_oklch(0.50_0.25_280_/_0.30)] hover:scale-105 active:scale-95">
        Explore Menu
        <ArrowLeft size={18} className="rotate-180 group-hover:translate-x-1 transition-transform" />
      </Link>
    </motion.div>
  );
}
