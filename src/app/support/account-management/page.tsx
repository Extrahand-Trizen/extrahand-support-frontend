'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Users, ChevronRight, Home } from 'lucide-react';

const articles = [
  {
    id: 1,
    title: 'How to create an account',
    description: 'Step-by-step guide to signing up for ExtraHand and getting your account verified.',
    readTime: '4 min read',
    lastUpdated: '2 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">How to create an account</h2>
        <p className="text-gray-700 mb-4">
          Creating an ExtraHand account is quick and easy. Follow these simple steps to get started:
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 1: Visit the Sign Up Page</h3>
        <p className="text-gray-700 mb-4">
          Navigate to the ExtraHand website or open the mobile app and click on the "Sign Up" button.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 2: Enter Your Details</h3>
        <p className="text-gray-700 mb-4">
          Provide your full name, email address, and create a secure password. You can also sign up using your Google or Facebook account for faster registration.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Verify Your Email</h3>
        <p className="text-gray-700 mb-4">
          Check your inbox for a verification email from ExtraHand. Click the verification link to activate your account.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 4: Complete Your Profile</h3>
        <p className="text-gray-700 mb-4">
          Add a profile photo, phone number, and other details to help build trust within the community.
        </p>
      </>
    )
  },
  {
    id: 2,
    title: 'Managing your profile settings',
    description: 'Update your personal information, preferences, and notification settings.',
    readTime: '5 min read',
    lastUpdated: '1 month ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing your profile settings</h2>
        <p className="text-gray-700 mb-4">
          Keep your ExtraHand profile up to date to ensure smooth communication and transactions.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Accessing Your Profile</h3>
        <p className="text-gray-700 mb-4">
          Click on your profile icon in the top right corner and select "Profile Settings" from the dropdown menu.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Updating Personal Information</h3>
        <p className="text-gray-700 mb-4">
          You can update your name, email, phone number, profile photo, and bio at any time. Make sure to save your changes.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Notification Preferences</h3>
        <p className="text-gray-700 mb-4">
          Customize how you receive notifications - via email, SMS, or push notifications. Choose what types of updates you want to receive.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Privacy Settings</h3>
        <p className="text-gray-700 mb-4">
          Control who can see your profile information and activity. Adjust your privacy preferences based on your comfort level.
        </p>
      </>
    )
  },
  {
    id: 3,
    title: 'Account verification process',
    description: 'Learn how to verify your identity and increase your account trust score.',
    readTime: '6 min read',
    lastUpdated: '3 weeks ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Account verification process</h2>
        <p className="text-gray-700 mb-4">
          Verification helps build trust in the ExtraHand community and unlocks additional features.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Why Verify Your Account?</h3>
        <p className="text-gray-700 mb-4">
          Verified accounts have access to more features, build trust with other users, and are prioritized in search results.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Verification Methods</h3>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-2">
          <li>Email verification (required for all accounts)</li>
          <li>Phone number verification via SMS code</li>
          <li>Government-issued ID verification</li>
          <li>Social media account linking</li>
        </ul>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">How to Verify</h3>
        <p className="text-gray-700 mb-4">
          Go to your profile settings and click on "Verification". Follow the prompts to complete each verification method. Most verifications are instant or take less than 24 hours.
        </p>
      </>
    )
  },
  {
    id: 4,
    title: 'Resetting your password',
    description: 'Forgot your password? Learn how to reset it securely.',
    readTime: '3 min read',
    lastUpdated: '1 week ago',
    content: (
      <>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Resetting your password</h2>
        <p className="text-gray-700 mb-4">
          If you've forgotten your password, don't worry! Follow these steps to reset it securely.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 1: Visit the Login Page</h3>
        <p className="text-gray-700 mb-4">
          Go to the ExtraHand login page and click on "Forgot Password?" below the login form.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 2: Enter Your Email</h3>
        <p className="text-gray-700 mb-4">
          Provide the email address associated with your ExtraHand account. You'll receive a password reset link within a few minutes.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Step 3: Create a New Password</h3>
        <p className="text-gray-700 mb-4">
          Click the link in the email and enter your new password. Make sure it's strong and secure - use a combination of letters, numbers, and symbols.
        </p>
        <h3 className="text-xl font-semibold text-gray-900 mb-3 mt-6">Security Tips</h3>
        <p className="text-gray-700 mb-4">
          Never share your password with anyone. Use a unique password for ExtraHand that you don't use on other websites. Consider using a password manager for added security.
        </p>
      </>
    )
  },
];

export default function AccountManagementPage() {
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
            <span className="text-gray-700 font-medium">Login/Account Management</span>
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
