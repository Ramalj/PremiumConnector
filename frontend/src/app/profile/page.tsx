"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Mail, Building, Phone, MapPin, Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

interface UserData {
    name: string;
    email: string;
    address: string;
    company: string;
    phone: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [userData, setUserData] = useState<UserData>({
        name: '',
        email: '',
        address: '',
        company: '',
        phone: ''
    });

    useEffect(() => {
        const fetchUserData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('http://localhost:8080/api/auth/me', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setUserData({
                        name: data.name || '',
                        email: data.email || '',
                        address: data.address || '',
                        company: data.company || '',
                        phone: data.phone || ''
                    });
                } else {
                    router.push('/login');
                }
            } catch (err) {
                setError('Failed to load profile');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');
        setSuccess('');

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:8080/api/auth/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (response.ok) {
                setSuccess('Profile updated successfully');
                // Persist user name update to local state/context if needed
            } else {
                setError('Failed to update profile');
            }
        } catch (err) {
            setError('An error occurred while saving');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-gray-50">
                <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-20 pb-12">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="bg-white rounded-3xl shadow-xl shadow-indigo-500/5 overflow-hidden border border-gray-100">
                        {/* Header */}
                        <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-8 py-10 text-white relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-10 opacity-10 transform translate-x-10 -translate-y-10">
                                <User size={200} />
                            </div>
                            <div className="flex items-center gap-6 relative z-10">
                                <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center border-2 border-white/30 shadow-2xl">
                                    <span className="text-4xl font-bold">
                                        {userData.name ? userData.name.charAt(0).toUpperCase() : userData.email.charAt(0).toUpperCase()}
                                    </span>
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold">{userData.name || 'User Profile'}</h1>
                                    <p className="text-indigo-100 mt-1 flex items-center gap-2">
                                        <Mail size={16} />
                                        {userData.email}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <div className="p-8">
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    {/* Personal Details */}
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <User size={20} className="text-indigo-600" />
                                            Personal Details
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={userData.name}
                                                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="Enter your name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    disabled
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-100/50 text-gray-500 cursor-not-allowed"
                                                />
                                                <p className="text-xs text-gray-400 mt-1">Email cannot be changed</p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={userData.phone}
                                                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="+1 (555) 000-0000"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company & Address */}
                                    <div className="space-y-6">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                                            <Building size={20} className="text-indigo-600" />
                                            Company & Location
                                        </h2>

                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Company Name</label>
                                                <input
                                                    type="text"
                                                    value={userData.company}
                                                    onChange={(e) => setUserData({ ...userData, company: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="Your company name"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-1.5">Address</label>
                                                <textarea
                                                    rows={4}
                                                    value={userData.address}
                                                    onChange={(e) => setUserData({ ...userData, address: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all bg-gray-50 focus:bg-white resize-none"
                                                    placeholder="Enter your full address"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                                    <div className="flex-1">
                                        {success && (
                                            <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in-up">
                                                <CheckCircle size={16} />
                                                {success}
                                            </div>
                                        )}
                                        {error && (
                                            <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg text-sm font-medium animate-fade-in-up">
                                                <AlertCircle size={16} />
                                                {error}
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-medium hover:shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <Loader2 size={20} className="animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <Save size={20} />
                                                Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
