"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import PricingCard from "@/components/pricing/PricingCard";

export default function PricingPage() {
    const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

    // Plan Details
    // Pro: $15/mo -> Yearly $12/mo (20% off)
    // Premium: $35/mo -> Yearly $28/mo (20% off)
    const [plans, setPlans] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/plans`);
                if (!response.ok) throw new Error('Failed to fetch plans');
                const data = await response.json();

                // Calculate feature counts for sorting
                const featureCounts: { [key: string]: number } = {};
                data.forEach((plan: any) => {
                    plan.features.forEach((f: any) => {
                        if (f.feature_active_in_plan) {
                            featureCounts[f.id] = (featureCounts[f.id] || 0) + 1;
                        }
                    });
                });

                // Transform backend data to frontend structure
                const formattedPlans = data.map((plan: any) => ({
                    id: plan.id, // Added ID
                    name: plan.name,
                    description: plan.description,
                    monthlyPrice: parseFloat(plan.price_monthly),
                    yearlyPrice: parseFloat(plan.price_yearly),
                    features: plan.features
                        .filter((f: any) => f.feature_active_in_plan)
                        .sort((a: any, b: any) => {
                            const countA = featureCounts[a.id] || 0;
                            const countB = featureCounts[b.id] || 0;
                            // Sort by count descending (common features first)
                            if (countB !== countA) return countB - countA;
                            // Secondary sort by name
                            return (a.display_text || a.name).localeCompare(b.display_text || b.name);
                        })
                        .map((f: any) => f.display_text || f.name),
                    isPopular: plan.name === 'Pro', // Logic to determine popular plan
                }));

                // Sort plans by price (optional, but good practice if DB doesn't ensure it)
                formattedPlans.sort((a: any, b: any) => a.monthlyPrice - b.monthlyPrice);

                setPlans(formattedPlans);
            } catch (error) {
                console.error('Error loading plans:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    const handleSubscribe = async (planId: string) => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to login if not logged in
            window.location.href = `/login?redirect=/pricing`;
            return;
        }

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/subscription/create-checkout-session`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ planId })
            });

            if (!response.ok) {
                if (response.status === 401 || response.status === 403) {
                    localStorage.removeItem('token');
                    window.location.href = `/login?redirect=/pricing`;
                    return;
                }
                const error = await response.json();
                alert(error.error || 'Failed to start subscription');
                return;
            }

            const data = await response.json();
            if (data.url) {
                window.location.href = data.url;
            }
        } catch (error) {
            console.error('Error subscribing:', error);
            alert('Something went wrong. Please try again.');
        }
    };

    // Loading State
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    return (
        // FORCED LIGHT MODE: data-theme="light", class="light" and bg-white text-gray-900 override
        <div className="min-h-screen bg-gray-50 text-gray-900 light" data-theme="light" style={{ colorScheme: "light" }}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6"
                    >
                        Simple, Transparent Pricing
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-xl text-gray-600"
                    >
                        Choose the perfect plan for your needs. Always know what you'll pay.
                    </motion.p>
                </div>

                {/* Toggle */}
                <div className="flex justify-center mb-16">
                    <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex relative">
                        <motion.div
                            layout
                            className="absolute inset-y-1 rounded-lg bg-gray-900 shadow-sm"
                            initial={false}
                            animate={{
                                x: billingCycle === "monthly" ? 4 : "calc(100% - 4px)",
                                width: billingCycle === "monthly" ? "calc(50% - 4px)" : "calc(50% - 4px)",
                                left: 0 // anchor
                            }}
                            style={{
                                // Manually positioning based on typical widths if layout doesn't catch perfectly, 
                                // but usually better to put the background in the button logic or use a tab approach.
                                // Let's use a simpler class switching approach for the background with framer `layoutId`
                                // actually, simpler approach below:
                                display: 'none'
                            }}
                        />
                        {/* Re-implementing Toggle for simplicity and robustness */}
                        <button
                            onClick={() => setBillingCycle("monthly")}
                            className={`relative px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none z-10 ${billingCycle === "monthly" ? "text-white" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {billingCycle === "monthly" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-gray-900 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">Monthly</span>
                        </button>
                        <button
                            onClick={() => setBillingCycle("yearly")}
                            className={`relative px-8 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 focus:outline-none z-10 ${billingCycle === "yearly" ? "text-white" : "text-gray-600 hover:text-gray-900"
                                }`}
                        >
                            {billingCycle === "yearly" && (
                                <motion.div
                                    layoutId="active-pill"
                                    className="absolute inset-0 bg-gray-900 rounded-lg shadow-sm"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10 flex items-center gap-2">
                                Yearly
                                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-700 uppercase tracking-wide">
                                    Save 20%
                                </span>
                            </span>
                        </button>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
                    {plans.map((plan, index) => (
                        <PricingCard
                            key={plan.name}
                            {...plan}
                            price={billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice}
                            originalPrice={billingCycle === "yearly" ? plan.monthlyPrice : undefined}
                            billingCycle={billingCycle}
                            onSubscribe={() => handleSubscribe(plan.id)}
                        />
                    ))}
                </div>

            </div>
        </div>
    );
}
