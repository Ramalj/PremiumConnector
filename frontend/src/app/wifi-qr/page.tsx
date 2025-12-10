"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Plus, Wifi, Search, X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import WiFiCard from '@/components/WiFiCard';
import CreateWiFiModal from '@/components/CreateWiFiModal';

// Types
export interface WiFiQR {
    id: string;
    ssid: string;
    password: string;
    encryption: string;
    is_active: boolean;
    created_at: string;
}

export default function Dashboard() {
    const router = useRouter();
    const [qrs, setQrs] = useState<WiFiQR[]>([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingQr, setEditingQr] = useState<WiFiQR | null>(null);

    const fetchQRs = async () => {
        try {
            const res = await api.get('/wifi');
            setQrs(res.data);
        } catch (err) {
            console.error(err);
            // If unauthorized, redirect to login
            router.push('/login');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQRs();
    }, []);

    const handleSave = (savedQr: WiFiQR) => {
        if (editingQr) {
            setQrs(qrs.map(q => q.id === savedQr.id ? savedQr : q));
        } else {
            setQrs([savedQr, ...qrs]);
        }
        setShowCreateModal(false);
        setEditingQr(null);
    };

    const openCreate = () => {
        setEditingQr(null);
        setShowCreateModal(true);
    };

    const openEdit = (qr: WiFiQR) => {
        setEditingQr(qr);
        setShowCreateModal(true);
    };

    const handleUpdate = (updatedQr: WiFiQR) => {
        setQrs(qrs.map(q => q.id === updatedQr.id ? updatedQr : q));
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Wi-Fi Dashboard</h1>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">Manage all your Wi-Fi connections here.</p>
                </div>
                <button
                    onClick={openCreate}
                    className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium shadow-lg shadow-indigo-500/25 transition-all active:scale-95"
                >
                    <Plus size={20} /> New Wi-Fi QR
                </button>
            </div>

            {qrs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-3xl border border-dashed border-gray-300 dark:border-zinc-700">
                    <div className="mx-auto w-16 h-16 bg-gray-100 dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4">
                        <Wifi className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white">No Wi-Fi QRs yet</h3>
                    <p className="text-gray-500 max-w-sm mx-auto mt-2 mb-6">Create your first secure Wi-Fi QR code to get started.</p>
                    <button
                        onClick={openCreate}
                        className="text-indigo-600 font-medium hover:underline"
                    >
                        Create one now
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {qrs.map((qr) => (
                            <WiFiCard key={qr.id} qr={qr} onUpdate={handleUpdate} onEdit={openEdit} />
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {showCreateModal && (
                <CreateWiFiModal
                    onClose={() => { setShowCreateModal(false); setEditingQr(null); }}
                    onCreate={handleSave}
                    initialData={editingQr}
                />
            )}
        </div>
    );
}
