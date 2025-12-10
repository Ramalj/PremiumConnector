"use client";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { LogOut, QrCode } from 'lucide-react';

export default function Navbar() {
    const router = useRouter();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        setIsLoggedIn(!!localStorage.getItem('token'));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsLoggedIn(false);
        router.push('/login');
    };

    return (
        <nav className="flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-black/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
            <Link href="/" className="flex items-center gap-2">
                <div className="bg-indigo-600 p-2 rounded-lg">
                    <QrCode className="text-white w-6 h-6" />
                </div>
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400">
                    QRPrimeGen
                </span>
            </Link>

            <div className="flex items-center gap-4">
                {isLoggedIn ? (
                    <>
                        <Link href="/wifi-qr" className="text-sm font-medium hover:text-indigo-600 transition-colors">
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
        </nav>
    );
}
