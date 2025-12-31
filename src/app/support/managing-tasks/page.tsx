'use client';

import { useState } from 'react';
import Link from 'next/link';
import { FileText, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'How to post a task',
    description: 'Step-by-step guide to creating and posting your first task on ExtraHand.',
    readTime: '6 min read',
    lastUpdated: '1 week ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to post a task</h2>
        <p className="text-gray-700 mb-4">
          Posting a task on ExtraHand is quick and easy. Follow these steps to get help with anything you need.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 1: Click "Post a Task"</h3>
        <p className="text-gray-700 mb-4">
          From your dashboard or the main navigation, click the "Post a Task" button to begin.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 2: Select a Category</h3>
        <p className="text-gray-700 mb-4">
          Choose the category that best matches your task. This helps the right helpers find your task quickly.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Describe Your Task</h3>
        <p className="text-gray-700 mb-4">
          Provide a clear, detailed description of what you need done. Include specific requirements, location, date, and time preferences.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 4: Set Your Budget</h3>
        <p className="text-gray-700 mb-4">
          Enter your budget or hourly rate. You can also choose to receive offers and negotiate with helpers.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 5: Review and Post</h3>
        <p className="text-gray-700 mb-4">
          Review all details and click "Post Task". You'll start receiving offers from qualified helpers within minutes.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Editing and updating tasks',
    description: 'Learn how to modify task details, update requirements, and manage task status.',
    readTime: '4 min read',
    lastUpdated: '2 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Editing and updating tasks</h2>
        <p className="text-gray-700 mb-4">
          Need to make changes to a posted task? Here's how to edit and update your tasks.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Editing Before Assignment</h3>
        <p className="text-gray-700 mb-4">
          Before accepting an offer, you can edit task details at any time. Go to "My Tasks", select the task, and click "Edit Task".
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Making Changes After Assignment</h3>
        <p className="text-gray-700 mb-4">
          Once a helper is assigned, any changes must be agreed upon by both parties. Message the helper through the platform to discuss modifications.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Updating Task Status</h3>
        <p className="text-gray-700 mb-4">
          You can update task status to "In Progress", "Completed", or "Cancelled" depending on the situation. Each status change triggers notifications to the helper.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Cancellation Policy</h3>
        <p className="text-gray-700 mb-4">
          Cancellations within 24 hours of the scheduled start time may incur fees. Review our cancellation policy before making changes.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Task completion and review',
    description: 'Understand the process of marking tasks complete, releasing payment, and leaving reviews.',
    readTime: '5 min read',
    lastUpdated: '3 days ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task completion and review</h2>
        <p className="text-gray-700 mb-4">
          Properly completing tasks and leaving reviews helps maintain quality in the ExtraHand community.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Marking Tasks Complete</h3>
        <p className="text-gray-700 mb-4">
          Once the helper finishes the work, they'll mark the task as complete. You'll receive a notification to review and confirm completion.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Inspecting the Work</h3>
        <p className="text-gray-700 mb-4">
          Review the completed work carefully. If you're satisfied, mark it as complete. If there are issues, communicate with the helper to resolve them.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Releasing Payment</h3>
        <p className="text-gray-700 mb-4">
          Payment is automatically released when you confirm task completion. If no action is taken within 48 hours, payment releases automatically.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Leaving a Review</h3>
        <p className="text-gray-700 mb-4">
          After completion, leave a fair and honest review. Rate the helper's work quality, communication, and professionalism. Your feedback helps other customers.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: 'Task policies and guidelines',
    description: 'Important policies regarding task types, prohibited tasks, and platform guidelines.',
    readTime: '8 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Task policies and guidelines</h2>
        <p className="text-gray-700 mb-4">
          Understanding our task policies ensures a smooth experience for everyone on the platform.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Allowed Task Types</h3>
        <p className="text-gray-700 mb-4">
          ExtraHand supports a wide variety of tasks including cleaning, handyman services, delivery, admin work, creative services, and more.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Prohibited Tasks</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Tasks requiring professional licenses (unless helper is licensed)</li>
          <li>Illegal activities or anything violating local laws</li>
          <li>Tasks involving dangerous materials or conditions</li>
          <li>Adult services or inappropriate content</li>
          <li>Tasks that violate third-party intellectual property</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Safety Guidelines</h3>
        <p className="text-gray-700 mb-4">
          Always meet helpers in safe, public places when possible. Never share financial information outside the platform. Report suspicious behavior immediately.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Fair Pricing</h3>
        <p className="text-gray-700 mb-4">
          Set fair budgets that reflect the work required. Underpaying helpers hurts the community and may result in fewer quality offers.
        </p>
      </>
    )
  },
];

export default function ManagingTasksPage() {
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
            <span className="text-gray-700 font-medium">Managing Tasks</span>
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
