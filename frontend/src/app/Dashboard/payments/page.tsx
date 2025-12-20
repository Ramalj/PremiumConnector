"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Download, Search, Filter, ArrowUpRight, ArrowDownRight, MoreHorizontal, FileText } from 'lucide-react';

interface Payment {
    id: number;
    amount: string;
    currency: string;
    status: string;
    created_at: string;
    receipt_url: string;
    user_email: string;
    user_name: string;
}

export default function AdminPaymentsPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');

    useEffect(() => {
        const fetchPayments = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/admin/payments`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setPayments(data);
                } else {
                    console.error('Failed to fetch payments');
                }
            } catch (error) {
                console.error('Error fetching payments:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPayments();
    }, [router]);

    const filteredPayments = payments.filter(payment => {
        const matchesSearch =
            payment.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            payment.id.toString().includes(searchTerm);

        const matchesFilter = filterStatus === 'all' || payment.status === filterStatus;

        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Payments</h1>
                    <p className="text-gray-500 mt-1">Monitor and manage all transaction history.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                        <Filter size={20} />
                    </button>
                    <button className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium shadow-sm shadow-indigo-200 hover:bg-indigo-700 transition-colors">
                        Export Report
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Total Revenue</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                            ${payments.reduce((acc, curr) => acc + parseFloat(curr.amount), 0).toFixed(2)}
                        </h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mb-1">
                            <ArrowUpRight size={12} className="mr-1" />
                            +12.5%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Successful Transactions</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {payments.filter(p => p.status === 'succeeded').length}
                        </h3>
                        <span className="flex items-center text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full mb-1">
                            <ArrowUpRight size={12} className="mr-1" />
                            +4.3%
                        </span>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <p className="text-sm font-medium text-gray-500">Failed Transactions</p>
                    <div className="flex items-end gap-2 mt-2">
                        <h3 className="text-2xl font-bold text-gray-900">
                            {payments.filter(p => p.status !== 'succeeded').length}
                        </h3>
                        <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-full mb-1">
                            <ArrowDownRight size={12} className="mr-1" />
                            -2.1%
                        </span>
                    </div>
                </div>
            </div>

            {/* Search and Filters */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by email, name or ID..."
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
                    <option value="succeeded">Succeeded</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                </select>
            </div>

            {/* Payments Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    {filteredPayments.length > 0 ? (
                        <table className="w-full text-left text-sm text-gray-600">
                            <thead className="bg-gray-50/50 text-gray-500 font-medium border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4">User</th>
                                    <th className="px-6 py-4">Amount</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-right">Receipt</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredPayments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50 transition-colors group">
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900">{payment.user_name}</span>
                                                <span className="text-xs text-gray-500">{payment.user_email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            ${parseFloat(payment.amount).toFixed(2)}
                                            <span className="ml-1 text-xs font-normal text-gray-400 uppercase">{payment.currency}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                                                ${payment.status === 'succeeded' ? 'bg-green-100 text-green-700' :
                                                    payment.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                                                        'bg-red-100 text-red-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-gray-500">
                                            {new Date(payment.created_at).toLocaleDateString(undefined, {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {payment.receipt_url ? (
                                                <a
                                                    href={payment.receipt_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors p-2 hover:bg-indigo-50 rounded-lg"
                                                    title="Download Receipt"
                                                >
                                                    <Download size={16} />
                                                </a>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="p-12 text-center text-gray-500 flex flex-col items-center">
                            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText className="text-gray-400" size={24} />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No payments found</h3>
                            <p className="mt-1 max-w-sm mx-auto">
                                {searchTerm ? 'Try adjusting your search or filters to find what you are looking for.' : 'No payment records are available yet.'}
                            </p>
                        </div>
                    )}
                </div>
                {/* Pagination (Placeholder) */}
                <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between text-sm text-gray-500">
                    <span>Showing {filteredPayments.length} results</span>
                    <div className="flex gap-2">
                        <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Previous</button>
                        <button className="px-3 py-1 border border-gray-200 rounded-lg bg-white disabled:opacity-50" disabled>Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
