'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');
        setError('');

        // Validate Gmail
        if (!email.toLowerCase().endsWith('@gmail.com')) {
            setError('Only Gmail addresses (@gmail.com) are allowed');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'If your email is registered, you will receive a password reset link shortly.');
                setEmail('');
            } else {
                setError(data.error || 'Failed to send reset link');
            }
        } catch (err) {
            console.error('Forgot password error:', err);
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
                            Forgot Password
                        </h1>
                        <p className="text-gray-600">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {message ? (
                        <div className="bg-green-50 border border-green-200 rounded-xl p-6 animate-fadeIn">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl">✉️</span>
                            </div>
                            <p className="text-green-800 font-medium">
                                {message}
                            </p>
                            <div className="mt-6">
                                <Link href="/login" className="text-yellow-600 font-bold hover:text-amber-700 underline underline-offset-4">
                                    Back to Login
                                </Link>
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5 text-left">
                            {error && (
                                <div className="rounded-lg bg-red-50 border border-red-200 p-4 animate-shake">
                                    <p className="text-sm text-red-700 font-bold">{error}</p>
                                </div>
                            )}

                            <div>
                                <label htmlFor="email" className="block text-sm font-bold text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 border-2 border-gray-100 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition-all shadow-sm"
                                    placeholder="you@gmail.com"
                                    required
                                    disabled={loading}
                                />
                                <p className="mt-2 text-xs text-gray-400 font-medium flex items-center">
                                    <span className="mr-1">💡</span> Only Gmail addresses are accepted
                                </p>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 py-3.5 rounded-xl font-extrabold hover:from-yellow-500 hover:to-amber-600 transition-all shadow-lg shadow-yellow-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending link...
                                    </span>
                                ) : 'Send Reset Link'}
                            </button>

                            <div className="text-center pt-2">
                                <Link
                                    href="/login"
                                    className="text-gray-500 hover:text-yellow-600 font-bold transition-colors text-sm"
                                >
                                    ← Back to Login
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
