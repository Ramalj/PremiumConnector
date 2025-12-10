"use client";

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { WiFiQR } from '@/app/wifi-qr/page';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
    onClose: () => void;
    onCreate: (qr: WiFiQR) => void;
    initialData?: WiFiQR | null;
}

export default function CreateWiFiModal({ onClose, onCreate, initialData }: Props) {
    const [ssid, setSsid] = useState('');
    const [password, setPassword] = useState('');
    const [encryption, setEncryption] = useState('WPA');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (initialData) {
            setSsid(initialData.ssid);
            setPassword(initialData.password);
            setEncryption(initialData.encryption || 'WPA');
        }
    }, [initialData]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let res;
            if (initialData) {
                res = await api.put(`/wifi/${initialData.id}`, { ssid, password, encryption });
            } else {
                res = await api.post('/wifi', { ssid, password, encryption });
            }
            onCreate(res.data);
        } catch (err) {
            alert(`Failed to ${initialData ? 'update' : 'create'} Wi-Fi QR`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold">{initialData ? 'Edit Wi-Fi QR' : 'New Wi-Fi QR'}</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1">Network Name (SSID)</label>
                        <input
                            type="text"
                            value={ssid}
                            onChange={(e) => setSsid(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. Hotel Guest Wi-Fi"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1">Password</label>
                        <input
                            type="text"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                            placeholder="e.g. securepassword123"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 ml-1">Encryption</label>
                        <select
                            value={encryption}
                            onChange={(e) => setEncryption(e.target.value)}
                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
                        >
                            <option value="WPA">WPA/WPA2 (Most Common)</option>
                            <option value="WEP">WEP (Legacy)</option>
                            <option value="nopass">None (Open Network)</option>
                        </select>
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 disabled:opacity-70 flex justify-center items-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {initialData ? 'Save Changes' : 'Create QR Code'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
}
