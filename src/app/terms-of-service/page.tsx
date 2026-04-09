import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service | ExtraHand Support',
  description: 'Terms of Service for the ExtraHand Support portal.',
};

const LAST_UPDATED = 'April 2, 2026';

export default function TermsOfServicePage() {
  return (
    <section className="bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900">Terms of Service</h1>
        <p className="mt-3 text-sm text-gray-600">Last updated: {LAST_UPDATED}</p>

        <div className="mt-8 space-y-8 text-gray-700 leading-7">
          <div>
            <h2 className="text-xl font-bold text-gray-900">1. Acceptance of Terms</h2>
            <p className="mt-2">
              By accessing or using the ExtraHand Support portal, you agree to these terms.
              If you do not agree, please do not use the service.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">2. Purpose of the Support Portal</h2>
            <p className="mt-2">
              The portal is provided to help users access knowledge articles, submit support requests,
              and manage support-related account actions.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">3. User Responsibilities</h2>
            <ul className="mt-3 list-disc pl-6 space-y-2">
              <li>Provide accurate and complete information in support requests.</li>
              <li>Do not submit unlawful, abusive, or misleading content.</li>
              <li>Do not attempt to disrupt, probe, or misuse the support systems.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">4. Account and Security</h2>
            <p className="mt-2">
              You are responsible for maintaining the confidentiality of your account credentials and
              activities under your account. Notify support immediately if you suspect unauthorized use.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">5. Content and Availability</h2>
            <p className="mt-2">
              Support content is provided for informational purposes and may be updated periodically.
              We do not guarantee uninterrupted availability and may modify features as needed.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">6. Limitation of Liability</h2>
            <p className="mt-2">
              To the extent permitted by law, ExtraHand is not liable for indirect or consequential losses
              arising from use of the support portal.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">7. Changes to Terms</h2>
            <p className="mt-2">
              We may update these terms at any time. Continued use of the portal after updates means
              you accept the revised terms.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-bold text-gray-900">8. Contact</h2>
            <p className="mt-2">Questions about these terms can be sent to support@extrahand.in.</p>
          </div>
        </div>
      </div>
    </section>
  );
}