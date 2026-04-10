"use client";

import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart, Star, ShoppingCart, Check, Plus, Minus,
  Flame, Clock, Utensils, ChevronLeft, Share2,
  Leaf, ShieldCheck, Truck, RotateCcw, PackageX, ThumbsUp, BadgeCheck,
  MessageSquarePlus
} from "lucide-react";
import type { Product } from "@/models/Products";
import { useCart } from "@/components/CartProvider";
import { useSession } from "next-auth/react";

type Tab = "description" | "reviews" | "nutrition";

function QtyBlock({ quantity, atMin, atMax, onMinus, onPlus, onInput, stock }: any) {
  return (
    <div className="flex items-center bg-white/45 dark:bg-black/20 backdrop-blur-md rounded-xl border border-white/60 dark:border-white/5 overflow-hidden shrink-0 shadow-sm transition-colors duration-500">
      <button onClick={onMinus} disabled={atMin} className="w-8 h-9 sm:w-9 sm:h-10 flex items-center justify-center text-neutral-500 hover:bg-white dark:hover:bg-white/5 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <Minus size={11} strokeWidth={3} />
      </button>
      <input
        type="number"
        value={quantity}
        min={1}
        max={stock}
        onChange={e => onInput(e.target.value)}
        onBlur={e => onInput(e.target.value)}
        className="w-8 sm:w-10 h-9 sm:h-10 text-center text-xs font-black bg-transparent border-none outline-none text-neutral-900 dark:text-white [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
      />
      <button onClick={onPlus} disabled={atMax} className="w-8 h-9 sm:w-9 sm:h-10 flex items-center justify-center text-neutral-500 hover:bg-white dark:hover:bg-white/5 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all">
        <Plus size={11} strokeWidth={3} />
      </button>
    </div>
  );
}

export default function ProductDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [dbProduct, setDbProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (!data.error) {
          const found = data.find((p: any) => p.id === id) as Product | undefined;
          setDbProduct(found || null);
        }
      })
      .catch(err => console.error("Failed to fetch product:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const { cart, wishlist, toggleWishlist, addToCart, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("reviews");

  const { data: session } = useSession();
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [editingReview, setEditingReview] = useState<any>(null);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (id) {
      fetch(`/api/reviews?productId=${id}`)
        .then(res => res.json())
        .then(data => {
          if (!data.error) setReviews(data);
        })
        .finally(() => setReviewLoading(false));
    }
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 border-4 border-indigo-200 dark:border-indigo-900/30 rounded-xl" />
          <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-xl animate-spin" />
        </div>
      </div>
    );
  }

  if (!dbProduct) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 p-8 bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950">
        <PackageX size={48} className="text-neutral-300 dark:text-neutral-700" />
        <h2 className="text-xl font-black text-neutral-900 dark:text-white uppercase tracking-widest">Unavailable</h2>
        <Link href="/shop" className="px-8 py-3.5 rounded-xl bg-indigo-600 text-white font-black text-[10px] uppercase tracking-[0.2em] shadow-xl shadow-indigo-600/20">
          Back to Shop
        </Link>
      </div>
    );
  }

  const product = dbProduct; // Now we are sure it's not null

  const clamp = (val: number) => Math.min(product.stock, Math.max(1, val));
  const changeQty = (delta: number) => setQuantity(prev => clamp(prev + delta));
  const setQtyDirect = (raw: string) => {
    const parsed = parseInt(raw, 10);
    setQuantity(isNaN(parsed) ? 1 : clamp(parsed));
  };

  const totalPrice = (product.price * quantity).toFixed(2);

  const getAvgRating = () => {
    if (reviews.length === 0) return "0.0";
    return (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  };
  const avgRating = getAvgRating();

  const getRatingDist = () => {
    const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    if (reviews.length === 0) return dist;
    reviews.forEach(r => dist[r.rating as keyof typeof dist]++);
    Object.keys(dist).forEach(k => {
      dist[parseInt(k)] = Math.round((dist[parseInt(k)] / reviews.length) * 100);
    });
    return dist;
  };
  const RATING_DIST = getRatingDist();

  const isWishlisted = wishlist.some(item => item.id === id);
  const isInCart = cart.some(item => item.id === id);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    setIsSubmittingReview(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: id, ...reviewForm }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews([data, ...reviews]);
        setReviewForm({ rating: 5, comment: "" });
      }
    } catch (err) {
      console.error("Failed to post review:", err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const handleLike = async (reviewId: string) => {
    if (!session) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "like" }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(reviews.map(r => r._id === reviewId ? data : r));
      }
    } catch (err) {
      console.error("Action failed:", err);
    }
  };

  const handleAdminReply = async (reviewId: string) => {
    if (!replyText.trim()) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        body: JSON.stringify({ action: "reply", comment: replyText }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(reviews.map(r => r._id === reviewId ? data : r));
        setReplyingTo(null);
        setReplyText("");
      }
    } catch (err) {
      console.error("Failed to reply:", err);
    }
  };

  const handleUpdateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/reviews/${editingReview._id}`, {
        method: "PATCH",
        body: JSON.stringify({ comment: editingReview.comment, rating: editingReview.rating }),
      });
      const data = await res.json();
      if (res.ok) {
        setReviews(reviews.map(r => r._id === data._id ? data : r));
        setEditingReview(null);
      }
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm("Delete this review?")) return;
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, { method: "DELETE" });
      if (res.ok) {
        setReviews(reviews.filter(r => r._id !== reviewId));
      }
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleCart = () => {
    if (isInCart) removeFromCart(id);
    else addToCart(product, quantity);
  };

  const TABS: { id: Tab; label: string; count?: number; mobileOnly?: boolean }[] = [
    { id: "description", label: "Details", mobileOnly: true },
    { id: "reviews", label: "Reviews", count: reviews.length },
    { id: "nutrition", label: "Nutrients" },
  ];



  const renderTabsComponent = (isDesktopView: boolean) => (
    <div className={`mt-8 w-full ${isDesktopView ? "hidden lg:block" : "block lg:hidden"}`}>
      <div className="flex gap-1.5 p-1 rounded-2xl bg-white/45 dark:bg-black/20 backdrop-blur-md border border-white/80 dark:border-white/5 mb-6 shadow-sm overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex-1 py-3 px-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all duration-300 ${tab.mobileOnly ? "sm:hidden" : ""} ${activeTab === tab.id ? "bg-white dark:bg-neutral-900 text-indigo-600 dark:text-white shadow-sm border border-white/60 dark:border-white/5" : "text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"}`}
          >
            {tab.label}
            {tab.count !== undefined && <span className="ml-1 opacity-50">({tab.count})</span>}
          </button>
        ))}
      </div>

      <div className="min-h-[160px]">
        <AnimatePresence mode="wait">
          {activeTab === "description" && (
            <motion.div key="desc" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="sm:hidden">
              <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold tracking-tight">
                {product.fullDescription || product.description}
              </p>
            </motion.div>
          )}

          {activeTab === "reviews" && (
            <motion.div key="rev" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-5 rounded-3xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-sm flex flex-col items-center justify-center text-center">
                  <div className="text-4xl font-black text-indigo-600 dark:text-white mb-2">{avgRating}</div>
                  <div className="flex items-center gap-0.5 mb-1">
                    {[1, 2, 3, 4, 5].map(s => <Star key={s} size={11} fill={s <= parseFloat(avgRating) ? "#EAB308" : "none"} className="text-yellow-500" />)}
                  </div>
                  <div className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">{reviews.length} Verifiable Reviews</div>
                </div>
                <div className="p-5 rounded-3xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-sm space-y-2 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-[8px] font-black text-neutral-400 w-1">{star}</span>
                      <div className="flex-1 h-1 rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                        <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${RATING_DIST[star]}%` }} />
                      </div>
                      <span className="text-[8px] font-black text-neutral-400 w-5">{RATING_DIST[star]}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {session ? (
                <form onSubmit={handleReviewSubmit} className="p-6 rounded-3xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-sm space-y-4">
                  <h4 className="text-xs font-black uppercase tracking-widest text-neutral-900 dark:text-white">Write a Review</h4>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <button key={s} type="button" onClick={() => setReviewForm(prev => ({ ...prev, rating: s }))}>
                        <Star size={16} fill={s <= reviewForm.rating ? "#EAB308" : "none"} className={s <= reviewForm.rating ? "text-yellow-500" : "text-neutral-300"} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={reviewForm.comment}
                    onChange={e => setReviewForm(prev => ({ ...prev, comment: e.target.value }))}
                    className="w-full p-4 rounded-xl bg-white/20 dark:bg-black/20 border border-white/60 dark:border-white/5 text-xs focus:ring-1 focus:ring-indigo-500 outline-none resize-none min-h-[80px]"
                    placeholder="Tell others what you think..."
                    required
                  />
                  <button
                    disabled={isSubmittingReview}
                    className="w-full py-3 rounded-xl bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest disabled:opacity-50"
                  >
                    {isSubmittingReview ? "Posting..." : "Post Review"}
                  </button>
                </form>
              ) : (
                <div className="p-6 rounded-3xl bg-indigo-600/5 border border-indigo-600/10 text-center">
                  <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-3">Please login to share your experience</p>
                  <Link href="/login" className="text-[10px] font-black text-white bg-indigo-600 px-6 py-2 rounded-lg uppercase tracking-widest">Login</Link>
                </div>
              )}

              {reviewLoading ? (
                <div className="p-10 text-center"><div className="animate-spin w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full mx-auto" /></div>
              ) : reviews.length === 0 ? (
                <div className="p-10 text-center text-[10px] font-black text-neutral-400 uppercase tracking-widest bg-white/20 rounded-3xl border border-dashed border-neutral-300">No reviews yet</div>
              ) : (
                reviews.map(review => (
                  <div key={review._id} className="p-5 rounded-3xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-sm relative group">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-white text-xs font-black shadow-lg">
                          {review.userImage ? <Image src={review.userImage} alt="" width={40} height={40} className="rounded-xl" /> : review.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className="text-sm font-black text-neutral-900 dark:text-white">{review.userName}</span>
                            <BadgeCheck size={12} className="text-indigo-400" />
                          </div>
                          <span className="text-[8px] font-black text-neutral-400 uppercase tracking-widest">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5].map(s => <Star key={s} size={10} fill={s <= review.rating ? "#EAB308" : "none"} className={s <= review.rating ? "text-yellow-500" : "text-neutral-200"} />)}
                      </div>
                    </div>

                    {editingReview?._id === review._id ? (
                      <form onSubmit={handleUpdateReview} className="space-y-3 mb-4">
                        <div className="flex gap-1.5">
                          {[1, 2, 3, 4, 5].map(s => (
                            <button key={s} type="button" onClick={() => setEditingReview({ ...editingReview, rating: s })}>
                              <Star size={12} fill={s <= editingReview.rating ? "#EAB308" : "none"} className="text-yellow-500" />
                            </button>
                          ))}
                        </div>
                        <textarea
                          value={editingReview.comment}
                          onChange={e => setEditingReview({ ...editingReview, comment: e.target.value })}
                          className="w-full p-3 rounded-xl bg-white/20 border border-white/60 text-xs text-neutral-900 dark:text-white outline-none"
                        />
                        <div className="flex gap-2">
                          <button type="submit" className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-[10px] uppercase font-black">Save</button>
                          <button type="button" onClick={() => setEditingReview(null)} className="px-4 py-1.5 bg-neutral-200 text-neutral-700 rounded-lg text-[10px] uppercase font-black">Cancel</button>
                        </div>
                      </form>
                    ) : (
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold tracking-tight mb-4">{review.comment}</p>
                    )}

                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
                      <button
                        onClick={() => handleLike(review._id)}
                        className={`flex items-center gap-1.5 transition-all ${review.likes?.some((uid: any) => uid.toString() === session?.user?.id) ? "text-indigo-600" : "text-neutral-400 hover:text-indigo-500"}`}
                      >
                        <ThumbsUp size={12} fill={review.likes?.some((uid: any) => uid.toString() === session?.user?.id) ? "currentColor" : "none"} /> {review.likes?.length || 0}
                      </button>


                      {session?.user?.role === "admin" && (
                        <button onClick={() => setReplyingTo(replyingTo === review._id ? null : review._id)} className="text-neutral-400 hover:text-indigo-500 flex items-center gap-1.5">
                          <MessageSquarePlus size={12} /> Reply
                        </button>
                      )}

                      {session?.user?.id === review.userId && !editingReview && (
                        <>
                          <button onClick={() => setEditingReview(review)} className="text-neutral-400 hover:text-emerald-500">Edit</button>
                          <button onClick={() => handleDeleteReview(review._id)} className="text-neutral-400 hover:text-rose-500">Delete</button>
                        </>
                      )}
                    </div>

                    {/* Replies */}
                    {review.replies?.length > 0 && (
                      <div className="mt-4 ml-6 space-y-3 pt-3 border-l-2 border-indigo-100 dark:border-white/5 pl-4">
                        {review.replies.map((reply: any, i: number) => (
                          <div key={i}>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-[10px] font-black text-indigo-600 dark:text-indigo-400">{reply.adminName}</span>
                              <span className="px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-[7px] text-indigo-600 border border-indigo-500/20">ADMIN</span>
                            </div>
                            <p className="text-[11px] text-neutral-600 dark:text-neutral-400 font-bold">{reply.comment}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Reply Input */}
                    {replyingTo === review._id && (
                      <div className="mt-4 ml-6 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={e => setReplyText(e.target.value)}
                          className="w-full p-3 rounded-xl bg-white/20 border border-white/60 text-xs outline-none"
                          placeholder="Write admin reply..."
                        />
                        <button onClick={() => handleAdminReply(review._id)} className="px-4 py-2 bg-neutral-900 text-white text-[9px] uppercase font-black rounded-lg">Send Reply</button>
                      </div>
                    )}
                  </div>
                ))
              )}

            </motion.div>
          )}

          {activeTab === "nutrition" && (
            <motion.div key="nut" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.3 }} className="space-y-4">
              {product.nutritionalInfo && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { label: "Proteins", value: product.nutritionalInfo.protein, color: "bg-indigo-500" },
                    { label: "Carbs", value: product.nutritionalInfo.carbs, color: "bg-fuchsia-500" },
                    { label: "Health Fats", value: product.nutritionalInfo.fats, color: "bg-orange-500" },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="p-4 rounded-2xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-xl border border-white/65 dark:border-white/10 shadow-sm">
                      <div className="text-[8px] font-black uppercase tracking-widest text-neutral-400 mb-1">{label}</div>
                      <div className="text-sm font-black text-neutral-900 dark:text-white mb-2">{value}</div>
                      <div className="h-1 rounded-full bg-neutral-100 dark:bg-white/5 overflow-hidden">
                        <motion.div initial={{ width: 0 }} whileInView={{ width: `${Math.min(100, parseInt(value) * 1.5)}%` }} viewport={{ once: true }} className={`h-full ${color}`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen pt-15 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">

      {/* ── CSS Injection to Hide Scrollbar ── */}
      <style jsx global>{`
        ::-webkit-scrollbar {
          display: none !important;
        }
        body {
          -ms-overflow-style: none; /* IE and Edge */
          scrollbar-width: none; /* Firefox */
        }
        * {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        *::-webkit-scrollbar {
          display: none;
        }
      `}</style>

      {/* ── Gradient Blobs (Static Backdrop) ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <motion.button
          initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
          onClick={() => router.back()}
          className="group mb-8 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 hover:text-indigo-600 transition-colors"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Menu Catalogue
        </motion.button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">

          {/* Main Visual Media */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-white/80 dark:border-white/10 shadow-xl shadow-indigo-600/5 group"
            >
              <Image src={product.image} alt={product.name} fill className="object-cover" priority />

              <div className="absolute top-5 left-5 flex flex-col gap-2">
                {product.discountPercent && (
                  <span className="px-3 py-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-widest border border-white/20">
                    {product.discountPercent}% OFF
                  </span>
                )}
                {product.isHot && (
                  <span className="px-3 py-1.5 rounded-xl bg-orange-500/90 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-widest border border-white/20">
                    Popular
                  </span>
                )}
              </div>

              <div className="absolute top-5 right-5">
                <button onClick={handleShare} className="w-10 h-10 rounded-xl bg-white/60 dark:bg-black/40 backdrop-blur-2xl border border-white/40 dark:border-white/10 text-neutral-900 dark:text-white flex items-center justify-center shadow-lg transition-all hover:scale-110">
                  <AnimatePresence mode="wait">
                    {copied
                      ? <Check size={16} key="c" strokeWidth={3} className="text-emerald-500" />
                      : <Share2 size={16} key="s" strokeWidth={2.5} />
                    }
                  </AnimatePresence>
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { icon: Clock, label: "Cook", val: product.prepTime, color: "text-sky-500" },
                { icon: Flame, label: "Energy", val: product.calories, color: "text-orange-500" },
                { icon: Utensils, label: "Portion", val: product.weight, color: "text-emerald-500" }
              ].filter(i => i.val).map(({ icon: Icon, label, val, color }) => (
                <div key={label} className="py-2 rounded-3xl bg-white/45 dark:bg-neutral-900/40 backdrop-blur-2xl border border-white/65 dark:border-white/10 shadow-sm text-center">
                  <Icon size={14} className={`mx-auto mb-1.5 ${color}`} />
                  <p className="text-[8px] uppercase font-black text-neutral-400 mb-0.5 tracking-widest">{label}</p>
                  <p className="text-xs font-black text-neutral-900 dark:text-white">{val}</p>
                </div>
              ))}
            </div>

            {renderTabsComponent(true)}
          </div>

          {/* Configuration & Actions */}
          <div className="flex flex-col space-y-8">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
              <div className="flex items-center justify-between mb-4">
                <span className="px-4 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[9px] font-black uppercase tracking-[0.2em]">
                  {product.category}
                </span>
                <div className="flex items-center gap-1.5 bg-white/45 dark:bg-black/20 backdrop-blur-md px-3 py-1 rounded-xl border border-white/60">
                  <Star size={12} className="text-yellow-500" fill="#EAB308" />
                  <span className="text-xs font-black dark:text-white">{product.rating}</span>
                </div>
              </div>

              <h1 className="text-2xl lg:text-4xl font-black text-neutral-900 dark:text-white mb-6 leading-[1.1] tracking-tighter">
                {product.name}
              </h1>

              <div className="flex flex-wrap items-baseline gap-4 mb-8">
                <span className="text-xl font-black text-neutral-900 dark:text-white tracking-tighter">
                  <span className="text-xl font-bold mr-0.5 text-indigo-500">$</span>{product.price.toFixed(2)}
                </span>
                {product.oldPrice && (
                  <span className="text-md text-rose-400/50 line-through font-black">${product.oldPrice.toFixed(2)}</span>
                )}
              </div>

              <div className="space-y-5 sticky top-28">
                <div className="flex items-center gap-4">
                  <QtyBlock quantity={quantity} atMin={quantity <= 1} atMax={quantity >= product.stock} onMinus={() => changeQty(-1)} onPlus={() => changeQty(+1)} onInput={setQtyDirect} stock={product.stock} />
                  <div className="flex-1 text-right">
                    <span className="block text-[8px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">Estimated Total</span>
                    <span className="text-xl font-black text-neutral-900 dark:text-white">${totalPrice}</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button onClick={handleCart} className={`h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${isInCart ? "bg-emerald-500 text-white shadow-emerald-500/20" : "bg-neutral-900 dark:bg-white text-white dark:text-black hover:scale-[1.02] active:scale-95"}`}>
                    <AnimatePresence mode="wait">
                      {isInCart
                        ? <motion.span key="a" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3"><Check size={16} strokeWidth={3} />Added</motion.span>
                        : <motion.span key="b" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-3"><ShoppingCart size={16} />Add to Cart</motion.span>
                      }
                    </AnimatePresence>
                  </button>
                  <button onClick={() => toggleWishlist(product)} className={`h-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 border ${isWishlisted ? "bg-rose-500 text-white border-rose-500 shadow-xl shadow-rose-500/20" : "bg-white/45 dark:bg-white/5 border-white dark:border-white/10 dark:text-white shadow-sm"}`}>
                    <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
                    {isWishlisted ? "Added" : "Add to Wishlist"}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-y-3 pt-6 border-t border-neutral-100 dark:border-white/5">
                  {[
                    { icon: Truck, label: "Express Log", color: "text-amber-500" },
                    { icon: ShieldCheck, label: "Encrypted", color: "text-emerald-500" },
                    { icon: Leaf, label: "Curated", color: "text-sky-500" },
                    { icon: RotateCcw, label: "Guaranteed", color: "text-rose-500" },
                  ].map(({ icon: Icon, label, color }) => (
                    <div key={label} className="flex items-center gap-2.5">
                      <Icon size={14} className={color} />
                      <span className="text-[9px] font-black uppercase tracking-widest text-neutral-500">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-10 p-5 rounded-3xl bg-white/45 dark:bg-black/20 backdrop-blur-2xl border border-white/80 dark:border-white/5 shadow-sm">
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed font-bold tracking-tight italic">
                  {product.fullDescription || product.description}
                </p>
              </div>
            </motion.div>

            {renderTabsComponent(false)}
          </div>
        </div>
      </main>

      {/* Mobile Bar */}
      <div className="sm:hidden w-full fixed bottom-15 z-50 p-2 bg-neutral-900/95 transition-all duration-300">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white/10 p-1 rounded-full border border-white/5">
            <button onClick={() => changeQty(-1)} disabled={quantity <= 1} className="w-10 h-10 flex items-center justify-center text-white/50 disabled:opacity-20 active:scale-90 transition-all">
              <Minus size={14} />
            </button>
            <span className="w-6 text-center text-xs font-black text-white">{quantity}</span>
            <button onClick={() => changeQty(1)} disabled={quantity >= product.stock} className="w-10 h-10 flex items-center justify-center text-white/50 disabled:opacity-20 active:scale-90 transition-all">
              <Plus size={14} />
            </button>
          </div>
          
          <button onClick={handleCart} className={`flex-1 h-12 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${isInCart ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" : "bg-white text-black"}`}>
            {isInCart ? <><Check size={14} /> Added</> : <><ShoppingCart size={14} /> Add ($${totalPrice})</>}
          </button>

          <button onClick={() => toggleWishlist(product)} className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isWishlisted ? "bg-rose-500 shadow-lg shadow-rose-500/20" : "bg-white/10"}`}>
            <Heart size={16} fill={isWishlisted ? "currentColor" : "none"} className={isWishlisted ? "text-white" : "text-white/40"} />
          </button>
        </div>
      </div>

    </div>
  );
}
