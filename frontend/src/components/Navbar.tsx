"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, QrCode, Menu, X, ChevronDown, Wifi } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    const toggleDropdown = (name: string) => {
        if (activeDropdown === name) {
            setActiveDropdown(null);
        } else {
            setActiveDropdown(name);
        }
    };

    return (
        <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-xl border-b border-white/20 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-gradient-to-br from-indigo-600 to-violet-600 p-2.5 rounded-xl shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-all duration-300">
                            <QrCode className="text-white w-6 h-6" />
                        </div>
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-700">
                            QRPrimeGen
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {/* QR Services Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setActiveDropdown('services')}
                            onMouseLeave={() => setActiveDropdown(null)}
                        >
                            <button
                                className={`flex items-center gap-1.5 text-sm font-medium transition-colors ${activeDropdown === 'services' ? 'text-indigo-600' : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                            >
                                QR Services
                                <ChevronDown
                                    size={16}
                                    className={`transition-transform duration-200 ${activeDropdown === 'services' ? 'rotate-180' : ''}`}
                                />
                            </button>

                            <AnimatePresence>
                                {activeDropdown === 'services' && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 10 }}
                                        transition={{ duration: 0.2 }}
                                        className="absolute top-full left-0 w-64 mt-2 p-2 bg-white rounded-2xl shadow-xl shadow-indigo-500/10 border border-gray-100 overflow-hidden"
                                    >
                                        <div className="relative">
                                            <div className="absolute top-0 left-6 w-3 h-3 bg-white transform -translate-y-1.5 rotate-45 border-t border-l border-gray-100"></div>
                                        </div>
                                        <Link
                                            href="/tools/wifi-qr"
                                            className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 transition-colors group"
                                        >
                                            <div className="bg-indigo-100 text-indigo-600 p-2 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Wifi size={18} />
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">Wi-Fi QR</div>
                                                <div className="text-xs text-gray-500">Connect instantly</div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <Link href="/pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Pricing
                        </Link>
                        <Link href="/about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            About Us
                        </Link>
                        <Link href="/contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                            Contact Us
                        </Link>

                        <div className="h-6 w-px bg-gray-200"></div>

                        {isLoggedIn ? (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/tools/wifi-qr"
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600 transition-colors"
                                >
                                    <LogOut size={16} /> Logout
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-4">
                                <Link
                                    href="/login"
                                    className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/signup"
                                    className="px-5 py-2.5 rounded-full bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 active:scale-95"
                                >
                                    Get Started
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden border-t border-gray-100 bg-white/95 backdrop-blur-xl overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <div className="space-y-2">
                                <div className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
                                    Services
                                </div>
                                <Link
                                    href="/tools/wifi-qr"
                                    className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-indigo-50 active:bg-indigo-100 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <div className="bg-white text-indigo-600 p-2 rounded-lg shadow-sm">
                                        <Wifi size={18} />
                                    </div>
                                    <span className="font-medium text-gray-900">Wi-Fi QR</span>
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 my-2"></div>

                            <div className="grid grid-cols-1 gap-2">
                                <Link
                                    href="/pricing"
                                    className="px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Pricing
                                </Link>
                                <Link
                                    href="/about"
                                    className="px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/contact"
                                    className="px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    Contact Us
                                </Link>
                            </div>

                            <div className="border-t border-gray-100 my-2"></div>

                            {isLoggedIn ? (
                                <div className="space-y-3">
                                    <Link
                                        href="/tools/wifi-qr"
                                        className="block px-4 py-3 rounded-xl font-medium text-gray-600 hover:bg-gray-50 hover:text-indigo-600 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Dashboard
                                    </Link>
                                    <button
                                        onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                        className="flex items-center gap-2 px-4 py-3 w-full rounded-xl font-medium text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        <LogOut size={18} /> Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-3 pt-2">
                                    <Link
                                        href="/login"
                                        className="flex justify-center px-4 py-3 rounded-xl border border-gray-200 font-medium text-gray-900 hover:bg-gray-50 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Login
                                    </Link>
                                    <Link
                                        href="/signup"
                                        className="flex justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 shadow-lg shadow-indigo-500/30 transition-colors"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        Get Started
                                    </Link>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
