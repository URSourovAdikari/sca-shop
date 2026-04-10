"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Package, Clock, Truck,
  CheckCircle2, MapPin, Phone, CreditCard,
  X, Loader2, AlertCircle, Calendar, Hash, Copy, Check
} from "lucide-react";
import Image from "next/image";
import Footer from "@/components/Footer";

interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface Order {
  _id: string;
  items: OrderItem[];
  phone: string;
  address: string;
  couponCode?: string;
  discountAmount: number;
  totalAmount: number;
  orderStatus: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentMethod: string;
  paymentStatus: "pending" | "paid";
  createdAt: string;
  cancelReason?: string;
  cancelledAt?: string;
}

export default function OrderDetailsPage() {
  const { id } = useParams();
  const { status } = useSession();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  // States for cancellation
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=/orders/${id}`);
    } else if (status === "authenticated") {
      fetchOrder();
    }
  }, [status, id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!order) return;
    const shortId = `#${order._id.slice(-8).toUpperCase()}`;
    navigator.clipboard.writeText(shortId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCancelOrder = async () => {
    setIsCancelling(true);
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setOrder(prev => prev ? { ...prev, orderStatus: "cancelled" } : null);
      setShowCancelModal(false);
      if (data.message) alert(data.message);
    } catch (err: any) {
      alert(err.message);
    } finally {

      setIsCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <AlertCircle size={48} className="text-rose-500 mb-4" />
        <h2 className="text-xl font-black mb-2 dark:text-white">Order Not Found</h2>
        <p className="text-neutral-500 mb-8 text-sm">{error || "We couldn't find the order you're looking for."}</p>
        <Link href="/orders" className="px-8 py-3.5 bg-indigo-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-lg shadow-indigo-600/20">
          Back to Orders
        </Link>
      </div>
    );
  }

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "delivered": return { color: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20", icon: <CheckCircle2 size={12} /> };
      case "confirmed": return { color: "text-blue-500 bg-blue-500/10 border-blue-500/20", icon: <CheckCircle2 size={12} /> };
      case "preparing": return { color: "text-amber-500 bg-amber-500/10 border-amber-500/20", icon: <Loader2 size={12} className="animate-spin" /> };
      case "out_for_delivery": return { color: "text-indigo-500 bg-indigo-500/10 border-indigo-500/20", icon: <Truck size={12} /> };
      case "cancelled": return { color: "text-neutral-400 bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700", icon: <X size={12} /> };
      default: return { color: "text-amber-400 bg-amber-400/10 border-amber-400/20", icon: <Clock size={12} /> };
    }
  };

  const statusConfig = getStatusConfig(order.orderStatus);
  const orderTimeInMs = new Date(order.createdAt).getTime();
  const canCancel = order.orderStatus === "pending" && (Date.now() - orderTimeInMs < 30 * 60 * 1000);

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500 text-sm">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6">
        <header className="mb-6">
          <Link
            href="/orders"
            className="group inline-flex items-center gap-2 text-xs font-bold mb-4 px-4 py-2 rounded-xl transition-all bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-[oklch(0.35_0.12_280)] dark:text-indigo-400"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Order List
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl sm:text-3xl font-black text-[oklch(0.18_0.06_280)] dark:text-white">Order Details</h1>
                <div className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border ${statusConfig.color}`}>
                  {statusConfig.icon}
                  {order.orderStatus}
                </div>
              </div>
              <p className="text-neutral-500 font-bold px-0.5 text-xs flex items-center gap-2">
                Reference: 
                <button onClick={handleCopy} className="text-indigo-600 dark:text-indigo-400 hover:scale-105 transition-all text-[11px] font-black flex items-center gap-1 group/id">
                  #{order._id.slice(-8).toUpperCase()}
                  {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="opacity-0 group-hover/id:opacity-100 transition-opacity" />}
                </button>
              </p>
            </div>

            {canCancel && (
              <button
                onClick={() => setShowCancelModal(true)}
                className="px-5 py-2.5 bg-rose-500/10 text-rose-500 rounded-xl font-black text-[10px] uppercase tracking-widest border border-rose-500/20 hover:bg-rose-500/20 transition-all shadow-lg shadow-rose-500/5 whitespace-nowrap"
              >
                Request Cancellation
              </button>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Main Info */}
          <div className="lg:col-span-8 space-y-5">
            {/* Items Card */}
            <div className="bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/65 dark:border-white/10 overflow-hidden shadow-sm">
              <div className="p-5 border-b border-[oklch(0.18_0.08_280)]/5 dark:border-white/5">
                <h2 className="text-sm font-black flex items-center gap-2 text-[oklch(0.18_0.08_280)] dark:text-white">
                  <Package size={16} className="text-indigo-500" />
                  Purchased Items
                </h2>
              </div>
              <div className="divide-y divide-[oklch(0.18_0.08_280)]/5 dark:divide-white/5">
                {order.items.map((item, i) => (
                  <div key={i} className="p-5 flex items-center gap-4 transition-colors hover:bg-white/30 dark:hover:bg-white/5">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/50 dark:bg-black/20 shrink-0 border border-white dark:border-white/5 shadow-sm">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[oklch(0.18_0.06_280)] dark:text-white mb-0.5 truncate">{item.name}</h3>
                      <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Qty: {item.quantity} • ${item.price.toFixed(2)} ea</p>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-indigo-600 dark:text-indigo-400">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Logistics & Payment */}
            <div className="mb-10 bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2.5rem] border border-white/65 dark:border-white/10 p-7 space-y-8 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-2">
                    <MapPin size={12} />
                    Delivery Destination
                  </h3>
                  <p className="text-xs font-bold leading-relaxed text-neutral-700 dark:text-neutral-300">
                    {order.address}
                  </p>
                </div>
                <div>
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-2">
                    <Phone size={12} />
                    Recipient Contact
                  </h3>
                  <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                    {order.phone}
                  </p>
                </div>
              </div>

              <div className="pt-8 border-t border-[oklch(0.18_0.08_280)]/5 dark:border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-[9px] font-black uppercase tracking-widest text-neutral-400 mb-2 flex items-center gap-2">
                    <CreditCard size={12} />
                    Payment Details
                  </h3>
                  <div className="flex items-center gap-3">
                    <p className="text-xs font-bold text-neutral-700 dark:text-neutral-300">Method: {order.paymentMethod}</p>
                    <span className="px-2 py-0.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-widest border border-emerald-500/10">
                      Status: {order.paymentStatus}
                    </span>
                  </div>
                </div>
                {order.orderStatus === "cancelled" && (
                  <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10">
                    <h3 className="text-[9px] font-black uppercase tracking-widest text-rose-500 mb-1">Reason for Withdrawal</h3>
                    <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 leading-tight">{order.cancelReason || "User Cancellation"}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar Summary Card */}
          <div className="lg:col-span-4 space-y-5">
            <div className="bg-[oklch(0.18_0.06_280)] dark:bg-neutral-900/60 rounded-[2.5rem] p-7 text-white shadow-xl shadow-indigo-600/10 relative overflow-hidden group">
              <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none group-hover:scale-125 transition-transform" />
              <h2 className="text-base font-black mb-6 border-b border-white/5 pb-4 relative z-10">Financial Summary</h2>

              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold uppercase tracking-widest text-[9px]">Items Subtotal</span>
                  <span className="font-bold">${(order.totalAmount + order.discountAmount).toFixed(2)}</span>
                </div>
                {order.discountAmount > 0 && (
                  <div className="flex justify-between items-center text-xs text-emerald-400">
                    <span className="font-bold uppercase tracking-widest text-[9px]">Promo Code ({order.couponCode})</span>
                    <span className="font-black">-${order.discountAmount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-xs">
                  <span className="text-neutral-400 font-bold uppercase tracking-widest text-[9px]">Global Delivery</span>
                  <span className="text-emerald-400 font-black uppercase tracking-[0.2em] text-[10px]">Free</span>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 flex justify-between items-end relative z-10">
                <div>
                   <span className="text-[9px] font-black text-neutral-400 uppercase tracking-widest block mb-1">Total Bill</span>
                   <span className="text-3xl font-black text-white tracking-tighter">${order.totalAmount.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <p className="text-[8px] text-neutral-500 font-bold uppercase tracking-widest">Calculated Price</p>
                </div>
              </div>
            </div>

            {/* Quick Metadata */}
            <div className="mb-10 bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2.5rem] p-6 border border-white/65 dark:border-white/10 space-y-5 shadow-sm">
              <div className="flex items-center gap-3 text-neutral-500">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-black/20 flex items-center justify-center text-neutral-400 shrink-0">
                  <Calendar size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-black uppercase tracking-widest text-[9px] text-neutral-400">Transaction Date</p>
                  <p className="font-bold text-neutral-700 dark:text-neutral-300 truncate text-[11px]">{date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-neutral-500">
                <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-black/20 flex items-center justify-center text-neutral-400 shrink-0">
                  <Hash size={14} />
                </div>
                <div className="min-w-0">
                  <p className="font-black uppercase tracking-widest text-[9px] text-neutral-400">Merchant Reference</p>
                  <p className="font-black text-indigo-600 dark:text-indigo-400 truncate text-[11px]">#{order._id.slice(-8).toUpperCase()}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />

      {/* Cancellation Modal - Compact Friendly UI */}
      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl">
              <button onClick={() => setShowCancelModal(false)} className="absolute top-6 right-6 text-neutral-300 hover:text-neutral-600 transition-colors">
                <X size={18} />
              </button>
              <div className="w-14 h-14 bg-rose-500/10 rounded-2xl flex items-center justify-center text-rose-500 mb-6">
                <AlertCircle size={24} />
              </div>
              <h3 className="text-xl font-black mb-2 text-[oklch(0.18_0.06_280)] dark:text-white">Withdraw Order?</h3>
              <p className="text-neutral-500 text-xs mb-6 font-medium leading-relaxed">This request will cancel your current preparation. Please provide a reason if you have a moment.</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason..."
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-black/20 rounded-xl border-none outline-none font-bold text-xs mb-6 resize-none"
                rows={2}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3.5 bg-neutral-100 dark:bg-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest">Wait</button>
                <button onClick={handleCancelOrder} disabled={isCancelling} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20">{isCancelling ? <Loader2 className="animate-spin" size={12} /> : "Cancel Order"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
