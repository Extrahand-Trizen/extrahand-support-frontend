'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Shield, Hash, LogOut, Loader2, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Check authentication
        const accessToken = localStorage.getItem('accessToken');
        const userStr = localStorage.getItem('user');

        if (!accessToken || !userStr) {
            router.push('/login');
            return;
        }

        try {
            const userData = JSON.parse(userStr);
            setUser(userData);
        } catch (error) {
            console.error('Failed to parse user data', error);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            router.push('/login');
        } finally {
            setLoading(false);
        }
    }, [router]);

    const handleLogout = async () => {
        try {
            // Call logout API if available
            await fetch('/api/auth/logout', { method: 'POST' });
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('user');
            // Dispatch event to update header
            window.dispatchEvent(new Event('auth-change'));
            router.push('/login');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-amber-500 animate-spin" />
            </div>
        );
    }

    if (!user) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto space-y-4">
                {/* Back Button */}
                <div>
                    <Link href="/" className="inline-flex items-center text-gray-500 hover:text-amber-600 transition-colors text-sm font-medium">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                {/* Compact Profile Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col sm:flex-row items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 rounded-full -mr-16 -mt-16 blur-2xl opacity-50"></div>

                    <div className="relative z-10 flex-shrink-0">
                        <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-yellow-600 rounded-xl flex items-center justify-center text-white text-2xl font-black shadow-md shadow-amber-500/20">
                            {user.name?.charAt(0).toUpperCase()}
                        </div>
                    </div>

                    <div className="flex-1 text-center sm:text-left relative z-10">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h1 className="text-xl font-bold text-gray-900 tracking-tight">
                                {user.name}
                            </h1>
                            <span className="inline-block px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wide self-center sm:self-auto">
                                {user.role || 'Customer'}
                            </span>
                        </div>
                        <p className="text-gray-500 text-xs font-medium">
                            Member since {new Date().getFullYear()}
                        </p>
                    </div>

                    <div className="relative z-10">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-red-100 text-red-600 bg-red-50 hover:bg-red-100 rounded-lg font-bold transition-colors text-xs"
                        >
                            <LogOut className="h-3 w-3 mr-2" />
                            Sign Out
                        </button>
                    </div>
                </div>

                {/* Compact Details Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4">

                        <div className="sm:col-span-2 pb-2 border-b border-gray-50 mb-2">
                            <h2 className="text-sm font-bold text-gray-900 flex items-center">
                                <User className="h-4 w-4 mr-2 text-amber-500" />
                                Personal Information
                            </h2>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Full Name
                            </label>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed select-none flex items-center justify-between">
                                <span>{user.name}</span>
                                <Shield className="h-3 w-3 text-gray-300" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Email Address
                            </label>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-700 text-sm font-medium cursor-not-allowed select-none flex items-center justify-between">
                                <span className="truncate">{user.email}</span>
                                <Mail className="h-3 w-3 text-gray-300" />
                            </div>
                        </div>

                        <div className="sm:col-span-2 pt-4 pb-2 border-b border-gray-50 mb-2 mt-2">
                            <h2 className="text-sm font-bold text-gray-900 flex items-center">
                                <Shield className="h-4 w-4 mr-2 text-amber-500" />
                                Account Details
                            </h2>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                User ID
                            </label>
                            <div className="px-3 py-2 bg-gray-50 rounded-lg border border-gray-200 text-gray-500 font-mono text-xs cursor-not-allowed select-none flex items-center justify-between">
                                <span className="truncate">{user.id || user._id || 'Not available'}</span>
                                <Hash className="h-3 w-3 text-gray-300" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">
                                Status
                            </label>
                            <div className="flex items-center space-x-2 h-[34px]">
                                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700 border border-green-200">
                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5"></span>
                                    Active
                                </span>
                                <span className="text-[10px] text-gray-400">Verified</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 p-3 bg-blue-50/50 border border-blue-100 rounded-lg">
                        <p className="text-[10px] text-blue-700 font-medium leading-relaxed text-center">
                            Note: To edit your profile information or update security settings, please contact our support team directly.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
