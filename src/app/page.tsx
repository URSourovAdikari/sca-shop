'use client'

import { Suspense } from "react"
import { motion } from "framer-motion"
import ImageSlider from "@/components/Slider"
import Products from "@/components/Products"
import Footer from "@/components/Footer"
import Link from "next/link"
import { Truck, CheckCircle, Utensils, Star } from "lucide-react"

export default function Home() {
  return (
    <>
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/20">

      {/* HERO SLIDER */}
      <ImageSlider />

      {/* PRODUCTS SECTION */}
      <Suspense fallback={<div className="h-96 flex items-center justify-center text-neutral-500 font-bold">Loading Menu...</div>}>
        <Products featuredOnly={true} />
        {/* View All CTA */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="mb-5 text-center"
              >
                <Link href="/shop">
                  <button className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-3xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black overflow-hidden transition-all hover:scale-105 hover:-translate-y-1 shadow-lg shadow-neutral-900/20 dark:shadow-white/10">
                    <span className="relative z-10 flex items-center gap-2.5">
                      Explore Full Menu
                      <Utensils size={16} />
                    </span>
                    <div className="absolute inset-0 bg-indigo-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                  </button>
                </Link>
              </motion.div>
      </Suspense>

      {/* STATS SECTION */}
      <section className="py-20 bg-gradient-to-b from-neutral-50 via-white to-neutral-50 dark:from-neutral-950 dark:via-neutral-900/50 dark:to-neutral-950 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-indigo-300/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {[
              { label: 'Happy Customers', value: '50k+', icon: <Utensils size={32} />, color: 'indigo' },
              { label: 'Expert Chefs', value: '45+', icon: <CheckCircle size={32} />, color: 'blue' },
              { label: 'Quick Deliveries', value: '150k+', icon: <Truck size={32} />, color: 'emerald' },
              { label: 'Top Ratings', value: '4.9/5', icon: <Star size={32} />, color: 'amber' },
            ].map((stat, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="group bg-white dark:bg-neutral-900/80 rounded-[2.5rem] p-6 md:p-8 shadow-md hover:shadow-2xl border border-neutral-200 dark:border-neutral-700 text-center transition-all duration-300 hover:scale-105 hover:-translate-y-2 backdrop-blur-sm"
              >
                <div className={`w-16 h-16 mx-auto rounded-2xl bg-${stat.color}-50 dark:bg-${stat.color}-500/15 flex items-center justify-center text-${stat.color}-600 dark:text-${stat.color}-400 mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  {stat.icon}
                </div>
                <h3 className="text-3xl md:text-4xl font-black text-neutral-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-xs md:text-sm font-semibold text-neutral-600 dark:text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24 bg-gradient-to-b from-white via-neutral-50/50 to-white dark:from-neutral-950 dark:via-neutral-900/30 dark:to-neutral-950 relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 -left-40 w-96 h-96 bg-blue-300/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-pink-300/10 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto mb-20 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white mb-6">Why SCA Shop?</h2>
              <p className="text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed font-medium">
                We bring the best flavors from across the city right to your dining table with speed and care.
              </p>
            </motion.div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
            {[
              { title: "Gourmet Quality", desc: "Our chefs use only the freshest, high-quality ingredients for every dish.", color: 'indigo' },
              { title: "Ultra Fast Delivery", desc: "Hot food delivered in under 30 minutes, or it's on us.", color: 'emerald' },
              { title: "Modern Ordering", desc: "Easy to use app and website for a seamless food ordering experience.", color: 'blue' },
              { title: "Safe Packaging", desc: "Eco-friendly, spill-proof packaging that keeps your food fresh and hot.", color: 'amber' },
              { title: "Exclusive Offers", desc: "Get amazing discounts and loyalty points on every single order.", color: 'pink' },
              { title: "24/7 Support", desc: "Our customer happiness team is always here to help you.", color: 'purple' },
            ].map((service, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                viewport={{ once: true }}
                className={`group p-8 md:p-10 rounded-[2.5rem] bg-white dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:-translate-y-2 backdrop-blur-sm`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-${service.color}-50 dark:bg-${service.color}-500/15 flex items-center justify-center mb-8 text-${service.color}-600 dark:text-${service.color}-400 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300`}>
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-neutral-700 dark:text-neutral-400 leading-relaxed font-medium">{service.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 bg-gradient-to-b from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-950 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="relative overflow-hidden bg-gradient-to-br from-neutral-900 via-neutral-800 to-black dark:from-white dark:via-neutral-100 dark:to-neutral-200 rounded-[3.5rem] p-12 lg:p-24 text-center shadow-2xl">
            {/* Background glow - Enhanced */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/30 blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/30 blur-[100px] pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-black/5 dark:via-white/5 to-transparent pointer-events-none" />
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="relative z-20"
            >
              <h2 className="text-4xl lg:text-6xl font-black text-white dark:text-neutral-900 mb-8 leading-tight">
                Ready to Taste the <br /> Excellence?
              </h2>
              <p className="text-lg md:text-xl text-neutral-300 dark:text-neutral-700 mb-12 max-w-2xl mx-auto font-semibold">
                Join thousands of food lovers who enjoy our premium menu every day. Get started now.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Link href="/menu">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-16 px-12 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 text-white font-black text-lg shadow-2xl shadow-indigo-600/40 transition-all duration-300"
                  >
                    Browse Menu
                  </motion.button>
                </Link>

                <Link href="/signup">
                  <motion.button 
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    className="h-16 px-12 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-black text-lg border-2 border-white dark:border-neutral-800 hover:shadow-xl dark:hover:shadow-neutral-950/50 transition-all duration-300"
                  >
                    Join as Member
                  </motion.button>
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </>
  )
}
