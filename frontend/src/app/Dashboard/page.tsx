
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        if (!token || !userData) {
            router.push('/login');
            return;
        }

        const parsedUser = JSON.parse(userData);
        // Case-insensitive check for admin role
        if (!parsedUser.role || parsedUser.role.toLowerCase() !== 'admin') {
            router.push('/'); // Redirect non-admins
            return;
        }

        setUser(parsedUser);
    }, [router]);

    if (!user) return null;

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500 mt-2">Welcome back, {user.name}!</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-violet-600 p-6 rounded-2xl text-white shadow-lg shadow-indigo-200">
                    <h3 className="text-lg font-medium opacity-90">Total Users</h3>
                    <p className="text-3xl font-bold mt-2">--</p>
                    <p className="text-sm opacity-75 mt-4">Active accounts</p>
                </div>
                {/* Placeholders for other stats */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h3 className="text-lg font-medium text-gray-900">System Status</h3>
                    <p className="text-3xl font-bold mt-2 text-green-500">Online</p>
                    <p className="text-sm text-gray-500 mt-4">All systems operational</p>
                </div>
            </div>
        </div>
    );
}
