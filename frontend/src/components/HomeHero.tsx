"use client";


import { motion } from 'framer-motion';

export default function HomeHero() {
    return (
        <section className="w-full pt-4 pb-12 md:pb-20 flex flex-col items-center text-center">
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
                className="max-w-2xl text-lg md:text-xl text-gray-600 mb-0"
            >
                Generate secure, beautiful, and manageable Wi-Fi QR codes. Toggle access instantly, customize credentials, and print premium wall stickers.
            </motion.p>
        </section>
    );
}
