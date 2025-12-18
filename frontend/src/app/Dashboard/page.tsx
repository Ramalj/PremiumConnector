
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeUsers: 0
    });

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

        // Fetch dashboard stats after verifying admin role
        const fetchStats = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/count`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        totalUsers: data.count,
                        activeUsers: data.count // For now, assuming all users are active
                    });
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
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
                    <p className="text-3xl font-bold mt-2">{stats.totalUsers}</p>
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
