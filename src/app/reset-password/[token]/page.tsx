'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface ResetPasswordPageProps {
    params: Promise<{ token: string }>;
}

export default function ResetPasswordPage({ params }: ResetPasswordPageProps) {
    const router = useRouter();
    const { token } = use(params);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        if (password.length < 8) {
            setError('Password must be at least 8 characters long');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(true);
                setTimeout(() => {
                    router.push('/login');
                }, 3000);
            } else {
                setError(data.error || 'Failed to reset password');
            }
        } catch (err) {
            console.error('Reset password error:', err);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 via-white to-amber-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full">
                <div className="bg-white rounded-2xl shadow-xl border-2 border-yellow-100 p-8 space-y-6 text-center">
                    <div className="inline-flex items-center justify-center mb-2">
                        <Image
                            src="/images/logo.png"
                            alt="ExtraHand Logo"
                            width={64}
                            height={64}
                            className="h-16 w-auto"
                            priority
                        />
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent">
                            Reset Password
                        </h1>
                        <p className="text-gray-600">
                            Create a new strong password for your account.
                        </p>
                    </div>

                    {success ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-fadeIn">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✅</span>
                            </div>
                            <p className="text-green-800 font-bold text-lg mb-2">
                                Password Reset Successfully!
                            </p>
                            <p className="text-green-600 text-sm">
                                Redirecting you to the login page...
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-shake">
                                    <p className="text-sm text-red-700 font-bold">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="password" className="block text-sm font-bold text-gray-700 mb-2">
                                    New Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="confirmPassword" className="block text-sm font-bold text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                                    placeholder="••••••••"
                                    required
                                    disabled={loading}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 py-3.5 rounded-xl font-extrabold hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? 'Resetting...' : 'Reset Password'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
