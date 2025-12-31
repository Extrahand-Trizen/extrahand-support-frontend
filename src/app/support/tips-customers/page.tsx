'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Lightbulb, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'Choosing the right helper',
    description: 'Tips for selecting qualified helpers based on reviews, ratings, and past experience.',
    readTime: '6 min read',
    lastUpdated: '2 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Choosing the right helper</h2>
        <p className="text-gray-700 mb-4">
          Selecting the right helper is crucial for task success. Follow these tips to make the best choice.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Review Profiles Carefully</h3>
        <p className="text-gray-700 mb-4">
          Check helper profiles for relevant experience, skills, certifications, and portfolio work. Look for helpers who specialize in your type of task.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Check Ratings and Reviews</h3>
        <p className="text-gray-700 mb-4">
          Read reviews from previous customers. Look for consistent positive feedback, particularly for tasks similar to yours. Pay attention to ratings for reliability, quality, and communication.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Verify Credentials</h3>
        <p className="text-gray-700 mb-4">
          For specialized tasks, verify that helpers have necessary licenses, certifications, or qualifications. Check verification badges on profiles.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Compare Multiple Offers</h3>
        <p className="text-gray-700 mb-4">
          Don't accept the first offer. Compare multiple helpers based on price, experience, availability, and communication style. The cheapest isn't always the best.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Ask Questions</h3>
        <p className="text-gray-700 mb-4">
          Message helpers before hiring to clarify details, ask about their approach, and assess their communication. A responsive, professional helper is usually reliable.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Effective communication tips',
    description: 'Best practices for communicating with helpers to ensure task success.',
    readTime: '5 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Effective communication tips</h2>
        <p className="text-gray-700 mb-4">
          Clear communication prevents misunderstandings and ensures successful task completion.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Be Clear and Specific</h3>
        <p className="text-gray-700 mb-4">
          Provide detailed task descriptions including what needs to be done, where, when, and any special requirements. Include photos if helpful.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Set Expectations Early</h3>
        <p className="text-gray-700 mb-4">
          Discuss timelines, quality standards, and deliverables upfront. Clarify any ambiguous points before work begins.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Respond Promptly</h3>
        <p className="text-gray-700 mb-4">
          Reply to helper messages quickly, especially during task execution. Timely communication prevents delays and confusion.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Use Platform Messaging</h3>
        <p className="text-gray-700 mb-4">
          Keep all communications within the ExtraHand platform for security and record-keeping. This protects both parties if disputes arise.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Be Respectful and Professional</h3>
        <p className="text-gray-700 mb-4">
          Treat helpers with respect. Polite, professional communication fosters better working relationships and higher quality results.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Provide Feedback</h3>
        <p className="text-gray-700 mb-4">
          Give constructive feedback during and after the task. If something isn't right, communicate clearly and give helpers a chance to make it right.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Quality assurance guidelines',
    description: 'How to ensure high-quality work and set clear expectations with helpers.',
    readTime: '7 min read',
    lastUpdated: '3 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quality assurance guidelines</h2>
        <p className="text-gray-700 mb-4">
          Ensuring quality work starts with clear expectations and proper oversight.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Define Quality Standards</h3>
        <p className="text-gray-700 mb-4">
          Clearly specify what "done" looks like. Provide examples, photos, or detailed descriptions of expected results. The more specific, the better.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Set Milestones for Larger Tasks</h3>
        <p className="text-gray-700 mb-4">
          Break big projects into checkpoints. Review work at each milestone before proceeding. This prevents costly mistakes and ensures alignment.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Inspect Work Before Release</h3>
        <p className="text-gray-700 mb-4">
          Always review completed work before releasing payment. Check that all requirements are met and quality meets expectations.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Document Everything</h3>
        <p className="text-gray-700 mb-4">
          Take photos before and after tasks. Keep records of agreements, changes, and completion. This protects both parties and provides evidence if needed.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Address Issues Promptly</h3>
        <p className="text-gray-700 mb-4">
          If work doesn't meet standards, communicate immediately. Give specific feedback and allow helpers to correct issues before leaving negative reviews.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Leave Honest Reviews</h3>
        <p className="text-gray-700 mb-4">
          Your reviews help future customers. Be fair and honest, highlighting both strengths and areas for improvement. Quality helpers appreciate constructive feedback.
        </p>
      </>
    )
  },
];

export default function TipsCustomersPage() {
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
            <span className="text-gray-700 font-medium">Tips for Customers</span>
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
