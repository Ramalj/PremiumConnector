
"use client";
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { Search, Edit2, Shield, User as UserIcon, Building, Phone, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface User {
    id: string;
    email: string;
    name: string | null;
    role: string;
    created_at: string;
    company: string | null;
    phone: string | null;
}

export default function UserManagementPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    // Edit Form State
    const [editName, setEditName] = useState('');
    const [editRole, setEditRole] = useState('');
    const [editEmail, setEditEmail] = useState('');

    const [error, setError] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setError('');
            const res = await api.get('/users');
            setUsers(res.data);
            setLoading(false);
        } catch (error: any) {
            console.error('Failed to fetch users', error);
            setError(error.response?.data?.error || error.message || 'Failed to fetch users');
            setLoading(false);
        }
    };

    const handleEditClick = (user: User) => {
        setSelectedUser(user);
        setEditName(user.name || '');
        setEditEmail(user.email);
        setEditRole(user.role);
        setIsEditModalOpen(true);
    };

    const handleSave = async () => {
        if (!selectedUser) return;

        try {
            // Update details
            await api.put(`/users/${selectedUser.id}`, {
                name: editName,
                email: editEmail
            });

            // Update role if changed
            if (editRole !== selectedUser.role) {
                await api.put(`/users/${selectedUser.id}/role`, {
                    role: editRole
                });
            }

            setIsEditModalOpen(false);
            fetchUsers(); // Refresh list
        } catch (error) {
            console.error('Failed to update user', error);
            alert('Failed to update user');
        }
    };

    const filteredUsers = users.filter(user =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.name && user.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
                    <p className="text-gray-500 mt-1">Manage system users and roles</p>
                </div>

                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search users..."
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100">
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">User</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Role</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm">Joined</th>
                                <th className="px-6 py-4 font-medium text-gray-500 text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-violet-100 flex items-center justify-center text-indigo-600 font-medium">
                                                {user.name ? user.name[0].toUpperCase() : user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="font-medium text-gray-900">{user.name || 'No Name'}</div>
                                                <div className="text-sm text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${user.role.toLowerCase() === 'admin'
                                            ? 'bg-purple-100 text-purple-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {user.role.toLowerCase() === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(user.created_at).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={() => handleEditClick(user)}
                                            className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                        >
                                            <Edit2 size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {loading && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">Loading users...</td>
                                </tr>
                            )}
                            {error && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-red-500">
                                        Error: {error}
                                    </td>
                                </tr>
                            )}
                            {!loading && filteredUsers.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No users found</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {isEditModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden"
                        >
                            <div className="p-6 border-b border-gray-100">
                                <h3 className="text-lg font-bold text-gray-900">Edit User</h3>
                            </div>

                            <div className="p-6 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                                    <input
                                        type="text"
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        value={editEmail}
                                        onChange={(e) => setEditEmail(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                                    <select
                                        value={editRole}
                                        onChange={(e) => setEditRole(e.target.value)}
                                        className="w-full px-4 py-2 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none bg-white"
                                    >
                                        <option value="customer">Customer</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-6 bg-gray-50 flex justify-end gap-3">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="px-4 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
