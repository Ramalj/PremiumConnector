"use client";

import { motion } from 'framer-motion';
import { Wifi, ShieldCheck, Download } from 'lucide-react';

export default function HomeFeatures() {
    return (
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
