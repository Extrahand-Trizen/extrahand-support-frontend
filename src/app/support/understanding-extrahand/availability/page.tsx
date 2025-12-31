'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Home, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

export default function AvailabilityPage() {
  const [helpful, setHelpful] = useState<boolean | null>(null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/20 to-white">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex items-center space-x-2 text-sm flex-wrap">
            <Link href="/support" className="text-blue-600 hover:text-blue-700 flex items-center">
              <Home className="h-4 w-4 mr-1" />
              Support Centre
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <Link href="/support/understanding-extrahand" className="text-blue-600 hover:text-blue-700">
              Understanding ExtraHand
            </Link>
            <ChevronRight className="h-4 w-4 text-gray-400" />
            <span className="text-gray-700 font-medium">Availability</span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="text-sm text-gray-600">
              <div>2 years ago</div>
              <div>Updated</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">Is ExtraHand available in my country?</h1>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              ExtraHand is currently available in <strong>Australia</strong>, <strong>New Zealand</strong>, <strong>Singapore</strong>, the <strong>United Kingdom</strong>, <strong>Ireland</strong> and the <strong>United States</strong>.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Important Notes</h3>
              <ul className="space-y-3 text-gray-700">
                <li>You can only post tasks in the country where you are located (international tasks are not currently supported)</li>
                <li>If you're also completing tasks, you must be located in the same country and have local working rights</li>
                <li>Both of these conditions apply to remote tasks</li>
              </ul>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Expansion Plans</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              If we decide to expand into different countries or change the above conditions, there will be a public announcement. Check in on our <Link href="https://facebook.com/extrahand" className="text-blue-600 hover:text-blue-700 font-semibold underline">Facebook</Link> page or <Link href="https://blog.extrahand.com" className="text-blue-600 hover:text-blue-700 font-semibold underline">blog</Link> to keep up to date with all ExtraHand news.
            </p>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-900 mb-3">Related to</h3>
              <Link href="/support/understanding-extrahand" className="text-blue-600 hover:text-blue-700 font-semibold">
                ExtraHand
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
          <div className="text-sm text-gray-500 mt-4">
            150 out of 254 found this helpful
          </div>
        </div>
      </article>
    </div>
  );
}
