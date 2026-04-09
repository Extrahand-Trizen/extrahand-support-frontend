import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacy Policy | ExtraHand Support',
  description: 'Privacy Policy for the ExtraHand Support portal.',
};

const LAST_UPDATED = 'April 2, 2026';

export default function PrivacyPolicyPage() {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Privacy Policy</h1>
        <p className="mt-3 text-sm text-gray-600">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8 text-gray-700 leading-7">
          <div>
            <h2 className="text-xl font-bold text-gray-900">1. Scope</h2>
            <p className="mt-2">
              This policy explains how data is collected, used, stored, and protected when you use the
              ExtraHand Support portal, including support forms, account authentication in support,
              and help-center interactions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">2. Information We Collect</h2>
            <p className="mt-2">We may collect the following categories of information:</p>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Basic identity details such as name and email address.</li>
              <li>Support request details, issue descriptions, and uploaded context.</li>
              <li>Technical metadata such as IP address, browser type, and request timestamps.</li>
              <li>Account security and session information needed for authentication.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">3. How We Use Information</h2>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>To respond to inquiries and resolve support requests.</li>
              <li>To maintain account security and prevent abuse.</li>
              <li>To improve support quality, response times, and help content.</li>
              <li>To comply with legal obligations and enforce platform policies.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">4. Sharing and Disclosure</h2>
            <p className="mt-2">
              We do not sell personal information. Data may be shared only with authorized service
              providers, internal teams supporting your request, or where disclosure is required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">5. Data Security and Retention</h2>
            <p className="mt-2">
              We apply reasonable technical and organizational safeguards to protect support data.
              Information is retained only as long as needed for support operations, legal compliance,
              and dispute handling.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">6. Your Choices</h2>
            <p className="mt-2">You may request access, correction, or deletion of personal data where applicable.</p>
            <p className="mt-2">For privacy requests, contact support@extrahand.in.</p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">7. Policy Updates</h2>
            <p className="mt-2">
              We may update this policy from time to time. Material changes will be reflected by updating
              the date at the top of this page.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}