'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, ChevronRight, Home, FileText } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'What is ExtraHand?',
    description: 'Learn about ExtraHand platform, our mission, and how we connect people who need help with trusted local helpers.',
    readTime: '5 min read',
    lastUpdated: '8 months ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">What is ExtraHand?</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand is a trusted community platform that connects people who need to outsource tasks and find local services, with people looking to earn money and ready to work.
        </p>
        <p className="text-gray-700 mb-4">
          Customers post what needs to be done, receive offers from trusted Taskers in minutes, and choose the best person.
        </p>
        <p className="text-gray-700 mb-6">
          From simple to complicated tasks, ExtraHand can help complete home cleaning, handyman tasks, admin work, photography, graphic design or even build a website.
        </p>
        <p className="text-gray-700 mb-4">
          Go online or download the app and start earning at ExtraHand!
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Is ExtraHand available in my country?',
    description: 'Check which countries and cities ExtraHand currently operates in and learn about our expansion plans.',
    readTime: '3 min read',
    lastUpdated: '2 years ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Is ExtraHand available in my country?</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand is currently available in multiple countries and expanding rapidly.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Currently Available In:</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>United States - Major cities including New York, Los Angeles, Chicago, Houston</li>
          <li>United Kingdom - London, Manchester, Birmingham, Edinburgh</li>
          <li>Australia - Sydney, Melbourne, Brisbane, Perth</li>
          <li>Canada - Toronto, Vancouver, Montreal, Calgary</li>
        </ul>
        <p className="text-gray-700 mb-4">
          We're constantly working on expanding to new cities and countries. Check back regularly for updates!
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Getting Started with ExtraHand',
    description: 'Step-by-step guide to creating your account, posting your first task, and finding the perfect helper.',
    readTime: '7 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Getting Started with ExtraHand</h2>
        <p className="text-gray-700 mb-4">
          Welcome to ExtraHand! Getting started is easy. Follow these simple steps:
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 1: Create Your Account</h3>
        <p className="text-gray-700 mb-4">
          Sign up with your email address or social media account. Verify your email to activate your account.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 2: Post Your First Task</h3>
        <p className="text-gray-700 mb-4">
          Click "Post a Task" and describe what you need help with. Include details like location, date, and budget.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Review Offers</h3>
        <p className="text-gray-700 mb-4">
          Receive offers from qualified helpers within minutes. Review their profiles, ratings, and prices.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 4: Choose Your Helper</h3>
        <p className="text-gray-700 mb-4">
          Select the best person for your task and confirm the booking. Payment is held securely until the task is complete.
        </p>
      </>
    )
  },
];

export default function UnderstandingExtraHandPage() {
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
            <span className="text-gray-700 font-medium">Understanding ExtraHand</span>
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
