
"use client";
import { useState, useEffect } from 'react';
import { Edit2, Check, X, Shield, Zap, Star } from 'lucide-react';
import axios from 'axios';

interface PlanFeature {
    id: string;
    code: string;
    name: string;
    type: string;
    description: string;
    value?: string;
    display_text?: string;
    feature_active_in_plan?: boolean;
}

interface Plan {
    id: string;
    name: string;
    price_monthly: number;
    price_yearly: number;
    is_active: boolean;
    features: PlanFeature[];
}

interface Feature {
    id: string;
    name: string;
    code: string;
    type: string;
}

export default function PlansPage() {
    const [plans, setPlans] = useState<Plan[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [allFeatures, setAllFeatures] = useState<Feature[]>([]);

    useEffect(() => {
        fetchPlans();
        fetchFeatures();
    }, []);

    const fetchPlans = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/plans');
            setPlans(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching plans:', error);
            setLoading(false);
        }
    };

    const fetchFeatures = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/features');
            setAllFeatures(response.data);
        } catch (error) {
            console.error('Error fetching features:', error);
        }
    };

    const handleEditPlan = (plan: Plan) => {
        setSelectedPlan({ ...plan }); // Create a copy
        setIsEditModalOpen(true);
    };

    const handlePlanUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedPlan) return;

        try {
            await axios.put(`http://localhost:8080/api/plans/${selectedPlan.id}`, {
                name: selectedPlan.name,
                price_monthly: selectedPlan.price_monthly,
                price_yearly: selectedPlan.price_yearly,
                is_active: selectedPlan.is_active,
            });
            setIsEditModalOpen(false);
            fetchPlans();
        } catch (error) {
            console.error('Error updating plan:', error);
        }
    };

    const toggleFeature = async (featureId: string, isAssigned: boolean) => {
        if (!selectedPlan) return;

        try {
            await axios.put(`http://localhost:8080/api/plans/${selectedPlan.id}/features`, {
                feature_id: featureId,
                is_assigned: isAssigned,
                value: '', // Default value
                display_text: '' // Default display text
            });

            // Update local selectedPlan state immediately to reflect change in UI
            const updatedFeatures = selectedPlan.features.map(f => {
                if (f.id === featureId) {
                    return { ...f, feature_active_in_plan: isAssigned };
                }
                return f;
            });

            setSelectedPlan({ ...selectedPlan, features: updatedFeatures });

            // Also refresh global plans list in background
            fetchPlans();

        } catch (error) {
            console.error('Error toggling feature:', error);
        }
    };

    const updateFeatureValue = async (featureId: string, field: 'value' | 'display_text', newValue: string) => {
        if (!selectedPlan) return;
        // Find current values
        const currentFeature = selectedPlan.features.find(f => f.id === featureId);

        try {
            await axios.put(`http://localhost:8080/api/plans/${selectedPlan.id}/features`, {
                feature_id: featureId,
                is_assigned: true,
                value: field === 'value' ? newValue : currentFeature?.value,
                display_text: field === 'display_text' ? newValue : currentFeature?.display_text
            });

            // Update local state immediately
            const updatedFeatures = selectedPlan.features.map(f => {
                if (f.id === featureId) {
                    return {
                        ...f,
                        [field]: newValue
                    };
                }
                return f;
            });
            setSelectedPlan({ ...selectedPlan, features: updatedFeatures });

            fetchPlans(); // Sync globally
        } catch (error) {
            console.error('Error updating feature details:', error);
        }
    }


    const getPlanIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'free': return <Star className="w-8 h-8 text-gray-400" />;
            case 'pro': return <Zap className="w-8 h-8 text-indigo-500" />;
            case 'premium': return <Shield className="w-8 h-8 text-amber-500" />;
            default: return <Star className="w-8 h-8 text-gray-400" />;
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Plans Management</h1>
                    <p className="text-gray-500 mt-1">Configure subscription plans and features</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-3 text-center py-12 text-gray-500">Loading plans...</div>
                ) : (
                    plans.map((plan) => (
                        <div key={plan.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="bg-white p-3 rounded-xl shadow-sm">
                                        {getPlanIcon(plan.name)}
                                    </div>
                                    <div className={`px-2.5 py-1 rounded-full text-xs font-medium ${plan.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {plan.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                                <div className="mt-2 flex items-baseline gap-1">
                                    <span className="text-2xl font-bold text-gray-900">${plan.price_monthly}</span>
                                    <span className="text-sm text-gray-500">/mo</span>
                                </div>
                                <div className="text-sm text-gray-500">
                                    ${plan.price_yearly}/yr billed annually
                                </div>
                            </div>

                            <div className="p-6 flex-1">
                                <h4 className="text-sm font-semibold text-gray-900 mb-4 uppercase tracking-wider">Features</h4>
                                <ul className="space-y-3">
                                    {plan.features.filter(f => f.feature_active_in_plan).slice(0, 5).map(feature => (
                                        <li key={feature.id} className="flex items-center gap-3 text-sm text-gray-600">
                                            <Check size={16} className="text-green-500 flex-shrink-0" />
                                            <span>
                                                {feature.display_text || feature.name}
                                                {feature.value && <span className="ml-1 text-gray-400">({feature.value})</span>}
                                            </span>
                                        </li>
                                    ))}
                                    {plan.features.filter(f => f.feature_active_in_plan).length > 5 && (
                                        <li className="text-sm text-gray-400 pl-7">
                                            + {plan.features.filter(f => f.feature_active_in_plan).length - 5} more features
                                        </li>
                                    )}
                                </ul>
                            </div>

                            <div className="p-6 border-t border-gray-100 mt-auto">
                                <button
                                    onClick={() => handleEditPlan(plan)}
                                    className="w-full py-2.5 px-4 bg-white border border-gray-200 text-gray-700 font-medium rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm"
                                >
                                    Edit Plan Details
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Edit Modal */}
            {isEditModalOpen && selectedPlan && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
                    <div className="bg-white rounded-2xl w-full max-w-4xl shadow-xl border border-gray-100 my-8 flex flex-col max-h-[90vh]">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white rounded-t-2xl z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900">Edit {selectedPlan.name} Plan</h2>
                                <p className="text-sm text-gray-500">Update pricing and feature availability</p>
                            </div>
                            <button onClick={() => setIsEditModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-6">
                            <form id="planForm" onSubmit={handlePlanUpdate} className="space-y-8">
                                {/* Basic Info Section */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                                        Basic Information
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Plan Name</label>
                                            <input
                                                type="text"
                                                value={selectedPlan.name}
                                                onChange={(e) => setSelectedPlan({ ...selectedPlan, name: e.target.value })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                                            <select
                                                value={selectedPlan.is_active ? 'true' : 'false'}
                                                onChange={(e) => setSelectedPlan({ ...selectedPlan, is_active: e.target.value === 'true' })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            >
                                                <option value="true">Active</option>
                                                <option value="false">Inactive</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={selectedPlan.price_monthly}
                                                onChange={(e) => setSelectedPlan({ ...selectedPlan, price_monthly: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Yearly Price ($)</label>
                                            <input
                                                type="number"
                                                step="0.01"
                                                value={selectedPlan.price_yearly}
                                                onChange={(e) => setSelectedPlan({ ...selectedPlan, price_yearly: parseFloat(e.target.value) })}
                                                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                            />
                                        </div>
                                    </div>
                                </section>

                                <div className="border-t border-gray-100"></div>

                                {/* Features Section */}
                                <section>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                        <div className="w-1 h-6 bg-indigo-500 rounded-full"></div>
                                        Feature Configuration
                                    </h3>
                                    <div className="bg-gray-50 rounded-xl border border-gray-100 overflow-hidden">
                                        <table className="w-full text-left">
                                            <thead className="bg-gray-100/50 border-b border-gray-100">
                                                <tr>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider w-16">Enable</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Feature</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Display Text</th>
                                                    <th className="px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Internal Value</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {selectedPlan.features.map((feature) => (
                                                    <tr key={feature.id} className={feature.feature_active_in_plan ? 'bg-white' : 'bg-gray-50/50'}>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="checkbox"
                                                                checked={feature.feature_active_in_plan || false}
                                                                onChange={(e) => toggleFeature(feature.id, e.target.checked)}
                                                                className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 transition-all cursor-pointer"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="font-medium text-gray-900">{feature.name}</div>
                                                            <div className="text-xs text-gray-500">{feature.description}</div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                disabled={!feature.feature_active_in_plan}
                                                                value={feature.display_text || ''}
                                                                onChange={(e) => updateFeatureValue(feature.id, 'display_text', e.target.value)}
                                                                onBlur={() => fetchPlans()} // Sync on blur
                                                                placeholder={feature.name}
                                                                className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 disabled:bg-transparent disabled:border-transparent disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                            />
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <input
                                                                type="text"
                                                                disabled={!feature.feature_active_in_plan}
                                                                value={feature.value || ''}
                                                                onChange={(e) => updateFeatureValue(feature.id, 'value', e.target.value)}
                                                                onBlur={() => fetchPlans()} // Sync on blur
                                                                placeholder="e.g. 100 or true"
                                                                className="w-full px-3 py-1.5 text-sm rounded border border-gray-200 disabled:bg-transparent disabled:border-transparent disabled:text-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                                                            />
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </section>
                            </form>
                        </div>

                        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-white transition-all shadow-sm"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                form="planForm"
                                className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
                            >
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
