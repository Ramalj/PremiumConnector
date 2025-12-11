"use client";

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import { Wifi, Copy, Check, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface PublicWiFi {
    ssid: string;
    password: string;
    encryption: string;
    is_active: boolean;
}

export default function ConnectPage() {
    const { id } = useParams();
    const [wifi, setWifi] = useState<PublicWiFi | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        const fetchWifi = async () => {
            try {
                const res = await api.get(`/wifi/public/${id}`);
                setWifi(res.data);
            } catch (err: any) {
                setError(err.response?.data?.error || 'Failed to load Wi-Fi details');
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchWifi();
    }, [id]);

    const copyPassword = () => {
        if (wifi) {
            navigator.clipboard.writeText(wifi.password);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-50"><span className="animate-pulse">Loading...</span></div>;

    if (error || !wifi) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 text-center">
                <XCircle className="w-16 h-16 text-red-500 mb-4" />
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Unavailable</h1>
                <p className="text-gray-500">{error || 'This Wi-Fi link is invalid.'}</p>
            </div>
        );
    }

    // WIFI:S:SSID;T:WPA;P:PASSWORD;;
    const wifiString = `WIFI:S:${wifi.ssid};T:${wifi.encryption};P:${wifi.password};;`;

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 text-center"
            >
                <div className="mx-auto w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                    <Wifi className="w-10 h-10 text-indigo-600" />
                </div>

                <h1 className="text-3xl font-bold mb-2 break-all">{wifi.ssid}</h1>
                <p className="text-gray-500 mb-8">Wi-Fi Network</p>

                <a
                    href={wifiString}
                    className="inline-flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg mb-8 transition-all hover:scale-105 shadow-lg shadow-indigo-500/20 w-full"
                >
                    <Wifi className="w-6 h-6" />
                    Join Network
                </a>

                <div className="bg-gray-50 p-6 rounded-2xl mb-8 flex flex-col items-center">
                    <div className="w-full text-left">
                        <p className="text-xs text-gray-400 mb-1 ml-1">Password</p>
                        <div className="flex gap-2">
                            <div className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 font-mono text-lg truncate">
                                {wifi.password}
                            </div>
                            <button
                                onClick={copyPassword}
                                className="bg-indigo-600 hover:bg-indigo-700 text-white p-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
                            >
                                {copied ? <Check size={24} /> : <Copy size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                <p className="text-sm text-gray-400">
                    Open your Wi-Fi settings and join this network using the password above.
                </p>
            </motion.div>
        </div>
    );
}
