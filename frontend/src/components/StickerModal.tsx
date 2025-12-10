"use client";

import { useRef, useState } from 'react';
import { WiFiQR } from '@/app/wifi-qr/page';
import { X, Download, Loader2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { toCanvas } from 'html-to-image';
import { motion } from 'framer-motion';

interface Props {
    qr: WiFiQR;
    url: string;
    onClose: () => void;
}

export default function StickerModal({ qr, url, onClose }: Props) {
    const stickerRef = useRef<HTMLDivElement>(null);
    const [downloading, setDownloading] = useState(false);

    const handleDownload = async () => {
        if (!stickerRef.current) return;
        setDownloading(true);
        try {
            // Robust method: Convert to Canvas first, then to Blob
            const canvas = await toCanvas(stickerRef.current, {
                cacheBust: true,
                pixelRatio: 3,
                backgroundColor: 'white' // Ensure white background for JPEG
            });

            // Convert canvas to blob manually (JPEG)
            canvas.toBlob((blob) => {
                if (!blob) {
                    console.error('Canvas is empty or tainted');
                    alert('Failed to generate sticker image.');
                    setDownloading(false);
                    return;
                }

                // Sanitize filename
                const safeSsid = qr.ssid.replace(/[^a-z0-9]/gi, '_').toLowerCase();
                const filename = `${safeSsid}-wifi-sticker.jpg`;

                // Create clean download link
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.download = filename;
                link.href = url;
                document.body.appendChild(link);
                link.click();

                // Cleanup
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
                setDownloading(false);
            }, 'image/jpeg', 0.95);

        } catch (err) {
            console.error('Failed to download', err);
            alert('Failed to download sticker. If you have images, they might be blocked by CORS.');
            setDownloading(false); // Reset downloading state on error
        }
    };

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white dark:bg-zinc-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
                <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-zinc-800">
                    <h3 className="text-xl font-bold">Wall Sticker Preview</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto bg-gray-50 dark:bg-black/50 p-6">
                    <div className="min-h-full w-full flex items-center justify-center p-4">
                        {/* The Sticker Design - Premium Light Mode */}
                        <div
                            ref={stickerRef}
                            className="w-[320px] bg-white text-slate-900 rounded-[32px] overflow-hidden shadow-2xl relative flex flex-col items-center border border-gray-100"
                        >
                            {/* Simple Elegant Header */}
                            <div className="w-full pt-10 pb-4 px-8 flex flex-col items-center relative z-10">
                                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-900"><path d="M5 12.55a11 11 0 0 1 14.08 0" /><path d="M1.42 9a16 16 0 0 1 21.16 0" /><path d="M8.53 16.11a6 6 0 0 1 6.95 0" /><line x1="12" x2="12.01" y1="20" y2="20" /></svg>
                                </div>
                                <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Wi-Fi</h2>
                                <p className="text-slate-500 text-[10px] font-bold tracking-[0.25em] uppercase mt-2">Scan to Connect</p>
                            </div>

                            {/* QR Section */}
                            <div className="px-8 pb-10 w-full flex flex-col items-center">
                                <div className="p-4 bg-white rounded-3xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.08)] border border-slate-50 mb-8 w-fit">
                                    <QRCodeSVG value={url} size={180} level="Q" marginSize={0} />
                                </div>

                                <div className="w-full text-center space-y-2">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Network Name</p>
                                    <div className="relative">
                                        <p className="text-2xl font-bold text-slate-900 break-words leading-tight px-2 font-display">{qr.ssid}</p>
                                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-slate-100 rounded-full"></div>
                                    </div>
                                </div>

                                <div className="mt-10 flex items-center justify-center gap-2 opacity-50">
                                    <div className="h-px w-8 bg-slate-300"></div>
                                    <span className="text-[9px] font-bold text-slate-400 tracking-widest uppercase">Fast & Secure</span>
                                    <div className="h-px w-8 bg-slate-300"></div>
                                </div>
                            </div>

                            {/* Decorative background visual */}
                            <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-slate-50/80 to-transparent pointer-events-none -z-0"></div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                    <button
                        onClick={handleDownload}
                        disabled={downloading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 flex justify-center items-center gap-2"
                    >
                        {downloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                        Download Sticker
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
