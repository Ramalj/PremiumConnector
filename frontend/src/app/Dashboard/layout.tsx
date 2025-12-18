
"use client";
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Users, LayoutDashboard, LogOut, Package, ListCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('storage'));
        router.push('/login');
    };

    const navItems = [
        { name: 'Overview', href: '/Dashboard', icon: LayoutDashboard },
        { name: 'User Management', href: '/Dashboard/users', icon: Users },
        { name: 'Plans', href: '/Dashboard/plans', icon: Package },
        { name: 'Features', href: '/Dashboard/features', icon: ListCheck },
    ];

    return (
        <div className="flex min-h-[calc(100vh-7rem)] bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col">
                <div className="p-6">
                    <h2 className="text-xl font-bold text-gray-800">Admin Panel</h2>
                </div>

                <nav className="flex-1 px-4 space-y-2">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                    ? 'bg-indigo-50 text-indigo-600 font-medium shadow-sm shadow-indigo-100'
                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                    }`}
                            >
                                <item.icon size={20} className={isActive ? 'text-indigo-600' : 'text-gray-400'} />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                    >
                        <LogOut size={20} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {/* Mobile Sidebar Overlay would go here if needed, keeping it simple for now */}

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                {children}
            </main>
        </div>
    );
}
