"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, CheckCircle2, Truck,
  ChevronRight, ArrowLeft, Loader2, X, Copy, Check, ShoppingBag
} from "lucide-react";
import Image from "next/image";

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
  totalAmount: number;
  orderStatus: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered" | "cancelled";
  paymentStatus: "pending" | "paid";
  createdAt: string;
  address: string;
}

export default function OrdersPage() {
  const { status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/orders");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setOrders(data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async (orderId: string, reason: string) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cancelReason: reason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      // Update UI based on whether it was a bulk or single cancellation
      if (data.message.includes("cleared")) {
        setOrders(prev => prev.map(o => o.orderStatus === "pending" ? { ...o, orderStatus: "cancelled" } : o));
      } else {
        setOrders(prev => prev.map(o => o._id === orderId ? { ...o, orderStatus: "cancelled" } : o));
      }
      
      if (data.message) alert(data.message);

      return true;
    } catch (err: any) {
      alert(err.message);
      return false;
    }

  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6">
        <header className="mb-8">
          <Link
            href="/shop"
            className="group inline-flex items-center gap-2 text-xs font-bold mb-4 px-4 py-2 rounded-xl transition-all bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-[oklch(0.35_0.12_280)] dark:text-indigo-400"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Shop
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[oklch(0.18_0.06_280)] dark:text-white">Order History</h1>
          <p className="text-[oklch(0.55_0.06_280)] dark:text-neutral-500 font-bold mt-1 px-1 text-sm">Review and track your recent cravings.</p>
        </header>

        {orders.length === 0 ? (
          <EmptyOrders />
        ) : (
          <div className="space-y-4">
            <AnimatePresence>
              {orders.map((order, index) => (
                <OrderCard
                  key={order._id}
                  order={order}
                  index={index}
                  onCancel={handleCancelOrder}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}

function OrderCard({ order, index, onCancel }: { order: Order; index: number; onCancel: (id: string, reason: string) => Promise<boolean> }) {
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
  const [copied, setCopied] = useState(false);

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  });

  const handleCopy = () => {
    setCopied(true);
    const shortId = `#${order._id.slice(-8).toUpperCase()}`;
    navigator.clipboard.writeText(shortId);
    setTimeout(() => setCopied(false), 2000);
  };

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

  const handleConfirmCancel = async () => {
    setIsCancelling(true);
    if (await onCancel(order._id, cancelReason)) setShowCancelModal(false);
    setIsCancelling(false);
  };

  const orderTimeInMs = new Date(order.createdAt).getTime();
  const canCancel = order.orderStatus === "pending" && (Date.now() - orderTimeInMs < 30 * 60 * 1000);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        className="bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/65 dark:border-white/10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_40px_rgba(100,60,255,0.08)] transition-all overflow-hidden group"
      >
        <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-1 min-w-[200px]">
            <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-white/50 dark:bg-black/20 border border-white dark:border-white/5 shrink-0">
               <Image src={order.items[0]?.image} alt="order" fill className="object-cover" />
               {order.items.length > 1 && (
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-[9px] font-black text-white">
                   +{order.items.length - 1}
                 </div>
               )}
            </div>
            
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-neutral-400">Order ID</span>
                <button onClick={handleCopy} className="text-xs font-black text-[oklch(0.18_0.06_280)] dark:text-white hover:text-indigo-500 flex items-center gap-1 transition-colors group/id">
                  #{order._id.slice(-8).toUpperCase()}
                  {copied ? <Check size={10} className="text-emerald-500" /> : <Copy size={10} className="opacity-0 group-hover/id:opacity-100 transition-opacity" />}
                </button>
              </div>
              <div className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">{date} • ${order.totalAmount.toFixed(2)}</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest flex items-center gap-1.5 border shadow-sm ${statusConfig.color}`}>
              {statusConfig.icon}
              {order.orderStatus}
            </div>
            
            <Link 
              href={`/orders/${order._id}`}
              className="p-2.5 rounded-xl bg-white/50 dark:bg-white/5 border border-white/60 dark:border-white/10 text-neutral-400 hover:text-indigo-500 transition-all hover:scale-105"
            >
              <ChevronRight size={16} />
            </Link>
          </div>
        </div>

        {canCancel && (
          <div className="px-5 py-2.5 bg-rose-500/5 border-t border-rose-500/10 flex justify-end">
             <button onClick={() => setShowCancelModal(true)} className="text-[9px] font-black text-rose-500 uppercase tracking-widest hover:underline">
               Request Cancellation
             </button>
          </div>
        )}
      </motion.div>

      <AnimatePresence>
        {showCancelModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCancelModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="relative w-full max-w-sm bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-2xl">
              <h3 className="text-xl font-black mb-2 text-[oklch(0.18_0.06_280)] dark:text-white">Cancel Order?</h3>
              <p className="text-neutral-500 text-xs mb-6 font-medium">This action is permanent. Please provide a reason if you wish.</p>
              <textarea
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                placeholder="Reason..."
                className="w-full px-4 py-3 bg-neutral-100 dark:bg-black/20 rounded-xl border-none outline-none font-bold text-xs mb-6 resize-none"
                rows={2}
              />
              <div className="flex gap-3">
                <button onClick={() => setShowCancelModal(false)} className="flex-1 py-3.5 bg-neutral-100 dark:bg-white/5 rounded-xl font-black text-[10px] uppercase tracking-widest">Wait</button>
                <button onClick={handleConfirmCancel} disabled={isCancelling} className="flex-1 py-3.5 bg-rose-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-500/20">{isCancelling ? <Loader2 className="animate-spin inline" size={12} /> : "Cancel Order"}</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

function EmptyOrders() {
  return (
    <div className="text-center py-16 bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[3rem] border border-white/60 dark:border-white/10 px-6">
      <div className="w-16 h-16 bg-neutral-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={32} className="text-neutral-300 dark:text-neutral-700" />
      </div>
      <h2 className="text-xl font-black text-[oklch(0.18_0.06_280)] dark:text-white mb-2">No active orders</h2>
      <p className="text-neutral-500 text-sm font-medium mb-8">Your order history is currently empty.</p>
      <Link href="/shop" className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white font-black rounded-xl shadow-xl shadow-indigo-600/20 transition-all hover:scale-105 text-sm uppercase tracking-widest">
        Order Now
      </Link>
    </div>
  );
}
