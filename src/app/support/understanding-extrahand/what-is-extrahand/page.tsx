'use client';

import Link from 'next/link';
import { BookOpen, ChevronRight, Home, ThumbsUp, ThumbsDown, Share2 } from 'lucide-react';
import { useState } from 'react';

export default function WhatIsExtraHandPage() {
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
            <span className="text-gray-700 font-medium">What is ExtraHand?</span>
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
              <div>8 months ago</div>
              <div>Updated</div>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">What is ExtraHand?</h1>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <button className="flex items-center space-x-1 hover:text-blue-600 transition-colors">
              <Share2 className="h-4 w-4" />
              <span>Follow</span>
            </button>
          </div>
        </div>
      </section>

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="prose prose-lg max-w-none">
          <div className="bg-white rounded-2xl p-8 border-2 border-gray-200 shadow-sm">
            <p className="text-xl text-gray-700 leading-relaxed mb-6">
              ExtraHand is a <strong>trusted community platform</strong> that connects people who need to outsource tasks and find local services, with people looking to earn money and ready to work.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              Tell us what you need to be done, receive offers from trusted Taskers in minutes, and choose the best person.
            </p>

            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3">How It Works</h3>
              <ol className="space-y-3 text-gray-700">
                <li><strong>1. Post Your Task:</strong> Describe what you need done and when</li>
                <li><strong>2. Get Offers:</strong> Receive quotes from skilled Taskers nearby</li>
                <li><strong>3. Choose & Chat:</strong> Pick the best person and discuss details</li>
                <li><strong>4. Get It Done:</strong> Your Tasker completes the work</li>
              </ol>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">What Can ExtraHand Help You With?</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              From simple to complicated tasks, ExtraHand can help you complete your <strong>home cleaning</strong>, <strong>handyman tasks</strong>, <strong>admin work</strong>, <strong>photography</strong>, <strong>graphic design</strong> or even <strong>build a website</strong>.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Home Services</h4>
                <p className="text-sm text-gray-600">Cleaning, repairs, gardening, moving help</p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Creative Tasks</h4>
                <p className="text-sm text-gray-600">Design, photography, writing, video editing</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Professional Services</h4>
                <p className="text-sm text-gray-600">Admin work, data entry, bookkeeping</p>
              </div>
              <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-6 rounded-xl">
                <h4 className="font-bold text-gray-900 mb-2">Tech Support</h4>
                <p className="text-sm text-gray-600">Web development, IT help, app creation</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">Getting Started</h2>
            <p className="text-gray-700 leading-relaxed mb-6">
              Go online or download the app and let ExtraHand help you to get more done.
            </p>

            <p className="text-gray-700 leading-relaxed mb-6">
              For more information please visit <Link href="https://extrahand.com" className="text-blue-600 hover:text-blue-700 font-semibold underline">How It Works</Link>.
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
            155 out of 207 found this helpful
          </div>
        </div>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Related Articles</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <Link
              href="/support/understanding-extrahand/availability"
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group"
            >
              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                Is ExtraHand available in my country?
              </h4>
              <p className="text-sm text-gray-600">Check service availability in your area</p>
            </Link>
            <Link
              href="/support/understanding-extrahand/getting-started"
              className="bg-white rounded-xl p-6 border-2 border-gray-200 hover:border-blue-400 hover:shadow-lg transition-all group"
            >
              <h4 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                Getting Started with ExtraHand
              </h4>
              <p className="text-sm text-gray-600">Learn how to create your first task</p>
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
