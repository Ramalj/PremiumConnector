"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Calendar, CheckCircle, AlertTriangle, Download, ExternalLink, Loader2, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface SubscriptionStatus {
    status: string;
    current_period_end: string;
    cancel_at_period_end: boolean;
    plan_name: string;
    price_monthly: string;
    price_yearly: string;
}

interface Payment {
    amount: string;
    currency: string;
    status: string;
    created_at: string;
    receipt_url: string;
}

export default function PaymentHistory() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [subscription, setSubscription] = useState<SubscriptionStatus | null>(null);
    const [history, setHistory] = useState<Payment[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                // Fetch Subscription Status
                const subRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/status`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (subRes.ok) {
                    const subData = await subRes.json();
                    setSubscription(subData);
                }

                // Fetch Payment History
                const histRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/history`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (histRes.ok) {
                    const histData = await histRes.json();
                    setHistory(histData);
                }

            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [router]);

    const handleManageSubscription = async () => {
        const token = localStorage.getItem('token');
        if (!token) return;

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/subscription/portal-session`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Could not redirect to billing portal.');
            }
        } catch (error) {
            console.error('Error creating portal session:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-24 pb-12 flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-24 pb-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Payment History</h1>
                    <p className="text-gray-500 mb-8">Manage your subscription and view past transactions.</p>

                    {/* Subscription Status Card */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-500/5 overflow-hidden border border-gray-100 mb-8">
                        <div className="p-6 sm:p-8">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                                        Current Plan
                                        {subscription?.status === 'active' || subscription?.status === 'trialing' ? (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                                                Active
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                Inactive
                                            </span>
                                        )}
                                    </h2>
                                    <p className="text-gray-500 mt-1">
                                        {subscription?.plan_name ? `${subscription.plan_name} Plan` : 'No active plan'}
                                    </p>
                                </div>
                                <button
                                    onClick={handleManageSubscription}
                                    className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-medium hover:bg-indigo-100 transition-colors flex items-center gap-2"
                                >
                                    Manage Subscription
                                    <ExternalLink size={16} />
                                </button>
                            </div>

                            {subscription && subscription.status !== 'none' && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                                <Calendar size={20} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">Billing Cycle</span>
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900 pl-[52px]">
                                            {subscription.cancel_at_period_end ? (
                                                <span className="text-amber-600 flex items-center gap-2">
                                                    Cancels on {new Date(subscription.current_period_end).toLocaleDateString()}
                                                    <AlertTriangle size={16} />
                                                </span>
                                            ) : (
                                                `Next billing: ${new Date(subscription.current_period_end).toLocaleDateString()}`
                                            )}
                                        </div>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="p-2 bg-white rounded-lg shadow-sm text-indigo-600">
                                                <CreditCard size={20} />
                                            </div>
                                            <span className="text-sm font-medium text-gray-500">Amount</span>
                                        </div>
                                        <div className="text-lg font-semibold text-gray-900 pl-[52px]">
                                            {/* Checking monthly price as placeholder, logic could be more robust */}
                                            ${subscription.price_monthly}/month
                                        </div>
                                    </div>
                                </div>
                            )}

                            {(!subscription || subscription.status === 'none') && (
                                <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 text-gray-500 text-center">
                                    You are currently on the Free plan. <a href="/pricing" className="text-indigo-600 font-medium hover:underline">Upgrade now</a> to unlock premium features.
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Payment History List */}
                    <div className="bg-white rounded-2xl shadow-xl shadow-indigo-500/5 overflow-hidden border border-gray-100">
                        <div className="p-6 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Billing History</h3>
                        </div>
                        <div className="overflow-x-auto">
                            {history.length > 0 ? (
                                <table className="w-full text-left text-sm text-gray-600">
                                    <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-100">
                                        <tr>
                                            <th className="px-6 py-4">Date</th>
                                            <th className="px-6 py-4">Amount</th>
                                            <th className="px-6 py-4">Status</th>
                                            <th className="px-6 py-4 text-right">Invoice</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        {history.map((payment, index) => (
                                            <tr key={index} className="hover:bg-gray-50/50 transition-colors">
                                                <td className="px-6 py-4">
                                                    {new Date(payment.created_at).toLocaleDateString(undefined, {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </td>
                                                <td className="px-6 py-4 font-medium text-gray-900">
                                                    ${parseFloat(payment.amount).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 capitalize">
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {payment.receipt_url && (
                                                        <a
                                                            href={payment.receipt_url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-medium transition-colors"
                                                        >
                                                            Download
                                                            <Download size={14} />
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="p-12 text-center text-gray-500">
                                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <FileText className="text-gray-400" size={24} />
                                    </div>
                                    <p>No payment history found.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
