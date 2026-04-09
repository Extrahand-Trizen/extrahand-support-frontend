import Link from 'next/link';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Youtube } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold bg-gradient-to-r from-yellow-600 to-amber-600 bg-clip-text text-transparent mb-4">
              ExtraHand
            </h3>
            <p className="text-gray-600 text-sm mb-4">
              Your trusted task marketplace connecting people who need help with skilled helpers.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/profile.php?id=61587931868799" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors" aria-label="Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://x.com/ExtrahandI42141" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors" aria-label="X (Twitter)">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://www.instagram.com/extrahand.in/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors" aria-label="Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://www.linkedin.com/company/112403995/admin/dashboard/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </a>
              <a href="https://www.youtube.com/channel/UCHCIU5Qq0mEdGf8RgJIjCUw" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-primary-dark transition-colors" aria-label="YouTube">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-gray-600 hover:text-primary-dark transition-colors">
                  All Articles
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Contact Support
                </Link>
              </li>
            </ul>
          </div>

          {/* Help Topics */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Help Topics</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/support/understanding-extrahand" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Understanding ExtraHand
                </Link>
              </li>
              <li>
                <Link href="/support/account-management" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Login/Account Management
                </Link>
              </li>
              <li>
                <Link href="/support/payments-refunds" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Payments & Refunds
                </Link>
              </li>
              <li>
                <Link href="/support/managing-tasks" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Managing Tasks
                </Link>
              </li>
              <li>
                <Link href="/support/tips-customers" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Tips for Customers
                </Link>
              </li>
              <li>
                <Link href="/support/trust-safety" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Trust & Safety
                </Link>
              </li>
              <li>
                <Link href="/support/guidelines" className="text-gray-600 hover:text-primary-dark transition-colors">
                  Extrahand Guidelines
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Us</h4>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <a href="mailto:support@extrahand.in" className="hover:text-primary-dark transition-colors">
                  support@extrahand.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-gray-600">
          <p>&copy; {currentYear} ExtraHand. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link href="/privacy-policy" className="hover:text-primary-dark transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-primary-dark transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
