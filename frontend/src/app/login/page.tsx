"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google';

export default function LoginPage() {
    const router = useRouter();
    // In Next.js App Router client components, we can use useSearchParams.
    // However, to keep it simple and safe from suspense boundaries for now, we can check basic window.location or just default to /
    // Ideally we use import { useSearchParams } from 'next/navigation';

    // Changing to redirect to home '/' by default as requested.
    // If we want to support returnUrl, we need useSearchParams

    // Let's stick to the user's request: "redirect to page where user came from or redirect to homepage."
    // Since "where user came from" is hard to know without a query param, defaulting to Home '/' is the requested behavior.

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await api.post('/auth/login', { email, password });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage')); // Notify Navbar

            // Check for returnUrl
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl') || '/';
            router.push(returnUrl);

        } catch (err: any) {
            setError(err.response?.data?.error || 'Login failed');
        }
    };

    const handleGoogleSuccess = async (credentialResponse: any) => {
        try {
            const res = await api.post('/auth/google', { token: credentialResponse.credential });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            window.dispatchEvent(new Event('storage')); // Notify Navbar

            // Check for returnUrl
            const params = new URLSearchParams(window.location.search);
            const returnUrl = params.get('returnUrl') || '/';
            router.push(returnUrl);

        } catch (err: any) {
            setError(err.response?.data?.error || 'Google Login failed');
        }
    };

    return (
        <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''}>
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50/50">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl border border-gray-100/50 backdrop-blur-sm"
                >
                    <h2 className="text-3xl font-bold mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                        Welcome Back
                    </h2>
                    <p className="text-center text-gray-500 mb-8">Access your premium QR tools</p>

                    {error && <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100 flex items-center justify-center">{error}</div>}

                    <div className="flex justify-center mb-6">
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={() => setError('Google Login Failed')}
                            theme="outline"
                            size="large"
                            width="340"
                            text="signin_with"
                            shape="circle"
                        />
                    </div>

                    <div className="relative mb-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-gray-400">Or continue with email</span>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                                required
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1 text-gray-700">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all duration-200"
                                required
                                placeholder="••••••••"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-indigo-500/30 active:scale-[0.98]"
                        >
                            Sign In
                        </button>
                    </form>
                    <p className="mt-8 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link href="/signup" className="text-indigo-600 hover:text-indigo-700 font-medium hover:underline transition-colors">
                            Sign up now
                        </Link>
                    </p>
                </motion.div>
            </div>
        </GoogleOAuthProvider>
    );
}
