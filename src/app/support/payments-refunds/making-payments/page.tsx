'use client';

import Link from 'next/link';
import { CreditCard, ChevronRight, Home, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

export default function MakingPaymentsPage() {
  const [helpful, setHelpful] = useState<boolean | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/20 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm flex-wrap">
            <Link href="/support" className="text-blue-600 hover:text-blue-700 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Support Centre
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/support/payments-refunds" className="text-blue-600 hover:text-blue-700">
              Payments & Refunds
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700 font-medium">Making Payments</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-gradient-to-br from-green-50 to-emerald-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <CreditCard className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-gray-600">
              <div>1 week ago</div>
              <div>Updated</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Making Payments</h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Accepted Payment Methods</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              We accept all major payment methods to make your experience as convenient as possible:
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Credit & Debit Cards</h4>
                <p className="text-sm text-gray-600">Visa, Mastercard, American Express</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Digital Wallets</h4>
                <p className="text-sm text-gray-600">PayPal, Apple Pay, Google Pay</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Bank Transfer</h4>
                <p className="text-sm text-gray-600">For larger transactions</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Secure Processing</h4>
                <p className="text-sm text-gray-600">Bank-level encryption for all payments</p>
              </div>
            </div>

            <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How to Add a Payment Method</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1.</strong> Go to your Account Settings</li>
                <li><strong>2.</strong> Select "Payment Methods"</li>
                <li><strong>3.</strong> Click "Add New Payment Method"</li>
                <li><strong>4.</strong> Enter your payment details securely</li>
                <li><strong>5.</strong> Verify your payment method</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Payment Security</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              All payments are processed through secure, encrypted channels. We use industry-leading security measures including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700 mb-6">
              <li>256-bit SSL encryption</li>
              <li>PCI DSS compliance</li>
              <li>Fraud detection systems</li>
              <li>Two-factor authentication</li>
            </ul>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Payment Holds</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              When you agree to hire a Tasker, your payment is securely held until the task is completed to your satisfaction. This protects both you and the Tasker.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related to</h3>
              <Link href="/support/payments-refunds" className="text-blue-600 hover:text-blue-700 font-semibold">
                Payments & Refunds
              </Link>
            </div>
          </div>
        </div>

        {/* Feedback Section */}
        <div className="mt-12 bg-white rounded-2xl p-8 border-2 border-gray-200 text-center">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Was this article helpful?</h3>
          <div className="flex justify-center space-x-4 mb-6">
            <button
              onClick={() => setHelpful(true)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                helpful === true 
                  ? 'bg-green-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-green-50 border-2 border-gray-200 hover:border-green-300'
              }`}
            >
              <ThumbsUp className="h-5 w-5" />
              <span>Yes</span>
            </button>
            <button
              onClick={() => setHelpful(false)}
              className={`px-6 py-3 rounded-lg font-semibold transition-all flex items-center space-x-2 ${
                helpful === false 
                  ? 'bg-red-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-red-50 border-2 border-gray-200 hover:border-red-300'
              }`}
            >
              <ThumbsDown className="h-5 w-5" />
              <span>No</span>
            </button>
          </div>
          {helpful !== null && (
            <p className="text-sm text-gray-600 animate-fadeIn">
              {helpful ? 'Thank you for your feedback!' : 'We\'re sorry to hear that. Please contact support for more help.'}
            </p>
          )}
        </div>
      </article>
    </div>
  );
}
