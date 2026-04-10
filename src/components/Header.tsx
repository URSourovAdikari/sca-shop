"use client";

import Link from "next/link";
import { useState, useEffect, useCallback, useRef } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Menu, Sun, Moon, ChevronDown, User, LogOut,
  Package, LayoutDashboard, Home, Phone, ShoppingCart, Heart, Store,
  Search as SearchIcon, Utensils
} from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import { useAuth } from "@/components/AuthProvider";
import { useCart } from "@/components/CartProvider";


// ─── Data ─────────────────────────────────────────────────────────────────────

// Custom Brand Icons
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
)
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
)

const mobileOnlyAuthLinks = [
  { title: "Sign in", href: "/login" },
  { title: "Sign up", href: "/signup" },
];

const socialLinks = [
  {
    icon: FacebookIcon,
    href: "https://facebook.com",
    label: "Facebook",
    hoverColor: "hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-300 dark:hover:border-blue-600 hover:bg-blue-50 dark:hover:bg-blue-500/10",
  },
  {
    icon: InstagramIcon,
    href: "https://instagram.com",
    label: "Instagram",
    hoverColor: "hover:text-pink-600 dark:hover:text-pink-400 hover:border-pink-300 dark:hover:border-pink-600 hover:bg-pink-50 dark:hover:bg-pink-500/10",
  },
];

// ─── Logo ─────────────────────────────────────────────────────────────────────

const SCALogo = () => (
  <Link href="/" className="flex items-center gap-2.5 select-none group">
    <span className="relative w-8 h-8 sm:w-9 sm:h-9 flex-shrink-0">
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 shadow-md shadow-indigo-500/30 group-hover:scale-105 transition-all duration-300" />
      <span className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 via-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-40 blur-md transition-all duration-300" />
      <span className="absolute inset-0 flex items-center justify-center text-white">
        <Utensils size={16} className="sm:size-[18px]" />
      </span>
    </span>
    <span className="text-sm sm:text-base font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-fuchsia-500 bg-clip-text text-transparent">
      SCA Shop
    </span>
  </Link>
);

// ─── Theme Toggle ─────────────────────────────────────────────────────────────

export const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="w-9 h-9" />;

  return (
    <motion.button
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.93 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className="relative p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200 overflow-hidden group"
    >
      <AnimatePresence mode="wait" initial={false}>
        {theme === "dark" ? (
          <motion.span key="sun" initial={{ rotate: -90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: 90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.22 }} className="flex">
            <Sun size={17} />
          </motion.span>
        ) : (
          <motion.span key="moon" initial={{ rotate: 90, opacity: 0, scale: 0.6 }} animate={{ rotate: 0, opacity: 1, scale: 1 }} exit={{ rotate: -90, opacity: 0, scale: 0.6 }} transition={{ duration: 0.22 }} className="flex">
            <Moon size={17} />
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

// ─── Hamburger / Close Button ─────────────────────────────────────────────────

const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => (
  <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} onClick={onClick} aria-label={isOpen ? "Close menu" : "Open menu"} className="lg:hidden relative p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200">
    <AnimatePresence mode="wait" initial={false}>
      {isOpen ? (
        <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex"><X size={18} /></motion.span>
      ) : (
        <motion.span key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }} className="flex"><Menu size={18} /></motion.span>
      )}
    </AnimatePresence>
  </motion.button>
);

// ─── Header ───────────────────────────────────────────────────────────────────

const Header = ({ className = "" }: { className?: string }) => {
  const pathname = usePathname();
  const { session, isAuthenticated } = useAuth();
  const { cartCount } = useCart();


  const [mounted, setMounted] = useState(false);
  const [sticky, setSticky] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const userMenuRef = useRef<HTMLDivElement>(null);
  const userMenuBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => setMounted(true), []);

  const isAuthPage = ['/login', '/signin', '/signup', '/forgot-password', '/verify', '/new-password'].includes(pathname);

  // ── Scroll detection
  const handleScroll = useCallback(() => setSticky(window.scrollY >= 50), []);
  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // ── Body scroll lock
  useEffect(() => {
    document.documentElement.style.overflow = (isOpen || searchOpen) ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [isOpen, searchOpen]);

  // ── Route change reset
  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  // ── Click outside user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuOpen && userMenuRef.current && !userMenuRef.current.contains(event.target as Node) && !userMenuBtnRef.current?.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [userMenuOpen]);

  if (!mounted || isAuthPage) return null;

  // ── Navigation Arrays
  const navLinks = [
    { title: "Home", href: "/", icon: Home },
    { title: "Shop", href: "/shop", icon: Store },
    { title: "Contact", href: "/contact", icon: Phone },
  ];

  const mobileSidebarLinks = [
    { title: "Shop", href: "/shop", icon: Store },
    ...(isAuthenticated ? [{ title: "My Orders", href: "/orders", icon: Package }] : []),
    { title: "Contact", href: "/contact", icon: Phone },
  ];

  const mobileTabLinks = [
    { title: "Home", href: "/", icon: Home },
    { title: "Shop", href: "/shop", icon: Store },
    { title: "Search", isAction: true, action: () => setSearchOpen(true), icon: SearchIcon },
    { title: "Profile", href: isAuthenticated ? "/profile" : "/login", icon: User },
  ];

  const avatarFallback = session?.user?.name?.charAt(0).toUpperCase() ?? 'U';

  const UserMenuDropdown = () => (
    <motion.div
      ref={userMenuRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 top-full mt-2 w-52 bg-white dark:bg-neutral-900 shadow-xl shadow-neutral-200/50 dark:shadow-black/40 rounded-2xl p-2 border border-neutral-200 dark:border-neutral-800 z-50 overflow-hidden ring-1 ring-white/10"
    >
      <Link href="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors">
        <User size={16} /> Profile
      </Link>
      <Link href="/dashboard" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors">
        <LayoutDashboard size={16} /> Dashboard
      </Link>
      <Link href="/orders" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-neutral-100 dark:hover:bg-white/5 rounded-xl transition-colors">
        <Package size={16} /> My Orders
      </Link>
      <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-2 mx-2" />
      <button
        onClick={() => { setUserMenuOpen(false); signOut(); }}
        className="w-full flex items-center gap-3 text-left px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <LogOut size={16} /> Log Out
      </button>
    </motion.div>
  );

  return (
    <>
      {/* ── Search Modal ── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl p-4 lg:p-8"
          >

            <div className="pointer-events-none fixed inset-0 overflow-hidden -z-0">
              <div className="absolute -top-40 -left-40 w-[700px] h-[700px] rounded-full opacity-40 dark:opacity-50 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.72 0.18 280), transparent 75%)", filter: "blur(60px)" }} />
              <div className="absolute top-1/3 -right-60 w-[600px] h-[600px] rounded-full opacity-30 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.75 0.15 200), transparent 75%)", filter: "blur(80px)" }} />
              <div className="absolute bottom-0 left-1/3 w-[500px] h-[500px] rounded-full opacity-25 dark:opacity-40 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.78 0.12 340), transparent 75%)", filter: "blur(70px)" }} />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20 dark:opacity-35 mix-blend-multiply dark:mix-blend-screen" style={{ background: "radial-gradient(circle, oklch(0.80 0.10 60), transparent 75%)", filter: "blur(50px)" }} />
            </div>

            {/* Header / Dismiss */}
            <div className="flex items-center justify-between mx-auto w-full max-w-4xl py-4 pt-10 sm:pt-4">
              <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Search Shop</span>
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(false)}
                className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-all shadow-sm"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Content Body */}
            <div className="flex flex-col items-center flex-1 justify-center mx-auto w-full max-w-2xl px-4 pb-32">
              <div className="relative w-full">
                <SearchIcon size={28} className="absolute left-6 top-1/2 -translate-y-1/2 text-neutral-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder="What are you craving?"
                  className="w-full pl-16 pr-6 py-3 text-md sm:text-xl font-black bg-white dark:bg-neutral-900 rounded-[2rem] border-2 border-neutral-200 dark:border-neutral-800 focus:border-indigo-500 dark:focus:border-indigo-500 outline-none shadow-2xl shadow-neutral-200/50 dark:shadow-black/50 text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-neutral-700 transition-all"
                />
              </div>
              <p className="mt-8 text-neutral-500 text-sm font-medium text-center">
                Try searching for "Spicy Burger", "Pizza", or "Salad"
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Desktop / Top Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -32 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`fixed top-0 inset-x-0 z-[60] px-4 h-16 flex items-center justify-center ${className}`}
      >
        <div className={`w-full max-w-6xl mx-auto flex items-center justify-between transition-all duration-500
            ${sticky ? "px-3 py-2 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-xl rounded-full shadow-lg shadow-neutral-200/60 dark:shadow-neutral-900/60 border border-neutral-200/60 dark:border-neutral-800/60" : ""}`}
        >
          <SCALogo />

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main navigation">
            {navLinks.map((item) => {
              const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className={`relative px-3.5 py-2 text-sm font-medium rounded-lg transition-all duration-200 group ${isActive ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/5"}`}
                >
                  {item.title}
                  {isActive && <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-500 dark:bg-indigo-400" />}
                </Link>
              );
            })}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              {/* Desktop Search Button */}
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.93 }}
                onClick={() => setSearchOpen(true)}
                className="hidden sm:flex p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200"
              >
                <SearchIcon size={17} />
              </motion.button>

              <ThemeToggle />

              {/* Wishlist */}
              <Link href="/wishlist">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} className="flex p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 hover:border-rose-300 dark:hover:border-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors duration-200">
                  <Heart size={17} />
                </motion.button>
              </Link>

              {/* Cart */}
              <Link href="/cart">
                <motion.button whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.93 }} className="relative flex p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200">
                  <ShoppingCart size={17} />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-black text-white shadow-sm ring-2 ring-white dark:ring-neutral-900">
                      {cartCount}
                    </span>
                  )}
                </motion.button>
              </Link>

            </div>

            {/* User Auth Info (Desktop) */}
            <div className="hidden lg:flex items-center">
              {isAuthenticated ? (
                <div className="relative">
                  <button
                    ref={userMenuBtnRef}
                    onClick={() => setUserMenuOpen((prev) => !prev)}
                    className="flex items-center gap-2.5 px-2 pr-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 transition-colors duration-200 group ml-2"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                      {avatarFallback}
                    </div>
                    <span className="text-sm font-medium max-w-[100px] truncate text-neutral-700 dark:text-neutral-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {session?.user?.name?.split(" ")[0]}
                    </span>
                    <ChevronDown size={14} className={`text-neutral-400 transition-transform duration-300 ${userMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {userMenuOpen && <UserMenuDropdown />}
                  </AnimatePresence>
                </div>
              ) : (
                <div className="flex items-center gap-2 ml-2">
                  <Link href="/login" className="px-4 py-2 text-sm font-medium text-neutral-600 dark:text-neutral-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">Log In</Link>
                  <Link href="/signup">
                    <button className="px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-sm font-semibold hover:bg-indigo-600 dark:hover:bg-indigo-500 transition-colors shadow-md hover:shadow-lg">
                      Sign Up
                    </button>
                  </Link>
                </div>
              )}
            </div>

            <MenuButton isOpen={isOpen} onClick={() => setIsOpen((v) => !v)} />
          </div>
        </div>
      </motion.header>

      {/* ── Mobile Drawer ── */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.28 }}
              className="fixed inset-0 bg-black/35 backdrop-blur-[3px] z-[70] lg:hidden"
              onClick={() => setIsOpen(false)} aria-hidden="true"
            />

            <motion.div
              key="drawer"
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }} transition={{ type: "spring", stiffness: 340, damping: 34 }}
              className="fixed right-0 top-0 bottom-0 w-[320px] max-w-[85vw] z-[70] flex flex-col lg:hidden"
              aria-label="Mobile navigation drawer" role="dialog" aria-modal="true"
            >
              <div className="absolute inset-0 bg-white dark:bg-neutral-900 rounded-l-2xl overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 rounded-full bg-gradient-to-br from-indigo-400/30 via-violet-400/20 to-fuchsia-400/10 dark:from-indigo-500/35 dark:via-violet-500/25 dark:to-fuchsia-500/15 blur-3xl pointer-events-none" />
                <div className="absolute -bottom-16 -left-10 w-52 h-52 rounded-full bg-gradient-to-tr from-sky-400/15 via-indigo-400/10 to-transparent dark:from-sky-500/20 dark:via-indigo-500/15 dark:to-transparent blur-2xl pointer-events-none" />
              </div>
              <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-transparent via-neutral-200 dark:via-neutral-700/50 to-transparent" />

              <div className="relative flex flex-col h-full overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-neutral-200 dark:scrollbar-thumb-neutral-700">
                <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-3 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm border-b border-neutral-100 dark:border-neutral-800/60">
                  <SCALogo />
                  <motion.button whileHover={{ scale: 1.08, rotate: 90 }} whileTap={{ scale: 0.93 }} onClick={() => setIsOpen(false)} aria-label="Close menu" transition={{ duration: 0.2 }} className="p-2 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:text-red-500 dark:hover:text-red-400 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors duration-200">
                    <X size={17} />
                  </motion.button>
                </div>

                {isAuthenticated && (
                  <div className="px-6 py-5 border-b border-neutral-100 dark:border-neutral-800/60 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-fuchsia-500 text-white flex items-center justify-center font-bold text-lg shadow-md flex-shrink-0">
                      {avatarFallback}
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-base font-bold text-neutral-900 dark:text-white truncate">{session?.user?.name}</span>
                      <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{session?.user?.email}</span>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1 px-4 pt-4" aria-label="Mobile navigation">
                  {mobileSidebarLinks.map((item, i) => {
                    const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
                    return (
                      <motion.div key={item.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + i * 0.06, duration: 0.3, ease: "easeOut" }}>
                        <Link href={item.href} onClick={() => setIsOpen(false)} className={`flex items-center justify-between px-4 py-3.5 rounded-xl text-[15px] font-semibold transition-all duration-200 group ${isActive ? "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/12" : "text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100/80 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white hover:pl-5"}`}>
                          {item.title}
                          {isActive ? <span className="w-2 h-2 rounded-full bg-indigo-500 dark:bg-indigo-400" /> : <span className="opacity-0 group-hover:opacity-40 transition-opacity duration-200 text-neutral-400">→</span>}
                        </Link>
                      </motion.div>
                    );
                  })}

                  {!isAuthenticated && (
                    <>
                      <div className="mx-4 my-2 h-px bg-gradient-to-r from-transparent via-neutral-200 dark:via-neutral-700/60 to-transparent" />
                      <div className="flex flex-col gap-2 px-2 mt-2">
                        {mobileOnlyAuthLinks.map((item, i) => (
                          <motion.div key={item.title} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 + (mobileSidebarLinks.length + i) * 0.06, duration: 0.3, ease: "easeOut" }}>
                            <Link href={item.href} onClick={() => setIsOpen(false)} className="w-full block">
                              <button className={`w-full py-3 rounded-xl font-bold transition-all shadow-sm ${item.title === "Sign up" ? "bg-indigo-600 text-white hover:bg-indigo-700" : "bg-white dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-700"}`}>
                                {item.title}
                              </button>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </>
                  )}
                </nav>

                <div className="flex-1 min-h-[40px]" />

                <div className="px-6 pb-2">
                  <p className="text-[11px] font-semibold tracking-widest uppercase text-neutral-400 dark:text-neutral-600 mb-3 px-1">Follow us</p>
                  <div className="flex gap-2.5">
                    {socialLinks.map(({ icon: Icon, href, label, hoverColor }, i) => (
                      <motion.a key={i} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 + i * 0.08 }} whileHover={{ scale: 1.12, y: -2 }} whileTap={{ scale: 0.93 }} className={`p-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 transition-all duration-200 ${hoverColor}`}>
                        <Icon size={16} />
                      </motion.a>
                    ))}
                  </div>
                </div>

                <div className="px-6 py-5 mt-4 border-t border-neutral-100 dark:border-neutral-800/60">
                  <p className="text-xs text-neutral-400 dark:text-neutral-600">© {new Date().getFullYear()} SCA Shop</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ── Mobile Bottom Tab Bar ── */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-[60] bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border-t border-neutral-200 dark:border-neutral-800 pb-[env(safe-area-inset-bottom)]">
        <div className="flex items-center justify-around h-16 px-2">
          {mobileTabLinks.map((item) => {
            const isActive = !item.isAction && (pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href!)));
            const Icon = item.icon;

            const content = (
              <div className={`relative flex flex-col items-center justify-center w-full h-full gap-0.5 transition-colors ${isActive ? "text-indigo-600 dark:text-indigo-400" : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white"}`}>
                <div className={`relative flex items-center justify-center transition-all ${isActive ? '-translate-y-1' : ''}`}>
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] sm:text-xs font-medium transition-all ${isActive ? "font-bold translate-y-0.5" : ""}`}>
                  {item.title}
                </span>
                {isActive && (
                  <motion.div layoutId="mobileTabIndicator" className="absolute top-0 w-8 h-1 rounded-b-full bg-indigo-600 dark:bg-indigo-400" transition={{ type: "spring", stiffness: 500, damping: 30 }} />
                )}
              </div>
            );

            if (item.isAction && item.action) {
              return (
                <button key={item.title} onClick={item.action} className="w-full h-full">
                  {content}
                </button>
              );
            }

            return (
              <Link key={item.title} href={item.href!} className="w-full h-full">
                {content}
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Header;
