'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Platform guidelines overview',
    description: 'Comprehensive overview of ExtraHand platform rules and community standards.',
    readTime: '10 min read',
    lastUpdated: '2 months ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Platform guidelines overview</h2>
        <p className="text-gray-700 mb-4">
          ExtraHand is built on trust, respect, and community. These guidelines ensure a positive experience for everyone.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Core Principles</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Treat all community members with respect and professionalism</li>
          <li>Communicate clearly and honestly</li>
          <li>Honor commitments and agreements</li>
          <li>Maintain safety and security standards</li>
          <li>Follow local laws and regulations</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Account Responsibilities</h3>
        <p className="text-gray-700 mb-4">
          You are responsible for maintaining account security, providing accurate information, and keeping profile details up to date. Never share account credentials.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Task Posting Standards</h3>
        <p className="text-gray-700 mb-4">
          Tasks must be clearly described, legally compliant, and fairly priced. Prohibited tasks include illegal activities, dangerous work, and inappropriate services.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Consequences of Violations</h3>
        <p className="text-gray-700 mb-4">
          Violations may result in warnings, account suspension, or permanent removal from the platform. Serious violations may be reported to authorities.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Terms of service',
    description: 'Legal terms and conditions for using ExtraHand services.',
    readTime: '15 min read',
    lastUpdated: '3 months ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Terms of service</h2>
        <p className="text-gray-700 mb-4">
          By using ExtraHand, you agree to these terms of service. Please read carefully.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Agreement to Terms</h3>
        <p className="text-gray-700 mb-4">
          These terms constitute a legally binding agreement between you and ExtraHand. Use of the platform indicates acceptance of these terms.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Platform Services</h3>
        <p className="text-gray-700 mb-4">
          ExtraHand provides a marketplace platform connecting customers with service providers. We do not employ helpers or directly provide services.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">User Obligations</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Provide accurate and truthful information</li>
          <li>Comply with all applicable laws and regulations</li>
          <li>Respect intellectual property rights</li>
          <li>Not misuse or attempt to circumvent platform features</li>
          <li>Pay all fees and charges as agreed</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Limitation of Liability</h3>
        <p className="text-gray-700 mb-4">
          ExtraHand is not liable for disputes between users, quality of services provided, or actions of platform users. Our liability is limited as described in the full terms.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Changes to Terms</h3>
        <p className="text-gray-700 mb-4">
          We reserve the right to modify these terms at any time. Users will be notified of significant changes. Continued use after changes constitutes acceptance.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Acceptable use policy',
    description: 'Guidelines on what activities are permitted and prohibited on our platform.',
    readTime: '8 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Acceptable use policy</h2>
        <p className="text-gray-700 mb-4">
          This policy defines acceptable and prohibited uses of the ExtraHand platform.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Permitted Uses</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Posting legitimate tasks and service requests</li>
          <li>Offering services within your skills and qualifications</li>
          <li>Communicating professionally with other users</li>
          <li>Leaving honest reviews and feedback</li>
          <li>Using platform features as intended</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Prohibited Activities</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Posting illegal, dangerous, or inappropriate tasks</li>
          <li>Harassment, discrimination, or abusive behavior</li>
          <li>Fraud, scams, or deceptive practices</li>
          <li>Circumventing fees or payment systems</li>
          <li>Spam, solicitation, or unauthorized advertising</li>
          <li>Impersonation or misrepresentation</li>
          <li>Attempting to hack or compromise platform security</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Content Standards</h3>
        <p className="text-gray-700 mb-4">
          All content must be appropriate, lawful, and respectful. No offensive language, hate speech, explicit content, or copyrighted material without permission.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Enforcement</h3>
        <p className="text-gray-700 mb-4">
          We monitor platform activity and investigate reports of policy violations. Violations result in content removal, account restrictions, or permanent bans.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: 'Community code of conduct',
    description: 'Expected behavior and etiquette for all ExtraHand community members.',
    readTime: '6 min read',
    lastUpdated: '2 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Community code of conduct</h2>
        <p className="text-gray-700 mb-4">
          Our community thrives when everyone treats each other with respect and professionalism.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Respect and Courtesy</h3>
        <p className="text-gray-700 mb-4">
          Treat all community members with kindness and respect. Be patient, understanding, and professional in all interactions. No harassment, discrimination, or bullying.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Clear Communication</h3>
        <p className="text-gray-700 mb-4">
          Communicate clearly and promptly. Set realistic expectations, respond to messages in a timely manner, and be transparent about capabilities and limitations.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Reliability and Commitment</h3>
        <p className="text-gray-700 mb-4">
          Honor your commitments. Show up on time, complete tasks as agreed, and communicate proactively if issues arise. Cancel only when absolutely necessary.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Honest Reviews</h3>
        <p className="text-gray-700 mb-4">
          Leave fair, honest reviews based on actual experiences. Don't manipulate ratings or review systems. Both positive and constructive feedback help the community.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Building Trust</h3>
        <p className="text-gray-700 mb-4">
          Trust is the foundation of our community. Be honest, transparent, and ethical in all dealings. Report suspicious behavior and help maintain platform integrity.
        </p>
      </>
    )
  },
];

export default function GuidelinesPage() {
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
            <span className="text-gray-700 font-medium">ExtraHand Guidelines</span>
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
