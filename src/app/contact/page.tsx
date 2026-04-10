"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Mail, Phone, MapPin, Send, MessageSquare, 
  Clock, Globe, CheckCircle2, Loader2, ArrowRight
} from "lucide-react";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-x-hidden bg-[oklch(0.97_0.01_260)] dark:bg-neutral-950 transition-colors duration-500">
      
      {/* ── Gradient Blobs ── */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
        <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
        <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-black uppercase tracking-[0.2em] mb-6"
          >
            <Globe size={12} /> Reach Out
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl sm:text-6xl font-black text-neutral-900 dark:text-white mb-6 tracking-tighter leading-[1.1]"
          >
            Let&apos;s Start a <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-fuchsia-500">Conversation.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-neutral-500 dark:text-neutral-400 font-bold max-w-2xl mx-auto leading-relaxed text-sm sm:text-base px-4"
          >
            Have a question, a craving, or just want to say hi? We&apos;re here for you. 
            Expect a response within 24 hours from our world-class support team.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Information Cards */}
          <div className="lg:col-span-4 space-y-4">
            {[
              { 
                icon: Mail, 
                title: "Email Us", 
                detail: "support@scashop.com", 
                sub: "Always available for you",
                color: "text-sky-500",
                bg: "bg-sky-500/10"
              },
              { 
                icon: Phone, 
                title: "Call Directly", 
                detail: "+1 (555) 123-4567", 
                sub: "Mon-Fri, 9am - 6pm EST",
                color: "text-emerald-500",
                bg: "bg-emerald-500/10"
              },
              { 
                icon: MapPin, 
                title: "Visit Headquarters", 
                detail: "123 Flavor Street, Tech City", 
                sub: "United States, NY 10001",
                color: "text-rose-500",
                bg: "bg-rose-500/10"
              },
              { 
                icon: Clock, 
                title: "Operating Hours", 
                detail: "24/7 Digital Shop", 
                sub: "Support active in business hours",
                color: "text-amber-500",
                bg: "bg-amber-500/10"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="p-6 rounded-[2.5rem] bg-white/45 dark:bg-neutral-900/40 backdrop-blur-2xl border border-white/65 dark:border-white/10 shadow-sm group hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${item.bg} flex items-center justify-center ${item.color} shadow-sm group-hover:rotate-12 transition-transform duration-300`}>
                    <item.icon size={20} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-0.5">{item.title}</p>
                    <p className="text-sm font-black text-neutral-900 dark:text-white truncate">{item.detail}</p>
                    <p className="text-[9px] font-bold text-neutral-500 truncate mt-0.5">{item.sub}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Contact Form Card */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="lg:col-span-8 p-8 sm:p-12 rounded-[3.5rem] bg-white/45 dark:bg-neutral-900/60 backdrop-blur-3xl border border-white/65 dark:border-white/10 shadow-2xl relative overflow-hidden group"
          >
            {/* Background Luminous Effect */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[100px] pointer-events-none group-hover:bg-indigo-500/10 transition-colors" />
            
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="relative z-10"
                >
                  <div className="flex items-center gap-3 mb-10">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 dark:bg-white flex items-center justify-center text-white dark:text-neutral-900 shadow-xl">
                      <MessageSquare size={18} />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-neutral-900 dark:text-white tracking-tight">Drop us a line</h2>
                      <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mt-1">We value your feedback</p>
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Your Identity</label>
                        <input 
                          type="text" 
                          required
                          placeholder="Full Name" 
                          className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-black/10 border border-white dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-bold text-sm text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 shadow-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Email Address</label>
                        <input 
                          type="email" 
                          required
                          placeholder="name@example.com" 
                          className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-black/10 border border-white dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-bold text-sm text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 shadow-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Topic</label>
                      <select className="w-full px-6 py-4 rounded-2xl bg-white/50 dark:bg-black/10 border border-white dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-bold text-sm text-neutral-900 dark:text-white shadow-sm appearance-none cursor-pointer">
                        <option>General Inquiry</option>
                        <option>Order Support</option>
                        <option>Feedback & Suggestions</option>
                        <option>Business Collaboration</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest px-1">Message Body</label>
                      <textarea 
                        required
                        rows={5} 
                        placeholder="Tell us what's on your mind..." 
                        className="w-full px-6 py-5 rounded-[2rem] bg-white/50 dark:bg-black/10 border border-white dark:border-white/5 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none transition-all font-bold text-sm text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 shadow-sm resize-none"
                      />
                    </div>

                    <button 
                      type="submit" 
                      disabled={isSubmitting}
                      className="w-full group relative inline-flex items-center justify-center gap-3 px-8 py-5 rounded-[2rem] bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black overflow-hidden transition-all hover:scale-[1.01] active:scale-[0.98] shadow-2xl shadow-neutral-900/10 dark:shadow-white/5 text-xs sm:text-sm uppercase tracking-[0.2em]"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          <span>Dispatching...</span>
                        </>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={16} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                        </>
                      )}
                    </button>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 text-center"
                >
                  <div className="w-24 h-24 bg-emerald-500/10 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <CheckCircle2 size={48} />
                  </div>
                  <h2 className="text-3xl font-black text-neutral-900 dark:text-white mb-4 tracking-tight">Message Received.</h2>
                  <p className="text-neutral-500 dark:text-neutral-400 font-bold max-w-sm mx-auto leading-relaxed text-sm mb-10">
                    Thank you for reaching out! We&apos;ve sent a confirmation to your inbox. One of our specialists will get back to you shortly.
                  </p>
                  <button 
                    onClick={() => setSubmitted(false)}
                    className="inline-flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:gap-3 transition-all"
                  >
                    Send another message <ArrowRight size={14} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

        {/* FAQ Preview or Social Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-20 p-8 sm:p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-600/5 to-fuchsia-600/5 dark:from-indigo-600/10 dark:to-fuchsia-600/10 border border-white/65 dark:border-white/5 shadow-sm text-center"
        >
          <p className="text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-4">Social Presence</p>
          <h3 className="text-xl sm:text-2xl font-black text-neutral-900 dark:text-white mb-8 tracking-tight">Join our global food community.</h3>
          <div className="flex flex-wrap justify-center gap-4">
            {["Instagram", "Twitter", "Facebook", "LinkedIn"].map((platform) => (
              <button key={platform} className="px-6 py-3 rounded-2xl bg-white dark:bg-white/5 border border-neutral-100 dark:border-white/5 text-[10px] font-black uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-all shadow-sm">
                {platform}
              </button>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}