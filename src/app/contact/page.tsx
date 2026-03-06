'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Mail, Phone, MessageCircle, Send, CheckCircle, ChevronDown, AlertCircle } from 'lucide-react';
import LiveChat from '@/components/LiveChat';
import { getTicketServiceBaseUrl } from '@/lib/ticketServiceUrl';



function ContactPageContent() {
  const searchParams = useSearchParams();
  const [isLiveChatOpen, setIsLiveChatOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    priority: 'medium'
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Prevent body scroll when chat is open
  useEffect(() => {
    if (isLiveChatOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isLiveChatOpen]);

  // Handle URL params for auto-fill and auto-submit
  useEffect(() => {
    const full_name = searchParams.get('full_name');
    const email = searchParams.get('email');
    const subject = searchParams.get('subject');
    const message = searchParams.get('message');
    // Priority might not be in URL, strict validation on fields

    if (full_name || email || subject || message) {
      const newData = {
        name: full_name || '',
        email: email || '',
        subject: subject || '',
        message: message || '',
        priority: 'medium'
      };
      setFormData(newData);

      // Auto-submit if all required fields are present
      if (full_name && email && subject && message) {
        submitInquiry(newData);
      }
    }
  }, [searchParams]);

  const submitInquiry = async (dataPayload: any) => {
    setLoading(true);
    setError('');

    try {
      // Map 'name' to 'full_name' if backend expects full_name
      const payload = {
        ...dataPayload,
        full_name: dataPayload.name // Backend likely expects full_name based on InquiryForm logic
      };

      const response = await fetch(`${getTicketServiceBaseUrl()}/api/inquiries`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitted(true);
        setFormData({ name: '', email: '', subject: '', message: '', priority: 'medium' });
        // Optional: Reset submitted state after delay, or keep success screen?
        // User liked "Message Logged" screen. We keep it. 
      } else {
        setError(data.error || 'Failed to submit message');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to submit message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    submitInquiry(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10 sm:mb-16 max-w-2xl mx-auto animate-fadeIn">
          <span className="text-[10px] font-bold text-amber-600 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest mb-4 inline-block">
            Support Center
          </span>
          <h1 className="text-3xl sm:text-4xl font-black text-gray-700 mb-5 bg-clip-text text-transparent">
            Let's solve it together.
          </h1>
          <p className="text-base sm:text-lg text-gray-500 font-medium leading-relaxed px-4 sm:px-0">
            Our expert team is on standby to help you with any questions or technical hurdles.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {/* Email Contact */}
          <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-50/50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-blue-100/50 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform duration-500">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Email Channels</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Global support within 24 hours</p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block w-full">
                <a
                  href="mailto:support@extrahand.in"
                  className="text-indigo-600 hover:text-indigo-800 font-bold text-sm tracking-tight break-all"
                >
                  support@extrahand.in
                </a>
              </div>
            </div>
          </div>

          {/* Phone Contact */}
          <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-green-50/50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-green-100/50 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform duration-500">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Voice Support</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Mon-Fri, 9AM-6PM IST</p>
              <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 inline-block w-full">
                <a
                  href="tel:+911234567890"
                  className="text-emerald-600 hover:text-emerald-800 font-bold text-sm"
                >
                  +91 123-456-7890
                </a>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="group relative bg-white rounded-3xl border border-gray-100 p-8 text-center hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-purple-50/50 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-purple-100/50 transition-colors"></div>
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-indigo-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/20 group-hover:scale-110 transition-transform duration-500">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Live Support</h3>
              <p className="text-sm text-gray-500 mb-6 font-medium">Instantly connect with an agent</p>
              <button
                onClick={() => setIsLiveChatOpen(true)}
                className="w-full py-3 bg-indigo-400 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-500 transition-colors"
              >
                Launch Chat
              </button>
            </div>
          </div>
        </div>

        {/* Live Chat Component */}
        <LiveChat isOpen={isLiveChatOpen} onClose={() => setIsLiveChatOpen(false)} />

        {/* Contact Form */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-white rounded-[1.5rem] sm:rounded-[2rem] border border-gray-100 p-6 sm:p-10 shadow-xl shadow-gray-200/40 relative overflow-hidden">
            {/* Subtle background flair */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-50/30 rounded-full -mr-32 -mt-32 blur-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-center space-x-3 mb-8">
                <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-400">
                  <Send className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-gray-900 capitalize tracking-tight">
                    Inquiry Desk
                  </h2>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Detailed assistance form</p>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-100 rounded-2xl p-4 mb-8 flex items-center space-x-3 text-red-600">
                  <div className="w-2 h-2 rounded-full bg-red-600 animate-pulse"></div>
                  <p className="text-sm font-bold tracking-tight">{error}</p>
                </div>
              )}

              {submitted ? (
                <div className="bg-amber-50/50 backdrop-blur-sm border border-amber-100 rounded-3xl p-10 text-center animate-fadeIn">
                  <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-amber-500/30">
                    <CheckCircle className="h-10 w-10 text-white" />
                  </div>
                  <h3 className="text-2xl font-black text-gray-900 mb-4">
                    Message Logged!
                  </h3>
                  <p className="text-gray-600 font-medium leading-relaxed max-w-sm mx-auto">
                    We've securely received your inquiry. One of our experts will review it and get back to you within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-8 px-6 py-3 bg-white text-amber-600 border border-amber-200 rounded-xl font-bold text-sm hover:bg-amber-50 transition-colors"
                  >
                    Submit Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label
                        htmlFor="name"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                      >
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-gray-900"
                        placeholder="e.g. Alexander Pierce"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                      >
                        Email Identifier
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-gray-900"
                        placeholder="alex@domain.com"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="subject"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Inquiry Subject
                    </label>
                    <div className="relative">
                      <select
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-bold text-gray-900 appearance-none cursor-pointer"
                      >
                        <option value="">Choose a specialized topic</option>
                        <option value="account">Account & Privacy Control</option>
                        <option value="payment">Financial & Billing Inquiry</option>
                        <option value="task">Service & Task Deployment</option>
                        <option value="safety">Safety & Verification Protocol</option>
                        <option value="technical">Platform & API Integration</option>
                        <option value="other">General Inquiry</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Priority Field Added */}
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">
                      Priority Level
                    </label>
                    <div className="grid grid-cols-4 gap-3">
                      {['low', 'medium', 'high', 'urgent'].map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setFormData({ ...formData, priority: p })}
                          className={`py-3 px-2 rounded-xl border-2 text-xs sm:text-sm font-bold capitalize transition-all ${formData.priority === p
                              ? 'bg-amber-500 border-amber-500 text-white shadow-lg shadow-amber-500/30'
                              : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200 hover:bg-gray-50'
                            }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      htmlFor="message"
                      className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1"
                    >
                      Contextual Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={6}
                      className="w-full px-5 py-4 bg-gray-50 border border-gray-100 rounded-3xl focus:bg-white focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 outline-none transition-all font-medium text-gray-900 resize-none"
                      placeholder="Please provide comprehensive details about your requirement..."
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-5 bg-gradient-to-br from-amber-400 to-amber-600 text-white rounded-2xl font-black text-base shadow-xl shadow-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/40 hover:-translate-y-0.5 active:translate-y-0 transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed uppercase tracking-widest"
                  >
                    {loading ? 'Transmitting...' : 'Dispatch Message'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ Link */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            Looking for quick answers? Check our frequently asked questions.
          </p>
          <a
            href="/articles"
            className="inline-block px-6 py-3 bg-white border-2 border-gray-200 text-gray-900 rounded-lg font-semibold hover:border-primary hover:shadow-lg transition-all"
          >
            Browse Help Articles
          </a>
        </div>
      </div>
    </div>
  );
}

export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ContactPageContent />
    </Suspense>
  );
}
