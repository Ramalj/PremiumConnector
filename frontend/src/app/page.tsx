"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Wifi, ShieldCheck, Zap, Download } from 'lucide-react';

export default function Home() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full py-20 md:py-32 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8 p-3 bg-indigo-50 text-indigo-600 rounded-full text-sm font-semibold tracking-wide uppercase"
        >
          ✨ The Premium QR Generator
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-indigo-800 to-gray-900"
        >
          Share Wi-Fi <br className="hidden md:block" /> with Confidence.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="max-w-2xl text-lg md:text-xl text-gray-600 mb-10"
        >
          Generate secure, beautiful, and manageable Wi-Fi QR codes. Toggle access instantly, customize credentials, and print premium wall stickers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link
            href="/signup"
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold text-lg transition-all shadow-xl shadow-indigo-500/40 hover:scale-105 transform"
          >
            Get Started Free
          </Link>
          <Link
            href="/login"
            className="px-8 py-4 bg-white border border-gray-200 text-gray-900 rounded-full font-bold text-lg hover:bg-gray-50 transition-all"
          >
            Login
          </Link>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8 py-20 w-full max-w-6xl">
        <FeatureCard
          icon={<Wifi className="w-8 h-8 text-indigo-500" />}
          title="Instant Connection"
          description="Guests scan and connect immediately. No more typing long passwords."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-8 h-8 text-green-500" />}
          title="Secure & Controllable"
          description="Disable a QR code instantly from your dashboard if you want to stop sharing."
        />
        <FeatureCard
          icon={<Download className="w-8 h-8 text-blue-500" />}
          title="Print Ready"
          description="Download high-quality wall stickers designed for hotels and cafes."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="p-8 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all"
    >
      <div className="mb-4 p-3 bg-gray-50 rounded-xl w-fit">{icon}</div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-gray-600 leading-relaxed">{description}</p>
    </motion.div>
  );
}
