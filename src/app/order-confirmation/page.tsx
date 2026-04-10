"use client";

import React, { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2, Package, MapPin,
  Phone, Home, ArrowRight, Loader2, Copy, Check, Clock, ChevronRight
} from "lucide-react";

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const total = parseFloat(searchParams.get("total") || "0");
  const address = searchParams.get("address");
  const phone = searchParams.get("phone");

  const [copied, setCopied] = useState(false);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  React.useEffect(() => {
    fetch("/api/orders?limit=3").then(res => res.json()).then(data => {
      // Exclude the current order from the 'recent' list if possible
      setRecentOrders(data.filter((o: any) => o._id !== orderId).slice(0, 3));
    });
  }, [orderId]);

  const handleCopy = () => {
    if (!orderId) return;
    const shortId = `#${orderId.slice(-8).toUpperCase()}`;
    navigator.clipboard.writeText(shortId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/65 dark:border-white/10 p-7 sm:p-10 shadow-[0_32px_80px_rgba(100,60,255,0.08)] text-center"
        >
          {/* Success Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -20 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", damping: 12, delay: 0.1 }}
            className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-2xl shadow-emerald-500/30"
          >
            <CheckCircle2 size={32} strokeWidth={2.5} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h1 className="text-2xl sm:text-3xl font-black text-[oklch(0.18_0.06_280)] dark:text-white mb-2 tracking-tight">
              Order Confirmed!
            </h1>
            <p className="text-[oklch(0.50_0.06_280)] dark:text-neutral-500 font-bold mb-10 max-w-sm mx-auto leading-relaxed text-xs">
              Sit back and relax. Our chefs are already preparing your delicious meal with the freshest ingredients.
            </p>
          </motion.div>

          {/* Details Grid */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-10"
          >
            {/* Order Identity Card */}
            <div className="p-6 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/80 dark:border-white/5 shadow-sm group">
              <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-widest mb-2 block">Order Identity</span>
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-black text-[oklch(0.18_0.06_280)] dark:text-white break-all">
                  #{orderId?.slice(-8).toUpperCase() || "N/A"}
                </p>
                <button 
                  onClick={handleCopy}
                  className="p-2 rounded-xl bg-white/60 dark:bg-white/5 border border-white dark:border-white/10 hover:scale-110 active:scale-90 transition-all text-indigo-600 dark:text-indigo-400 shadow-sm"
                >
                  {copied ? <Check size={14} /> : <Copy size={14} />}
                </button>
              </div>
            </div>

            {/* Preparation Status */}
            <div className="p-6 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/80 dark:border-white/5 shadow-sm">
              <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest mb-2 block">Status</span>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                <p className="text-[10px] font-black text-[oklch(0.18_0.06_280)] dark:text-white uppercase tracking-widest">Pending</p>
              </div>
            </div>

            {/* Delivery Details */}
            <div className="md:col-span-2 p-6 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-3xl border border-white/80 dark:border-white/5 shadow-sm space-y-5">
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                  <MapPin size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 block">Delivery Address</span>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300 leading-relaxed">{address}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-5 border-t border-neutral-200/50 dark:border-white/5">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-neutral-500 shrink-0">
                  <Phone size={16} />
                </div>
                <div>
                  <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest mb-0.5 block">Phone Number</span>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">{phone}</p>
                </div>
              </div>
            </div>

            {/* Total Highlight */}
            <div className="md:col-span-2 p-8 bg-[oklch(0.18_0.06_280)] dark:bg-black/40 rounded-3xl text-white flex justify-between items-center shadow-lg">
              <div>
                <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1 block">Total (COD)</span>
                <p className="text-2xl font-black text-white tracking-tighter">${total.toFixed(2)}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl">
                <Package size={32} className="text-white/20" />
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-4 bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 text-[oklch(0.18_0.06_280)] dark:text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-white/60 dark:hover:bg-white/10 transition-all text-[11px] uppercase tracking-widest"
            >
              <Home size={14} />
              Home
            </Link>
            <Link
              href="/orders"
              className="px-6 py-4 bg-white/45 dark:bg-white/5 backdrop-blur-xl border border-white dark:border-white/10 text-indigo-600 dark:text-indigo-400 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 transition-all text-[11px] uppercase tracking-widest"
            >
              <Package size={14} />
              Track
            </Link>
            <Link
              href="/shop"
              className="px-8 py-4 bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white rounded-2xl font-black flex items-center justify-center gap-2 hover:scale-105 shadow-xl shadow-indigo-600/30 transition-all group text-[11px] uppercase tracking-widest"
            >
              Order Again
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {/* Recent Orders Tracker (Friendly UI) */}
          {recentOrders.length > 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-16 pt-10 border-t border-[oklch(0.18_0.06_280)]/5 dark:border-white/5"
            >
              <h3 className="text-[10px] font-black text-neutral-400 dark:text-neutral-500 uppercase tracking-[0.2em] mb-6">Recent Order Activity</h3>
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between p-3.5 bg-white/30 dark:bg-white/5 rounded-2xl border border-white/40 dark:border-white/5 group hover:border-indigo-500/30 transition-all">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                          <Clock size={14} />
                       </div>
                       <div className="text-left">
                          <p className="text-[11px] font-black text-[oklch(0.18_0.06_280)] dark:text-white">#{order._id.slice(-6).toUpperCase()}</p>
                          <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest">${order.totalAmount.toFixed(2)}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <div className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${
                         order.orderStatus === 'delivered' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                         order.orderStatus === 'cancelled' ? 'bg-neutral-100 text-neutral-400 border-neutral-200' :
                         'bg-amber-500/10 text-amber-600 border-amber-500/20'
                       }`}>
                         {order.orderStatus}
                       </div>
                       <Link href={`/orders/${order._id}`} className="text-neutral-300 hover:text-indigo-500 transition-colors">
                          <ChevronRight size={14} />
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

        </motion.div>
      </div>
    </div>
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    }>
      <OrderConfirmationContent />
    </Suspense>
  );
}
