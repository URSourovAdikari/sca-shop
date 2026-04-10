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
                  <button className="group relative px-8 py-4 sm:px-10 sm:py-5 rounded-2xl sm:rounded-3xl bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 font-black overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-neutral-900/10 dark:shadow-white/5 text-sm sm:text-base">
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
      <section className="py-20 bg-neutral-50 dark:bg-white/2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: 'Happy Customers', value: '50k+', icon: <Utensils size={32} /> },
              { label: 'Expert Chefs', value: '45+', icon: <CheckCircle size={32} /> },
              { label: 'Quick Deliveries', value: '150k+', icon: <Truck size={32} /> },
              { label: 'Top Ratings', value: '4.9/5', icon: <Star size={32} /> },
            ].map((stat, idx) => (
              <div key={idx} className="bg-white dark:bg-neutral-900 rounded-[2.5rem] p-8 shadow-sm border border-neutral-200 dark:border-neutral-800 text-center hover:shadow-xl transition-all duration-300">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-6">
                  {stat.icon}
                </div>
                <h3 className="text-3xl font-black text-neutral-900 dark:text-white mb-2">{stat.value}</h3>
                <p className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-widest">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES SECTION */}
      <section className="py-24">
        <div className="container mx-auto px-4 text-center">
          <div className="max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl lg:text-5xl font-black text-neutral-900 dark:text-white mb-6">Why SCA Shop?</h2>
            <p className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed">
              We bring the best flavors from across the city right to your dining table with speed and care.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              { title: "Gourmet Quality", desc: "Our chefs use only the freshest, high-quality ingredients for every dish." },
              { title: "Ultra Fast Delivery", desc: "Hot food delivered in under 30 minutes, or it's on us." },
              { title: "Modern Ordering", desc: "Easy to use app and website for a seamless food ordering experience." },
              { title: "Safe Packaging", desc: "Eco-friendly, spill-proof packaging that keeps your food fresh and hot." },
              { title: "Exclusive Offers", desc: "Get amazing discounts and loyalty points on every single order." },
              { title: "24/7 Support", desc: "Our customer happiness team is always here to help you." },
            ].map((service, i) => (
              <div key={i} className="group p-10 rounded-[2.5rem] bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-indigo-300 dark:hover:border-indigo-700 transition-all duration-300 shadow-sm hover:shadow-2xl">
                <div className="w-16 h-16 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center mb-8 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                  <CheckCircle size={28} />
                </div>
                <h3 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden bg-neutral-900 dark:bg-white rounded-[3.5rem] p-12 lg:p-24 text-center">
             {/* Background glow */}
             <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 blur-[100px] pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-96 h-96 bg-fuchsia-500/20 blur-[100px] pointer-events-none" />
             
            <h2 className="relative z-10 text-4xl lg:text-6xl font-black text-white dark:text-neutral-900 mb-8 leading-tight">
              Ready to Taste the <br /> Excellence?
            </h2>
            <p className="relative z-10 text-xl text-neutral-400 dark:text-neutral-600 mb-12 max-w-2xl mx-auto font-medium">
              Join thousands of food lovers who enjoy our premium menu every day. Get started now.
            </p>

            <div className="relative z-10 flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/menu">
                <button className="h-16 px-12 rounded-2xl bg-indigo-600 text-white font-black text-lg shadow-xl shadow-indigo-600/30 hover:bg-indigo-700 hover:scale-105 transition-all">
                  Browse Menu
                </button>
              </Link>

              <Link href="/signup">
                <button className="h-16 px-12 rounded-2xl bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white font-black text-lg border border-neutral-200 dark:border-neutral-800 hover:scale-105 transition-all">
                   Join as Member
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  </>
  )
}