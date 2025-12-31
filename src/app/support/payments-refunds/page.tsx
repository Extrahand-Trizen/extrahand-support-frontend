'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CreditCard, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Making Payments',
    description: 'Learn about accepted payment methods, how to add payment details, and secure transaction processing.',
    readTime: '5 min read',
    lastUpdated: '1 week ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Making Payments</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand offers multiple secure payment methods to make transactions easy and convenient.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Accepted Payment Methods</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Credit cards (Visa, Mastercard, American Express)</li>
          <li>Debit cards</li>
          <li>PayPal</li>
          <li>Apple Pay and Google Pay</li>
          <li>Bank transfers (for larger amounts)</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Adding Payment Details</h3>
        <p className="text-gray-700 mb-4">
          Go to your account settings and select "Payment Methods". Click "Add New Payment Method" and enter your card or payment details. All payment information is encrypted and securely stored.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How Payments Work</h3>
        <p className="text-gray-700 mb-4">
          When you accept an offer, the payment is authorized on your card but held securely by ExtraHand until the task is completed. This protects both customers and helpers.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Security & Safety</h3>
        <p className="text-gray-700 mb-4">
          We use bank-level encryption and comply with PCI DSS standards to ensure your payment information is always protected.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Releasing Payments',
    description: 'Understand when and how payments are released to helpers after task completion.',
    readTime: '4 min read',
    lastUpdated: '2 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Releasing Payments</h2>
        <p className="text-gray-700 mb-4">
          Payment release is a crucial step that ensures both customers and helpers are satisfied with the completed work.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">When Are Payments Released?</h3>
        <p className="text-gray-700 mb-4">
          Payments are released to helpers once you mark the task as complete and confirm satisfaction. This typically happens immediately after task completion.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Automatic Release</h3>
        <p className="text-gray-700 mb-4">
          If no action is taken within 48 hours of task completion, payment is automatically released to the helper. This ensures helpers receive their earnings promptly.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Dispute Period</h3>
        <p className="text-gray-700 mb-4">
          If there's an issue with the completed task, you can open a dispute within the 48-hour window. The payment will be held while we investigate and work toward a resolution.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Tracking Payment Status</h3>
        <p className="text-gray-700 mb-4">
          You can view the status of all your payments in the "Transactions" section of your account. This shows pending, released, and refunded payments.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Refunds',
    description: 'Learn about our refund policy, eligibility criteria, and how to request a refund.',
    readTime: '6 min read',
    lastUpdated: '3 days ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Refunds</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand is committed to fair outcomes for both customers and helpers. Our refund policy ensures you're protected when tasks don't meet expectations.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">When Are Refunds Available?</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Task was not completed as agreed</li>
          <li>Helper didn't show up without valid reason</li>
          <li>Work quality significantly below standards</li>
          <li>Task was cancelled before helper started work</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How to Request a Refund</h3>
        <p className="text-gray-700 mb-4">
          Navigate to your task history and select the relevant task. Click "Request Refund" and provide details about the issue. Include photos or evidence if applicable.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Refund Processing Time</h3>
        <p className="text-gray-700 mb-4">
          Refunds are typically processed within 3-5 business days. The funds will be returned to your original payment method. Bank processing times may vary.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Partial Refunds</h3>
        <p className="text-gray-700 mb-4">
          In some cases, a partial refund may be appropriate if work was partially completed. Our support team will work with both parties to reach a fair resolution.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: 'Payment Troubleshooting',
    description: 'Common payment issues and their solutions. Get help with failed transactions and payment errors.',
    readTime: '7 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Payment Troubleshooting</h2>
        <p className="text-gray-700 mb-4">
          Encountering payment issues? Here are common problems and their solutions.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Payment Declined</h3>
        <p className="text-gray-700 mb-4">
          If your payment is declined, check that your card details are correct, you have sufficient funds, and your card hasn't expired. Contact your bank if the issue persists.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Duplicate Charges</h3>
        <p className="text-gray-700 mb-4">
          Sometimes a payment may appear twice due to authorization holds. These typically disappear within 3-5 business days. If not, contact our support team immediately.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Missing Payments</h3>
        <p className="text-gray-700 mb-4">
          If you were charged but don't see the transaction in your account, check your email for a payment confirmation. Allow up to 24 hours for transactions to appear.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Currency Conversion Issues</h3>
        <p className="text-gray-700 mb-4">
          International transactions may include currency conversion fees from your bank. These are separate from ExtraHand fees and appear on your bank statement.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Need More Help?</h3>
        <p className="text-gray-700 mb-4">
          If you're still experiencing payment issues, contact our support team with your transaction ID and details of the problem. We're here to help 24/7.
        </p>
      </>
    )
  },
];

export default function PaymentsRefundsPage() {
  const [selectedArticle, setSelectedArticle] = useState(articles[0]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-700 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Support Centre
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700 font-medium">Payments & Refunds</span>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Articles in this section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              <h3 className="text-base font-bold text-gray-900 mb-4">Articles in this section</h3>
              <div className="space-y-2">
                {articles.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => setSelectedArticle(article)}
                    className={`block w-full text-left text-sm hover:underline transition-colors ${
                      selectedArticle.id === article.id
                        ? 'text-gray-900 font-semibold'
                        : 'text-blue-600'
                    }`}
                  >
                    {article.title}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Main Article Content */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl p-8">
              <div className="prose max-w-none">
                {selectedArticle.content}
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>{selectedArticle.readTime}</span>
                  <span>Updated {selectedArticle.lastUpdated}</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-medium text-gray-900 mb-4">Was this article helpful?</p>
                <div className="flex gap-3">
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Yes
                  </button>
                  <button className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    No
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-block px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Back to All Categories
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
