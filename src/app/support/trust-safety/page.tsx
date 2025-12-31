'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Safety guidelines for customers',
    description: 'Essential safety tips for working with helpers and protecting yourself during tasks.',
    readTime: '8 min read',
    lastUpdated: '1 week ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Safety guidelines for customers</h2>
        <p className="text-gray-700 mb-4">
          Your safety is our top priority. Follow these guidelines to ensure safe interactions with helpers.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Before the Task</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Review helper profiles, ratings, and reviews carefully</li>
          <li>Communicate task details clearly through the platform</li>
          <li>Verify helper identity when they arrive</li>
          <li>Trust your instincts - if something feels off, it probably is</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">During the Task</h3>
        <p className="text-gray-700 mb-4">
          Stay nearby during task completion when possible. Keep communications within the platform. Never share personal financial information or passwords.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Payment Safety</h3>
        <p className="text-gray-700 mb-4">
          Always pay through the ExtraHand platform. Never pay in cash or use external payment methods. Our secure payment system protects both parties.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Reporting Issues</h3>
        <p className="text-gray-700 mb-4">
          If you experience any safety concerns, inappropriate behavior, or suspicious activity, report it immediately through the platform. We take all reports seriously.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Privacy policy and data protection',
    description: 'Learn how we protect your personal information and maintain your privacy.',
    readTime: '10 min read',
    lastUpdated: '2 months ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Privacy policy and data protection</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand is committed to protecting your privacy and securing your personal information.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Information We Collect</h3>
        <p className="text-gray-700 mb-4">
          We collect information you provide during registration, task posting, and platform usage. This includes name, email, location, payment details, and task preferences.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How We Use Your Data</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Facilitate connections between customers and helpers</li>
          <li>Process payments and transactions</li>
          <li>Improve platform features and user experience</li>
          <li>Send important notifications and updates</li>
          <li>Ensure platform safety and prevent fraud</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Data Security</h3>
        <p className="text-gray-700 mb-4">
          We use industry-standard encryption and security measures to protect your data. Our systems are regularly audited and updated to maintain the highest security standards.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Your Privacy Rights</h3>
        <p className="text-gray-700 mb-4">
          You can access, update, or delete your personal information at any time. You have control over what information is shared and with whom.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'How to report issues',
    description: 'Step-by-step guide to reporting problems, suspicious activity, or policy violations.',
    readTime: '5 min read',
    lastUpdated: '3 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to report issues</h2>
        <p className="text-gray-700 mb-4">
          We take all reports seriously and investigate every issue promptly. Here's how to report problems on ExtraHand.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">What to Report</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Inappropriate behavior or communication</li>
          <li>Safety concerns or threatening situations</li>
          <li>Fraud or scam attempts</li>
          <li>Policy violations</li>
          <li>Payment issues or disputes</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How to Report</h3>
        <p className="text-gray-700 mb-4">
          Click the "Report" button on the user's profile or task page. Select the issue type and provide detailed information. Include screenshots or evidence if available.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">What Happens Next</h3>
        <p className="text-gray-700 mb-4">
          Our trust and safety team reviews all reports within 24 hours. We'll contact you for additional information if needed and take appropriate action based on our findings.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Emergency Situations</h3>
        <p className="text-gray-700 mb-4">
          If you're in immediate danger, contact local emergency services first. Then report the incident to ExtraHand for account-related actions.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: 'Dispute resolution process',
    description: 'Understanding how disputes are handled and how to reach fair resolutions.',
    readTime: '7 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Dispute resolution process</h2>
        <p className="text-gray-700 mb-4">
          Disputes happen, but we're here to help resolve them fairly and efficiently.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">When to Open a Dispute</h3>
        <p className="text-gray-700 mb-4">
          Open a dispute if the task wasn't completed as agreed, quality doesn't meet expectations, or there's a disagreement about payment or task details.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 1: Communicate First</h3>
        <p className="text-gray-700 mb-4">
          Try to resolve the issue directly with the helper through platform messaging. Many disputes are resolved through clear communication.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 2: File a Dispute</h3>
        <p className="text-gray-700 mb-4">
          If direct communication fails, file a formal dispute through your task page. Provide detailed explanation and supporting evidence (photos, messages, etc.).
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Mediation</h3>
        <p className="text-gray-700 mb-4">
          Our dispute resolution team reviews evidence from both parties and works to find a fair solution. This may include partial refunds, task completion requirements, or other remedies.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Final Decision</h3>
        <p className="text-gray-700 mb-4">
          Most disputes are resolved within 5-7 business days. Our decision is final and based on platform policies, evidence provided, and fairness to both parties.
        </p>
      </>
    )
  },
];

export default function TrustSafetyPage() {
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
            <span className="text-gray-700 font-medium">Trust & Safety</span>
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
