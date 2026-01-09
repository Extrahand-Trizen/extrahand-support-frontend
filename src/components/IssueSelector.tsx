'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, ArrowLeft, Check } from 'lucide-react';

interface IssueType {
  id: string;
  label: string;
}

interface IssueCategory {
  id: string;
  label: string;
  icon: string;
  types: IssueType[];
}

const ISSUE_CATEGORIES: IssueCategory[] = [
  {
    id: 'account_issues',
    label: 'Account & Login',
    icon: '👤',
    types: [
      { id: 'login_issue', label: 'Unable to login to my account' },
      { id: 'reset_password', label: 'Need to reset my password' },
      { id: 'account_access', label: 'Account access or security issue' },
      { id: 'update_profile', label: 'Update profile information' },
      { id: 'delete_account', label: 'Delete or deactivate my account' }
    ]
  },
  {
    id: 'service_issues',
    label: 'Service & Support',
    icon: '🛠️',
    types: [
      { id: 'service_request', label: 'Request a new service' },
      { id: 'service_quality', label: 'Report service quality issue' },
      { id: 'service_delay', label: 'Service delayed or not completed' },
      { id: 'reschedule_service', label: 'Reschedule or cancel service' },
      { id: 'worker_behavior', label: 'Worker behavior or professionalism issue' }
    ]
  },
  {
    id: 'booking_issues',
    label: 'Booking & Scheduling',
    icon: '📅',
    types: [
      { id: 'booking_help', label: 'Help with making a booking' },
      { id: 'modify_booking', label: 'Modify or change existing booking' },
      { id: 'cancel_booking', label: 'Cancel a booking' },
      { id: 'booking_confirmation', label: 'Booking confirmation not received' },
      { id: 'availability', label: 'Check service availability' }
    ]
  },
  {
    id: 'payment_billing',
    label: 'Payment & Billing',
    icon: '💳',
    types: [
      { id: 'payment_issue', label: 'Payment not processed or failed' },
      { id: 'refund_request', label: 'Request a refund' },
      { id: 'billing_query', label: 'Question about my bill or charges' },
      { id: 'payment_methods', label: 'Payment methods and options' },
      { id: 'invoice_receipt', label: 'Need invoice or receipt' }
    ]
  },
  {
    id: 'technical',
    label: 'Technical Support',
    icon: '🔧',
    types: [
      { id: 'app_issue', label: 'App not working properly' },
      { id: 'website_issue', label: 'Website loading or display issues' },
      { id: 'notification_issue', label: 'Not receiving notifications' },
      { id: 'sync_issue', label: 'Data sync or update problems' },
      { id: 'feature_help', label: 'Help using a feature' }
    ]
  },
  {
    id: 'general',
    label: 'General Inquiry',
    icon: '💬',
    types: [
      { id: 'service_info', label: 'Information about services' },
      { id: 'pricing_info', label: 'Pricing and packages' },
      { id: 'business_hours', label: 'Business hours and availability' },
      { id: 'feedback', label: 'Provide feedback or suggestion' },
      { id: 'complaint', label: 'File a complaint' },
      { id: 'other', label: 'Other inquiry' }
    ]
  }
];

interface IssueSelectorProps {
  onSelect: (category: string, type: string, categoryLabel: string, typeLabel: string) => void;
  onBack?: () => void;
}

export default function IssueSelector({ onSelect, onBack }: IssueSelectorProps) {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      setSelectedCategory(categoryId);
    }
  };

  const handleTypeSelect = (category: IssueCategory, type: IssueType) => {
    onSelect(category.id, type.id, category.label, type.label);
  };

  const selectedCategoryData = ISSUE_CATEGORIES.find(c => c.id === selectedCategory);

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
          )}
          <div>
            <h2 className="text-xl font-bold text-gray-900">Help & Support</h2>
            <p className="text-sm text-gray-600">Select your issue to get started</p>
          </div>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {ISSUE_CATEGORIES.map((category) => (
            <div key={category.id} className="border border-gray-200 rounded-lg overflow-hidden">
              {/* Category Header */}
              <button
                onClick={() => handleCategoryClick(category.id)}
                className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-2xl">{category.icon}</span>
                  <span className="font-medium text-gray-900">{category.label}</span>
                </div>
                {expandedCategory === category.id ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>

              {/* Category Types */}
              {expandedCategory === category.id && (
                <div className="border-t border-gray-200 bg-gray-50">
                  {category.types.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => handleTypeSelect(category, type)}
                      className="w-full text-left px-4 py-3 hover:bg-white transition-colors border-b border-gray-100 last:border-b-0 flex items-center justify-between group"
                    >
                      <span className="text-gray-700 group-hover:text-gray-900">
                        {type.label}
                      </span>
                      <ChevronRight className="h-4 w-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
        <p className="text-xs text-gray-600 text-center">
          Select an issue category to connect with our support team
        </p>
      </div>
    </div>
  );
}
