"use client";

import { useState } from 'react';
import { WiFiQR } from '@/app/wifi-qr/page';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Wifi, Power, Download, QrCode, Edit } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import StickerModal from './StickerModal';

interface Props {
    qr: WiFiQR;
    onUpdate: (qr: WiFiQR) => void;
    onEdit: (qr: WiFiQR) => void;
}

export default function WiFiCard({ qr, onUpdate, onEdit }: Props) {
    const [showSticker, setShowSticker] = useState(false);
    const [toggling, setToggling] = useState(false);

    const handleToggle = async () => {
        setToggling(true);
        try {
            const res = await api.put(`/wifi/${qr.id}`, { is_active: !qr.is_active });
            onUpdate(res.data);
        } catch (err) {
            console.error('Failed to toggle', err);
        } finally {
            setToggling(false);
        }
    };

    const connectUrl = `${window.location.origin}/connect/${qr.id}`;

    return (
        <>
            <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`relative p-6 rounded-3xl border-2 transition-all duration-300 ${qr.is_active
                    ? 'bg-white dark:bg-zinc-900 border-gray-100 dark:border-zinc-800 shadow-xl'
                    : 'bg-gray-50 dark:bg-zinc-900/50 border-gray-200 dark:border-zinc-800 opacity-75'
                    }`}
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${qr.is_active ? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600' : 'bg-gray-200 dark:bg-zinc-800 text-gray-400'}`}>
                        <Wifi size={24} />
                    </div>
                    <button
                        onClick={handleToggle}
                        disabled={toggling}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${qr.is_active
                            ? 'bg-green-100/50 text-green-700 hover:bg-green-100'
                            : 'bg-gray-200 text-gray-500 hover:bg-gray-300'
                            }`}
                    >
                        <Power size={14} />
                        {toggling ? '...' : qr.is_active ? 'Active' : 'Disabled'}
                    </button>
                </div>

                <h3 className="text-xl font-bold truncate mb-1">{qr.ssid}</h3>
                <p className="text-sm text-gray-500 mb-6 font-mono">Password: ••••••••</p>

                <div className="flex gap-3">
                    <button
                        onClick={() => setShowSticker(true)}
                        className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:opacity-90 transition-opacity"
                    >
                        <QrCode size={16} /> Sticker
                    </button>
                    <button
                        onClick={() => onEdit(qr)}
                        className="p-2.5 rounded-xl border border-gray-200 dark:border-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
                        title="Edit Details"
                    >
                        <Edit size={18} />
                    </button>
                </div>
            </motion.div>

            {showSticker && (
                <StickerModal qr={qr} url={connectUrl} onClose={() => setShowSticker(false)} />
            )}
        </>
    );
}
