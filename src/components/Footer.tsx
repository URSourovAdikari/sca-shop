'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Utensils, Clock, MapPin, Pizza, Coffee, Phone, Mail, CheckCircle2, Star } from 'lucide-react'

// Custom Brand Icons as Lucide-react 1.x removed them
const FacebookIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
)
const InstagramIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" x2="17.51" y1="6.5" y2="6.5" /></svg>
)
const YoutubeIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.42a2.78 2.78 0 0 0-1.94 2C1 8.11 1 12 1 12s0 3.89.46 5.58a2.78 2.78 0 0 0 1.94 2c1.72.42 8.6.42 8.6.42s6.88 0 8.6-.42a2.78 2.78 0 0 0 1.94-2C23 15.89 23 12 23 12s0-3.89-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" /></svg>
)
const LinkedinIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" /><rect width="4" height="12" x="2" y="9" /><circle cx="4" cy="4" r="2" /></svg>
)

const socialLinks = [
  { icon: <FacebookIcon size={20} />, href: 'https://facebook.com', label: 'Facebook', brandBg: 'hover:!bg-[#1877F2] dark:hover:!bg-[#1877F2]' },
  { icon: <InstagramIcon size={20} />, href: 'https://instagram.com', label: 'Instagram', brandBg: 'hover:!bg-gradient-to-tr hover:!from-[#f09433] hover:!via-[#dc2743] hover:!to-[#bc1888] dark:hover:!bg-gradient-to-tr' },
  { icon: <YoutubeIcon size={20} />, href: 'https://youtube.com', label: 'YouTube', brandBg: 'hover:!bg-[#FF0000] dark:hover:!bg-[#FF0000]' },
  { icon: <LinkedinIcon size={20} />, href: 'https://linkedin.com', label: 'LinkedIn', brandBg: 'hover:!bg-[#0077B5] dark:hover:!bg-[#0077B5]' },
  { icon: <Mail size={20} />, href: 'mailto:support@scacourier.com', label: 'Email', brandBg: 'hover:!bg-[#6366f1] dark:hover:!bg-[#6366f1]' },
]

const menuLinks = [
  { label: 'Hot Pizza', href: '/menu/pizza' },
  { label: 'Juicy Burgers', href: '/menu/burgers' },
  { label: 'Crispy Chicken', href: '/menu/chicken' },
  { label: 'Fresh Salads', href: '/menu/salads' },
  { label: 'Cold Drinks', href: '/menu/drinks' },
]

const companyLinks = [
  { label: 'About Us', href: '/about' },
  { label: 'Track Shipment', href: '/track' },
  { label: 'Pricing', href: '/pricing' },
  { label: 'Contact', href: '/contact' },
  { label: 'Support Center', href: '/support' },
]

export default function Footer() {
  const [currentYear, setCurrentYear] = useState<number | null>(null)

  useEffect(() => {
    setCurrentYear(new Date().getFullYear())
  }, [])

  return (
    <footer className="relative pt-20 pb-10 overflow-hidden bg-gradient-to-br from-neutral-50 via-white to-indigo-50 dark:from-neutral-950 dark:via-neutral-950 dark:to-indigo-950/40 border-t border-white/40 dark:border-white/10">

      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-0 w-[500px] h-[500px] bg-indigo-400/20 blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-fuchsia-400/20 blur-[120px]" />
      </div>

      <div className="relative container mx-auto px-4">

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-14">

          {/* BRAND */}
          <div className="lg:col-span-4 space-y-6">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center text-white shadow-lg group-hover:scale-105 transition-transform duration-300">
                <Utensils size={24} />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                SCA Shop
              </span>
            </Link>

            <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed max-w-sm">
              SCA Shop serves the most delicious fast food in the city.
              Fresh ingredients, secret recipes, and super fast delivery.
            </p>

            {/* FEATURES */}
            <div className="flex flex-wrap gap-4 text-xs text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-500/5 border border-orange-500/10">
                <Star size={14} className="text-orange-500" /> Best Quality
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/5 border border-red-500/10">
                <Clock size={14} className="text-red-500" /> Fast Delivery
              </span>
              <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 size={14} className="text-emerald-500" /> Fresh Food
              </span>
            </div>

            <div className="flex gap-4 pt-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  whileHover={{ scale: 1.1, y: -4 }}
                  className={`w-10 h-10 rounded-full bg-white/60 dark:bg-white/5 border border-white/40 dark:border-white/10 backdrop-blur-xl flex items-center justify-center text-neutral-500 hover:text-white hover:border-transparent hover:shadow-xl transition-all duration-300 ${social.brandBg}`}
                >
                  {social.icon}
                </motion.a>
              ))}
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Our Menu</h3>
            <div className="grid grid-cols-2 gap-4">
              <nav className="flex flex-col space-y-3 text-sm">
                {menuLinks.map((link) => (
                  <Link key={link.label} href={link.href} className="text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition-all hover:translate-x-1 flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full bg-neutral-300 dark:bg-neutral-700" />
                    {link.label}
                  </Link>
                ))}
              </nav>
              <nav className="flex flex-col space-y-3 text-sm">
                {companyLinks.slice(0, 5).map((link) => (
                  <Link key={link.label} href={link.href} className="text-neutral-600 dark:text-neutral-400 hover:text-orange-500 transition-all hover:translate-x-1">
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Location & Hours</h3>
            
            <div className="flex flex-col space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-xl bg-white/40 dark:bg-white/[0.03] border border-white/40 dark:border-white/10 backdrop-blur-sm">
                <MapPin size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-semibold text-neutral-800 dark:text-white">SCA Food Plaza</p>
                  <p className="text-neutral-500 dark:text-neutral-400">123 Street Ave, Shop #45, Dhaka, Bangladesh</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-xl bg-orange-500/5 border border-orange-500/10">
                <Clock size={18} className="text-orange-500 mt-1 flex-shrink-0" />
                <div className="text-sm space-y-1">
                  <p className="font-semibold text-neutral-800 dark:text-white">Opening Hours</p>
                  <div className="flex justify-between gap-4 text-neutral-500 dark:text-neutral-400">
                    <span>Mon - Friday:</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">10:00 AM - 11:00 PM</span>
                  </div>
                  <div className="flex justify-between gap-4 text-neutral-500 dark:text-neutral-400">
                    <span>Sat - Sunday:</span>
                    <span className="font-medium text-neutral-700 dark:text-neutral-300">09:00 AM - 12:00 AM</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 text-white shadow-lg hover:shadow-orange-500/20 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase opacity-80 leading-none mb-1">Call for Delivery</p>
                  <p className="text-sm font-bold">+880 1234-567890</p>
                </div>
              </div>
              <Link href="tel:+8801234567890" className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-all">
                <Phone size={14} className="fill-current" />
              </Link>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-neutral-300/40 to-transparent dark:via-white/10 my-10" />

        {/* LEGAL */}
        <div className="mb-8 p-6 rounded-2xl bg-white/60 dark:bg-white/[0.04] border border-white/40 dark:border-white/10 backdrop-blur-xl text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            All shipments are handled under strict logistics policies.
            <Link href="/terms" className="text-indigo-500 hover:underline ml-1 font-medium">
              Read Terms & Conditions
            </Link>
          </p>
        </div>

        {/* BOTTOM */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-neutral-500 dark:text-neutral-400">
          <p>© {currentYear ?? ''} <strong>SCA Shop</strong>. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/privacy" className="hover:text-indigo-500">Privacy</Link>
            <Link href="/terms" className="hover:text-indigo-500">Terms</Link>
            <Link href="/cookies" className="hover:text-indigo-500">Cookies</Link>
          </div>
        </div>

      </div>
    </footer>
  )
}