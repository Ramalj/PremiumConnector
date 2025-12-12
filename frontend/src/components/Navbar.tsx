"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, QrCode, Menu, X } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
            <div className="flex items-center justify-between px-6 py-4">
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-indigo-600 p-2 rounded-lg">
                        <QrCode className="text-white w-6 h-6" />
                    </div>
                    <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        QRPrimeGen
                    </span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-4">
                    {isLoggedIn ? (
                        <>
                            <Link href="/tools/wifi" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                                Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 text-sm font-medium text-red-500 hover:text-red-600"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link href="/login" className="text-sm font-medium hover:text-indigo-600 transition-colors">
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="px-4 py-2 rounded-full bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                            >
                                Get Started
                            </Link>
                        </>
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

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-200 p-4 flex flex-col gap-4 shadow-xl animate-in slide-in-from-top-2">
                    {isLoggedIn ? (
                        <>
                            <Link
                                href="/tools/wifi"
                                className="text-base font-medium p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                                className="flex items-center gap-2 text-base font-medium text-red-500 p-2 hover:bg-red-50 rounded-lg transition-colors text-left"
                            >
                                <LogOut size={18} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-base font-medium p-2 hover:bg-gray-50 rounded-lg transition-colors"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="flex items-center justify-center px-4 py-3 rounded-xl bg-indigo-600 text-white text-base font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/30"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Get Started
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
}
