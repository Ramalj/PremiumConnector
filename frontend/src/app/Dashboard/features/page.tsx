
"use client";
import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Check } from 'lucide-react';
import axios from 'axios';

interface Feature {
    id: string;
    code: string;
    name: string;
    type: string;
    description: string;
}

export default function FeaturesPage() {
    const [features, setFeatures] = useState<Feature[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentFeature, setCurrentFeature] = useState<Partial<Feature>>({});
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchFeatures();
    }, []);

    const fetchFeatures = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/features');
            setFeatures(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching features:', error);
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Are you sure you want to delete this feature?')) {
            try {
                await axios.delete(`http://localhost:8080/api/features/${id}`);
                fetchFeatures();
            } catch (error) {
                console.error('Error deleting feature:', error);
            }
        }
    };

    const handleEdit = (feature: Feature) => {
        setCurrentFeature(feature);
        setIsEditing(true);
        setIsModalOpen(true);
    };

    const handleAdd = () => {
        setCurrentFeature({ type: 'boolean' });
        setIsEditing(false);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing && currentFeature.id) {
                await axios.put(`http://localhost:8080/api/features/${currentFeature.id}`, currentFeature);
            } else {
                await axios.post('http://localhost:8080/api/features', currentFeature);
            }
            setIsModalOpen(false);
            fetchFeatures();
        } catch (error) {
            console.error('Error saving feature:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Features Management</h1>
                    <p className="text-gray-500 mt-1">Manage functionality available in plans</p>
                </div>
                <button
                    onClick={handleAdd}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
                >
                    <Plus size={20} />
                    Add Feature
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Name</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Code</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Type</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Description</th>
                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    Loading features...
                                </td>
                            </tr>
                        ) : features.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                    No features found. Create one to get started.
                                </td>
                            </tr>
                        ) : (
                            features.map((feature) => (
                                <tr key={feature.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium text-gray-900">{feature.name}</td>
                                    <td className="px-6 py-4 text-gray-600 font-mono text-sm">{feature.code}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-medium">
                                            {feature.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={feature.description}>
                                        {feature.description}
                                    </td>
                                    <td className="px-6 py-4 text-right space-x-2">
                                        <button
                                            onClick={() => handleEdit(feature)}
                                            className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(feature.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-gray-900">
                                {isEditing ? 'Edit Feature' : 'Add New Feature'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Feature Name</label>
                                <input
                                    type="text"
                                    required
                                    value={currentFeature.name || ''}
                                    onChange={(e) => setCurrentFeature({ ...currentFeature, name: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-gray-900"
                                    placeholder="e.g. WiFi QR Code"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Unique Code</label>
                                <input
                                    type="text"
                                    required
                                    value={currentFeature.code || ''}
                                    onChange={(e) => setCurrentFeature({ ...currentFeature, code: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-gray-900 font-mono"
                                    placeholder="e.g. wifi_qr"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                                <select
                                    value={currentFeature.type || 'boolean'}
                                    onChange={(e) => setCurrentFeature({ ...currentFeature, type: e.target.value })}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-gray-900"
                                >
                                    <option value="boolean">Boolean (Yes/No)</option>
                                    <option value="text">Text (Custom Value)</option>
                                    <option value="number">Number</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={currentFeature.description || ''}
                                    onChange={(e) => setCurrentFeature({ ...currentFeature, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-gray-400 text-gray-900"
                                    placeholder="Brief description of the feature..."
                                />
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 font-medium transition-colors"
                                >
                                    {isEditing ? 'Update Feature' : 'Create Feature'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
