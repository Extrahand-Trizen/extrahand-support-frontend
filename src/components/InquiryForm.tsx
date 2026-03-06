'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { Send, CheckCircle, Mail, User, MessageSquare, AlertCircle } from 'lucide-react';
import { getTicketServiceBaseUrl } from '@/lib/ticketServiceUrl';

export default function InquiryForm() {
    const searchParams = useSearchParams();
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        subject: '',
        message: '',
        priority: 'medium'
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Handle URL parameters for auto-filling and auto-submission
    useEffect(() => {
        const full_name = searchParams.get('full_name');
        const email = searchParams.get('email');
        const subject = searchParams.get('subject');
        const message = searchParams.get('message');

        if (full_name || email || subject || message) {
            const newData = {
                full_name: full_name || '',
                email: email || '',
                subject: subject || '',
                message: message || '',
                priority: 'medium'
            };
            setFormData(newData);

            // Auto-submit if all required fields are present
            if (full_name && email && subject && message) {
                submitInquiry(newData);
            }
        }
    }, [searchParams]);

    const submitInquiry = async (dataPayload: any) => {
        setLoading(true);
        setError('');

        try {
            const response = await fetch(`${getTicketServiceBaseUrl()}/api/inquiries`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dataPayload)
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setSubmitted(true);
                setFormData({
                    full_name: '',
                    email: '',
                    subject: '',
                    message: '',
                    priority: 'medium'
                });
            } else {
                setError(data.error || 'Failed to submit inquiry');
            }
        } catch (err) {
            setError('Failed to submit inquiry. Please try again.');
            console.error('Error submitting inquiry:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        submitInquiry(formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    if (submitted) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-xl w-full bg-white rounded-3xl shadow-xl p-12 text-center border border-gray-100">
                    <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-200">
                        <CheckCircle className="h-10 w-10 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-3">Message Logged!</h2>
                    <p className="text-gray-500 mb-8 leading-relaxed text-lg">
                        We've securely received your inquiry. One of our experts will review it and get back to you within 24 hours.
                    </p>
                    <button
                        onClick={() => setSubmitted(false)}
                        className="bg-amber-500 text-white py-3 px-8 rounded-xl hover:bg-amber-600 transition-colors font-bold shadow-md hover:shadow-lg"
                    >
                        Submit Another Inquiry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-orange-50 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                {/* Header */}
                <div className="bg-white p-8 border-b border-gray-100">
                    <div className="flex items-center mb-1">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center mr-4">
                            <Send className="h-6 w-6 text-amber-500" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Inquiry Desk</h1>
                            <p className="text-gray-400 text-xs font-bold tracking-wider uppercase">DETAILED ASSISTANCE FORM</p>
                        </div>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-red-800">{error}</p>
                        </div>
                    )}

                    {/* Name and Email Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="text"
                                    name="full_name"
                                    value={formData.full_name}
                                    onChange={handleChange}
                                    placeholder="e.g. Alexander Pierce"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                                Email Identifier
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="alex@domain.com"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Subject */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Inquiry Subject
                        </label>
                        <div className="relative">
                            <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <select
                                name="subject"
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-900 appearance-none cursor-pointer"
                            >
                                <option value="">Choose a specialized topic</option>
                                <option value="Account Issues">Account Issues</option>
                                <option value="Technical Support">Technical Support</option>
                                <option value="Billing & Payments">Billing & Payments</option>
                                <option value="Feature Request">Feature Request</option>
                                <option value="Bug Report">Bug Report</option>
                                <option value="General Inquiry">General Inquiry</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    {/* Priority */}
                    <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Priority Level
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                            {['low', 'medium', 'high', 'urgent'].map((priority) => (
                                <button
                                    key={priority}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, priority })}
                                    className={`py-2 px-4 rounded-lg border-2 font-medium text-sm transition-all shadow-sm ${formData.priority === priority
                                        ? priority === 'urgent'
                                            ? 'bg-red-600 border-red-600 text-white shadow-red-200'
                                            : priority === 'high'
                                                ? 'bg-orange-600 border-orange-600 text-white shadow-orange-200'
                                                : priority === 'medium'
                                                    ? 'bg-amber-500 border-amber-500 text-white shadow-amber-200'
                                                    : 'bg-green-600 border-green-600 text-white shadow-green-200'
                                        : 'bg-white border-gray-200 text-gray-600 hover:border-amber-300 hover:text-amber-600'
                                        }`}
                                >
                                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                            Contextual Message
                        </label>
                        <textarea
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Please provide comprehensive details about your requirement..."
                            required
                            rows={6}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-50 text-gray-900 placeholder-gray-400 resize-none"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 px-6 rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all font-bold text-lg shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wide"
                    >
                        {loading ? (
                            <span className="flex items-center justify-center">
                                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Submitting...
                            </span>
                        ) : (
                            'DISPATCH MESSAGE'
                        )}
                    </button>

                    <p className="text-xs text-gray-500 text-center">
                        By submitting this form, you agree to our terms of service and privacy policy.
                    </p>
                </form>
            </div>
        </div>
    );
}
