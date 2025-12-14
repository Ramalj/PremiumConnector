"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Wifi,
  UtensilsCrossed,
  HeartHandshake,
  Star,
  Contact,
  ShieldCheck,
  MapPin,
  Gift,
  BookOpen,
  Smartphone,
  ArrowRight,
  QrCode
} from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full bg-[#FAFAFA] min-h-screen">

      {/* Hero Section */}
      <section className="w-full relative overflow-hidden bg-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-indigo-100 opacity-20 blur-[100px]"></div>

        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-24 pb-32 flex flex-col items-center text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8 inline-flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700/80 rounded-full text-sm font-semibold tracking-wide border border-indigo-100/50 backdrop-blur-sm"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            The Premium QR Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight mb-8 text-slate-900"
          >
            Connect Everything <br className="hidden md:block" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-gradient-x">
              With One Scan.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="max-w-2xl text-lg md:text-xl text-slate-500 mb-12 font-medium leading-relaxed"
          >
            Create stunning, secure, and trackable QR codes for your business.
            From seamless Wi-Fi access to digital menus and wedding invites.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link
              href="/signup"
              className="group px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-slate-900/20 hover:scale-105 hover:shadow-2xl hover:shadow-slate-900/30 flex items-center gap-2"
            >
              Start Generating
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Services Grid Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20">
        <div className="flex flex-col items-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 text-center">
            Powerful Tools for Every Need
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl text-center">
            Choose from our suite of professional QR tools designed to enhance user experience and drive engagement.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <ServiceCard
            icon={<Wifi className="w-6 h-6 text-white" />}
            title="Wi-Fi Access"
            description="Instant connection without typing passwords. Perfect for hotels & cafes."
            gradient="from-blue-500 to-indigo-500"
            href="/tools/wifi-qr"
          />
          <ServiceCard
            icon={<UtensilsCrossed className="w-6 h-6 text-white" />}
            title="Restaurant Menu"
            description="Contactless digital menus. Update items and prices in real-time."
            gradient="from-orange-500 to-red-500"
          />
          <ServiceCard
            icon={<HeartHandshake className="w-6 h-6 text-white" />}
            title="Wedding Invite"
            description="Beautiful digital invitations with RSVP tracking and event details."
            gradient="from-pink-500 to-rose-500"
          />
          <ServiceCard
            icon={<Star className="w-6 h-6 text-white" />}
            title="Google Reviews"
            description="Boost your online presence by directing customers to leave 5-star reviews."
            gradient="from-yellow-400 to-orange-500"
          />
          <ServiceCard
            icon={<Contact className="w-6 h-6 text-white" />}
            title="Digital Business Card"
            description="Share contact details instantly with a sleek, vCard-enabled QR code."
            gradient="from-emerald-500 to-teal-500"
          />
          <ServiceCard
            icon={<ShieldCheck className="w-6 h-6 text-white" />}
            title="Product Authenticity"
            description="Verify product originality and build trust with secure scan codes."
            gradient="from-slate-700 to-slate-900"
          />
          <ServiceCard
            icon={<MapPin className="w-6 h-6 text-white" />}
            title="Google Maps"
            description="Direct customers to your physical location with one simple scan."
            gradient="from-green-500 to-emerald-600"
          />
          <ServiceCard
            icon={<Gift className="w-6 h-6 text-white" />}
            title="Loyalty Program"
            description="Digital stamp cards to reward repeat customers and build loyalty."
            gradient="from-purple-500 to-violet-600"
          />
          <ServiceCard
            icon={<BookOpen className="w-6 h-6 text-white" />}
            title="Catalog Viewer"
            description="Showcase full product catalogs for car dealers and retail stores."
            gradient="from-cyan-500 to-blue-500"
          />
          <ServiceCard
            icon={<Smartphone className="w-6 h-6 text-white" />}
            title="App Download"
            description="Universal link to download your app on both iOS and Android stores."
            gradient="from-fuchsia-500 to-pink-600"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full bg-slate-900 text-white py-24 px-4 overflow-hidden relative">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight">
            Ready to upgrade your experience?
          </h2>
          <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto">
            Join thousands of businesses using QRPrimeGen to connect better with their customers.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-all shadow-lg hover:shadow-xl hover:scale-105"
          >
            Get Started Now
          </Link>
        </div>
      </section>
    </div>
  );
}

function ServiceCard({ icon, title, description, gradient, href = "#" }: { icon: React.ReactNode; title: string; description: string; gradient: string, href?: string }) {
  return (
    <Link href={href} className="group h-full">
      <motion.div
        whileHover={{ y: -8 }}
        className="h-full p-6 bg-white rounded-3xl border border-slate-100 shadow-[0_2px_20px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0_10px_30px_-5px_rgba(0,0,0,0.1)] transition-all relative overflow-hidden"
      >
        <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${gradient} opacity-5 rounded-bl-[100px] transition-transform group-hover:scale-150`}></div>

        <div className={`w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg transform group-hover:rotate-12 transition-transform duration-300`}>
          {icon}
        </div>

        <h3 className="text-xl font-bold mb-3 text-slate-800 group-hover:text-indigo-600 transition-colors">
          {title}
        </h3>
        <p className="text-slate-500 leading-relaxed text-sm">
          {description}
        </p>

        <div className="mt-6 flex items-center text-sm font-semibold text-slate-400 group-hover:text-indigo-500 transition-colors">
          Create Now <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </div>
      </motion.div>
    </Link>
  );
}
