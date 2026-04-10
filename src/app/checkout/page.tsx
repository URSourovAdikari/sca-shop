"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/CartProvider";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft, Phone, MapPin, Tag,
  CreditCard, Loader2, ChevronRight, ShoppingBag
} from "lucide-react";
import Footer from "@/components/Footer";

export default function CheckoutPage() {
  const { data: session, status } = useSession();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();

  const [formData, setFormData] = useState({
    phone: "",
    address: "",
    couponCode: "",
  });

  const phoneRef = useRef<HTMLInputElement>(null);
  const addressRef = useRef<HTMLTextAreaElement>(null);

  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discount: number } | null>(null);
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ phone?: string; address?: string }>({});

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const toTitleCase = (str: string) => {
    return str.replace(/(^\w|\s\w)/g, (char) => char.toUpperCase());
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }

    if (name === "address") {
      setFormData((prev) => ({ ...prev, [name]: toTitleCase(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleApplyCoupon = async () => {
    setCouponError("");
    const code = formData.couponCode.toUpperCase().trim();
    if (!code) return;

    setIsApplyingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, cartTotal }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Invalid coupon code");
      }

      setAppliedCoupon({ 
        code: data.code, 
        discount: data.discount 
      });
    } catch (err: any) {
      setAppliedCoupon(null);
      setCouponError(err.message);
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  const finalTotal = cartTotal - (appliedCoupon?.discount || 0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    // Client-side validation
    const errors: { phone?: string; address?: string } = {};
    if (!formData.phone || formData.phone.length < 10) errors.phone = "Valid phone number is required";
    if (!formData.address || formData.address.length < 10) errors.address = "Detailed delivery address is required";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      
      // Auto-scroll to the first error
      if (errors.phone) {
        phoneRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        phoneRef.current?.focus();
      } else if (errors.address) {
        addressRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        addressRef.current?.focus();
      }
      return;
    }

    setIsSubmitting(true);
    setError("");
    setFieldErrors({});

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");

      clearCart();
      router.push(`/order-confirmation?orderId=${data.orderId}&total=${data.totalAmount}&address=${encodeURIComponent(data.address)}&phone=${data.phone}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <Loader2 className="animate-spin text-indigo-600" size={40} />
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 overflow-hidden -z-0">
          <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        </div>
        <ShoppingBag size={56} className="text-[oklch(0.72_0.12_280)] mb-4 relative z-10" />
        <h2 className="text-xl font-black mb-2 dark:text-white relative z-10">Your cart is empty</h2>
        <Link
          href="/shop"
          className="relative z-10 px-8 py-3.5 bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 hover:scale-105 transition-all text-sm"
        >
          Explore Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-15 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ── Header ── */}
        <motion.div 
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/cart"
            className="group inline-flex items-center gap-2 text-xs font-black mb-4 px-4 py-2 rounded-xl transition-all bg-white/45 dark:bg-white/5 backdrop-blur-md border border-white/60 dark:border-white/10 text-[oklch(0.35_0.12_280)] dark:text-indigo-400"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-[oklch(0.18_0.06_280)] dark:text-white">Checkout</h1>
          <p className="text-[oklch(0.55_0.06_280)] dark:text-neutral-500 font-bold mt-1 px-1 text-sm">Fine-tune your delivery details.</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ── Left Side: Forms ── */}
          <div className="pb-10 lg:col-span-7 space-y-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Delivery Info Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/65 dark:border-white/10 p-7 sm:p-9 shadow-[0_8px_40px_rgba(120,80,255,0.08)]"
              >
                <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-[oklch(0.18_0.08_280)] dark:text-white">
                  <div className="w-10 h-10 bg-indigo-500/10 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <MapPin size={20} />
                  </div>
                  Delivery Information
                </h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[oklch(0.50_0.05_280)] dark:text-neutral-500 mb-2 px-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        readOnly
                        value={session?.user?.name || ""}
                        className="w-full px-5 py-4 bg-white/40 dark:bg-black/20 backdrop-blur-md rounded-2xl border border-white/60 dark:border-white/5 text-neutral-400 font-bold outline-none cursor-not-allowed text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[oklch(0.50_0.05_280)] dark:text-neutral-500 mb-2 px-1">
                        Phone Number <span className="text-[oklch(0.55_0.22_25)]">*</span>
                      </label>
                      <div className="relative group">
                        <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-indigo-500 transition-colors" />
                        <input
                          ref={phoneRef}
                          type="tel"
                          name="phone"
                          required
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="e.g. +1 234 567 8900"
                          className={`w-full pl-12 pr-5 py-4 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl border ${fieldErrors.phone ? "border-rose-500" : "border-white/80 dark:border-white/10"} focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold transition-all dark:text-white placeholder:text-neutral-400 placeholder:font-bold text-sm`}
                        />
                      </div>
                      {fieldErrors.phone && (
                        <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest px-1 animate-pulse">
                          {fieldErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase tracking-widest text-[oklch(0.50_0.05_280)] dark:text-neutral-500 mb-2 px-1">
                        Delivery Address <span className="text-[oklch(0.55_0.22_25)]">*</span>
                      </label>
                      <div className="relative group">
                        <textarea
                          ref={addressRef}
                          name="address"
                          required
                          rows={3}
                          value={formData.address}
                          onChange={handleInputChange}
                          placeholder="Enter your full street address, city and zip code..."
                          className={`w-full px-5 py-4 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-2xl border ${fieldErrors.address ? "border-rose-500" : "border-white/80 dark:border-white/10"} focus:border-indigo-500 dark:focus:border-indigo-500 outline-none font-bold transition-all dark:text-white placeholder:text-neutral-400 placeholder:font-bold resize-none leading-relaxed text-sm`}
                        />
                      </div>
                      {fieldErrors.address && (
                        <p className="mt-2 text-[10px] font-black text-rose-500 uppercase tracking-widest px-1 animate-pulse">
                          {fieldErrors.address}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Promo Code Container */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/65 dark:border-white/10 p-7 shadow-[0_8px_40px_rgba(120,80,255,0.08)]"
              >
                <h2 className="text-lg font-black mb-6 flex items-center gap-3 text-[oklch(0.18_0.08_280)] dark:text-white">
                  <div className="w-9 h-9 bg-amber-500/10 dark:bg-amber-500/20 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400">
                    <Tag size={18} />
                  </div>
                  Promo Code
                </h2>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    name="couponCode"
                    value={formData.couponCode}
                    onChange={handleInputChange}
                    placeholder="Enter code"
                    className="flex-1 px-5 py-3.5 bg-white/60 dark:bg-black/40 backdrop-blur-md rounded-xl border border-white/80 dark:border-white/10 focus:border-amber-500 outline-none font-black tracking-widest uppercase placeholder:normal-case placeholder:tracking-normal dark:text-white placeholder:text-neutral-400 placeholder:font-bold text-sm"
                  />
                  <button 
                    type="button" 
                    onClick={handleApplyCoupon}
                    disabled={isApplyingCoupon || !formData.couponCode}
                    className="px-6 py-3.5 bg-neutral-900 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                  >
                    {isApplyingCoupon ? <Loader2 className="animate-spin" size={16} /> : "Apply Code"}
                  </button>
                </div>
                {appliedCoupon && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 text-xs font-black text-emerald-500 flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    COUPON "{appliedCoupon.code}" APPLIED! SAVED ${appliedCoupon.discount.toFixed(2)}
                  </motion.div>
                )}
                {couponError && (
                  <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mt-4 text-xs font-black text-rose-500 flex items-center gap-2 px-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                    {couponError}
                  </motion.div>
                )}
              </motion.div>

              {error && (
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="p-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-rose-500 text-sm font-black flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500" />
                  {error}
                </motion.div>
              )}

              {/* Payment Info */}
              <div className="p-7 bg-white/45 dark:bg-neutral-900/40 backdrop-blur-3xl rounded-[2rem] border border-white/65 dark:border-white/10 flex items-center gap-5 shadow-[0_8px_40px_rgba(120,80,255,0.08)]">
                <div className="w-11 h-11 bg-indigo-600/10 dark:bg-indigo-500/20 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0">
                  <CreditCard size={22} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-[oklch(0.18_0.08_280)] dark:text-white">Payment Method</h3>
                  <p className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Cash on Delivery (COD)</p>
                </div>
              </div>
            </form>
          </div>

          {/* ── Right Side: Summary Sidebar ── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 pb-10">
            <motion.div 
               initial={{ opacity: 0, x: 24 }}
               animate={{ opacity: 1, x: 0 }}
               className="rounded-[2.5rem] p-7 sm:p-9 relative overflow-hidden bg-white/35 dark:bg-neutral-900/60 backdrop-blur-3xl border border-white/70 dark:border-white/10 shadow-[0_16px_60px_rgba(100,60,255,0.12)]"
            >
              <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full pointer-events-none opacity-50 dark:opacity-20" style={{ background: "radial-gradient(circle, oklch(0.78 0.18 280), transparent 70%)", filter: "blur(40px)" }} />
              
              <h2 className="text-xl font-black mb-8 relative text-[oklch(0.18_0.08_280)] dark:text-white flex items-center gap-3">
                Summary
                <span className="text-[10px] font-bold px-2 py-0.5 bg-white/40 dark:bg-white/5 rounded border border-white/40 dark:border-white/5">${cartTotal.toFixed(2)}</span>
              </h2>
              
              <div className="max-h-[30vh] overflow-y-auto pr-2 mb-8 space-y-4 no-scrollbar relative">
                {cart.map((item) => (
                  <div key={item.id} className="flex items-center gap-4 group">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-white/50 dark:bg-white/5 border border-white/80 dark:border-white/10 transition-transform group-hover:scale-105">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-black truncate text-[oklch(0.18_0.08_280)] dark:text-white">{item.name}</h4>
                      <p className="text-[10px] text-neutral-500 font-bold uppercase tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-black text-indigo-600 dark:text-indigo-400">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 mb-8 relative border-t border-[oklch(0.18_0.08_280)]/5 dark:border-white/5 pt-6">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[oklch(0.50_0.05_280)] dark:text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Subtotal</span>
                  <span className="font-black text-[oklch(0.22_0.06_280)] dark:text-white text-xs">${cartTotal.toFixed(2)}</span>
                </div>
                {appliedCoupon && appliedCoupon.discount > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-emerald-500 font-bold uppercase tracking-widest text-[9px]">Promo Saved</span>
                    <span className="font-black text-emerald-500 text-xs">-${appliedCoupon.discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-center text-sm">
                  <span className="text-[oklch(0.50_0.05_280)] dark:text-neutral-500 font-bold uppercase tracking-widest text-[9px]">Shipping</span>
                  <span className="font-black text-[9px] uppercase tracking-widest px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/10">Free</span>
                </div>
              </div>

              <div className="pt-6 mb-8 border-t border-[oklch(0.18_0.08_280)]/10 dark:border-white/5 flex justify-between items-center relative">
                <div className="text-left">
                  <p className="text-[10px] font-black text-neutral-500 dark:text-neutral-400 uppercase tracking-widest leading-none mb-1">
                    {appliedCoupon && appliedCoupon.discount > 0 ? "Final Total" : "Grand Total"}
                  </p>
                  {appliedCoupon && appliedCoupon.discount > 0 && (
                    <p className="text-xs font-bold text-neutral-400 line-through leading-none decoration-rose-500/50">${cartTotal.toFixed(2)}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className="text-3xl font-black text-[oklch(0.40_0.22_280)] dark:text-indigo-400 tracking-tight leading-none">${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full py-4 rounded-[1.5rem] font-black flex items-center justify-center gap-3 group relative transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-br from-[oklch(0.50_0.25_280)] to-[oklch(0.55_0.22_320)] text-white shadow-xl shadow-indigo-600/30 hover:scale-[1.02] active:scale-95 text-sm"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    Place Order
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              <div className="mt-8 flex items-center justify-center gap-3 py-3 px-6 bg-white/40 dark:bg-white/5 rounded-2xl border border-white/50 dark:border-white/5 relative">
                 <ShoppingBag size={14} className="text-indigo-600 dark:text-indigo-400" />
                 <p className="text-[10px] text-neutral-500 dark:text-neutral-400 font-black uppercase tracking-widest">
                   🔒 Verified COD Transaction
                 </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}