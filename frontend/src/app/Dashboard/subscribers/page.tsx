"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Search, Filter, Crown, Users, AlertTriangle, Calendar, FileText } from 'lucide-react';

interface Subscriber {
    id: number;
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    user_email: string;
    user_name: string;
    plan_name: string;
    price_monthly: string;
    price_yearly: string;
}

export default function AdminSubscribersPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchSubscribers = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/admin/subscribers`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setSubscribers(data);
                } else {
                    console.error('Failed to fetch subscribers');
                }
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSubscribers();
    }, [router]);

    const filteredSubscribers = subscribers.filter(sub => {
        const matchesSearch =
            sub.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sub.plan_name?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterStatus === 'all' || sub.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    // Stats calculation
    const activeSubscribers = subscribers.filter(s => s.status === 'active' || s.status === 'trialing').length;
    const cancelingSubscribers = subscribers.filter(s => s.cancel_at_period_end).length;
    const totalUsers = subscribers.length; // Assuming list contains unique users with subscriptions

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Subscribers</h1>
                    <p className="text-gray-500 mt-1">Manage user subscriptions and plans.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Filter size={20} />
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                        Add Subscriber
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <Crown size={64} />
                    </div>
                    <p className="text-sm font-medium text-gray-500">Active Subscriptions</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-2xl font-bold text-gray-900">{activeSubscribers}</h3>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(activeSubscribers / totalUsers) * 100 || 0}%` }}></div>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Churn Risk</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-2xl font-bold text-gray-900">{cancelingSubscribers}</h3>
                        <span className="text-xs text-gray-500 self-center">canceling soon</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full mt-4 overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(cancelingSubscribers / totalUsers) * 100 || 0}%` }}></div>
                    </div>
                </div>
                {/* Placeholder for Revenue/ARPU */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Plans</p>
                    <div className="flex items-end gap-2 mt-2">
                        {/* Simple count of unique plans */}
                        <h3 className="text-2xl font-bold text-gray-900">{new Set(subscribers.map(s => s.plan_name)).size}</h3>
                    </div>
                    <p className="text-xs text-gray-400 mt-4">Active plan types</p>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by email, name or plan..."
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-gray-900 focus:ring-2 focus:ring-indigo-100 transition-all placeholder:text-gray-400"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <select
                    className="px-4 py-2 bg-gray-50 border-none rounded-xl text-gray-600 font-medium focus:ring-2 focus:ring-indigo-100 cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="trialing">Trialing</option>
                    <option value="canceled">Canceled</option>
                    <option value="past_due">Past Due</option>
                </select>
            </div>

            {/* Subscribers Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredSubscribers.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Plan</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Billing Cycle</th>
                                    <th className="px-6 py-4">Renewal/Expiry</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredSubscribers.map((sub) => (
                                    <tr key={sub.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{sub.user_name}</span>
                                                <span className="text-xs text-gray-500">{sub.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                    <Crown size={16} />
                                                </div>
                                                <span className="font-medium text-gray-900">{sub.plan_name}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${sub.status === 'active' ? 'bg-green-100 text-green-700' :
                                                    sub.status === 'trialing' ? 'bg-blue-100 text-blue-700' :
                                                        sub.status === 'canceled' ? 'bg-gray-100 text-gray-700' :
                                                            'bg-amber-100 text-amber-700'
                                                }`}>
                                                {sub.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-gray-900 font-medium">${sub.price_monthly}</span>
                                            <span className="text-gray-400">/mo</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-500">
                                                <Calendar size={16} className="text-gray-400" />
                                                {sub.cancel_at_period_end ? (
                                                    <span className="text-red-500 flex items-center gap-1" title="Cancels at period end">
                                                        {new Date(sub.current_period_end).toLocaleDateString()}
                                                        <AlertTriangle size={12} />
                                                    </span>
                                                ) : (
                                                    <span>{new Date(sub.current_period_end).toLocaleDateString()}</span>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <Users className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No subscribers found</h3>
                            <p className="mt-1 max-w-sm mx-auto">
                                {searchTerm ? 'Try adjusting your search or filters.' : 'No active subscriptions found.'}
                            </p>
                        </div>
                    )}
                </div>
                {/* Pagination (Placeholder) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {filteredSubscribers.length} results</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
