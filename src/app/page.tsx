'use client';

import Link from 'next/link';
import {
  Search, BookOpen, CreditCard, Shield, Users, FileText,
  MessageCircle, Sparkles, TrendingUp, Clock,
  CheckCircle2, ChevronDown, ChevronRight, Zap, Award,
  HeartHandshake, Lightbulb, Bot, X, Loader2, ArrowRight
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { searchArticles } from '@/data/articles';

const INITIAL_CATEGORIES = [
  {
    title: 'Understanding ExtraHand',
    description: 'Learn about our platform and services',
    icon: BookOpen,
    href: '/support/understanding-extrahand',
    color: 'from-blue-400 to-blue-600',
    key: 'Understanding ExtraHand'
  },
  {
    title: 'Login/Account Management',
    description: 'Manage your profile, settings & verification',
    icon: Users,
    href: '/support/account-management',
    color: 'from-purple-400 to-purple-600',
    key: 'Login/Account Management'
  },
  {
    title: 'Payments & Refunds',
    description: 'Billing, payment methods & refund policies',
    icon: CreditCard,
    href: '/support/payments-refunds',
    color: 'from-green-400 to-green-600',
    key: 'Payments & Refunds'
  },
  {
    title: 'Managing Tasks',
    description: 'Create, edit & complete tasks efficiently',
    icon: FileText,
    href: '/support/managing-tasks',
    color: 'from-orange-400 to-orange-600',
    key: 'Managing Tasks'
  },
  {
    title: 'Tips for Customers',
    description: 'Expert advice & best practices',
    icon: Lightbulb,
    href: '/support/tips-customers',
    color: 'from-yellow-400 to-yellow-600',
    key: 'Tips for Customers'
  },
  {
    title: 'Trust & Safety',
    description: 'Security, privacy & community guidelines',
    icon: Shield,
    href: '/support/trust-safety',
    color: 'from-red-400 to-red-600',
    key: 'Trust & Safety'
  },
];



const faqs = [
  {
    question: 'How do I create an account on ExtraHand?',
    answer: 'Click "Sign Up" in the top right corner, enter your email, create a password, and verify your email address. You can also sign up using Google or Facebook for faster registration.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit/debit cards (Visa, Mastercard, Amex), PayPal, Apple Pay, Google Pay, and bank transfers for larger transactions. All payments are secured with bank-level encryption.',
  },
  {
    question: 'How do I get a refund?',
    answer: 'If you are not satisfied with the work, contact our support team within 48 hours. We will review your case and process eligible refunds within 3-5 business days. Our refund policy protects both customers and helpers.',
  },
  {
    question: 'Is ExtraHand available in my area?',
    answer: 'ExtraHand operates in major cities across India. Check our coverage map on the homepage to see if we serve your location. We are constantly expanding to new areas!',
  },
  {
    question: 'How are helpers verified?',
    answer: 'All helpers go through identity verification, background checks, and skill assessments. We also use a review system where past customers rate their experience, ensuring quality and safety.',
  },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const { getApiBaseUrl } = await import('@/lib/apiBaseUrl');
        const API_BASE_URL = await getApiBaseUrl();
        const response = await fetch(`${API_BASE_URL}/api/articles`);
        const result = await response.json();
        if (result.success) {
          setArticles(result.data);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  // Featured guides will be the top 3 most viewed articles
  const featuredGuides = articles
    .sort((aAny: any, bAny: any) => (bAny.views || 0) - (aAny.views || 0))
    .slice(0, 3)
    .map((article: any) => ({
      title: article.title,
      description: article.description,
      category: article.category,
      href: `/article/${article._id}`,
      readTime: '5 min read',
      icon: Sparkles,
    }));

  const getArticlesForCategory = (categoryKey: string) => {
    return articles
      .filter(article => article.category === categoryKey)
      .slice(0, 3);
  };

  useEffect(() => {
    if (searchQuery.trim().length > 0) {
      // Use dynamic articles for search suggestions
      const results = articles.filter(
        article =>
          article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          article.description.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5);
      setSuggestions(results);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [searchQuery, articles]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setShowSuggestions(false);
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  const getTabClassName = (tab: string) => {
    const isActive = activeTab === tab;
    return `px-6 py-3 rounded-full font-semibold transition-all ${isActive
      ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 shadow-lg'
      : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
      }`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50/30 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-100/50 via-amber-100/30 to-orange-100/50">
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-300/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-amber-300/20 rounded-full blur-3xl animate-pulse"></div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center space-x-2 bg-white border-2 border-yellow-300 rounded-full px-4 py-2 mb-6 shadow-sm">
              <Sparkles className="h-4 w-4 text-yellow-600" />
              <span className="text-sm font-semibold text-gray-700">24/7 Support Available</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold text-gray-900 mb-4 leading-tight">
              Need Help?
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 via-amber-600 to-orange-600">
                We've Got You Covered
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
              Get instant answers, explore guides, or connect with our support team
            </p>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
            <div className="relative group" ref={searchRef}>
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-white rounded-2xl shadow-xl">
                <Search className="absolute left-6 top-1/2 transform -translate-y-1/2 text-gray-400 h-6 w-6 z-10" />
                <input
                  type="text"
                  placeholder="Search articles, guides, FAQs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => searchQuery.trim() && setShowSuggestions(true)}
                  className="w-full pl-12 sm:pl-16 pr-6 py-4 sm:py-5 rounded-2xl text-base sm:text-lg focus:outline-none focus:ring-4 focus:ring-yellow-200 relative z-10"
                  autoComplete="off"
                />
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-yellow-200 overflow-hidden z-50 animate-slideDown">
                  <div className="p-3 bg-yellow-50 border-b border-yellow-200">
                    <p className="text-sm font-semibold text-gray-700">Top articles results</p>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    {suggestions.map((article) => (
                      <Link
                        key={article._id || article.id}
                        href={`/article/${article._id || article.id}`}
                        onClick={() => {
                          setShowSuggestions(false);
                          setSearchQuery('');
                        }}
                        className="block px-6 py-4 hover:bg-yellow-50 transition-colors border-b border-gray-100 last:border-b-0 group"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-xs font-medium text-yellow-700 bg-yellow-100 px-2 py-1 rounded-full">
                                {article.category}
                              </span>
                            </div>
                            <h3 className="text-base font-bold text-gray-900 group-hover:text-yellow-700 transition-colors mb-1">
                              {article.title}
                            </h3>
                            <p className="text-sm text-gray-600 line-clamp-2">
                              {article.description}
                            </p>
                          </div>
                          <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-yellow-600 transition-colors flex-shrink-0 ml-3 mt-1" />
                        </div>
                      </Link>
                    ))}
                  </div>
                  {suggestions.length > 0 && (
                    <div className="p-3 bg-gray-50 border-t border-gray-200">
                      <button
                        type="submit"
                        onClick={(e) => {
                          e.preventDefault();
                          setShowSuggestions(false);
                          window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
                        }}
                        className="w-full text-center text-sm font-semibold text-yellow-700 hover:text-yellow-800 transition-colors flex items-center justify-center space-x-2"
                      >
                        <span>View all results for "{searchQuery}"</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {showSuggestions && suggestions.length === 0 && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 overflow-hidden z-50 animate-slideDown p-6 text-center">
                  <Search className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">No articles found for "{searchQuery}"</p>
                  <p className="text-xs text-gray-500 mt-1">Try different keywords</p>
                </div>
              )}
            </div>
          </form>

          {/* Quick Search Hint */}
          <div className="max-w-3xl mx-auto mb-8 text-center">
            <p className="text-sm text-gray-500">
              Try searching: "payment", "account", "verification", or "task"
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-yellow-600">500+</div>
              <div className="text-sm text-gray-600">Help Articles</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-amber-600">24/7</div>
              <div className="text-sm text-gray-600">Support</div>
            </div>
            <div className="bg-white/80 backdrop-blur rounded-xl p-4 text-center border border-gray-200">
              <div className="text-2xl sm:text-3xl font-bold text-orange-600">98%</div>
              <div className="text-sm text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Categories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Browse by Category</h2>
          <p className="text-gray-600">Find answers quickly with our organized support topics</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {INITIAL_CATEGORIES.map((category) => {
            const Icon = category.icon;
            const categoryArticles = getArticlesForCategory(category.key);

            return (
              <Link
                key={category.href}
                href={category.href}
                className="group bg-white rounded-xl p-5 hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-yellow-300"
              >
                <div className="flex items-start space-x-3 mb-3">
                  <div className={`w-11 h-11 bg-gradient-to-br ${category.color} rounded-xl flex items-center justify-center flex-shrink-0 shadow-md group-hover:shadow-lg transition-all`}>
                    <Icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-base font-bold text-gray-900 group-hover:text-yellow-700 transition-colors leading-tight">
                      {category.title}
                    </h3>
                  </div>
                </div>

                <p className="text-xs text-gray-600 mb-3">
                  {category.description}
                </p>

                <div className="space-y-1">
                  {loading ? (
                    <div className="animate-pulse space-y-2">
                      <div className="h-3 bg-gray-100 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-100 rounded w-1/2"></div>
                    </div>
                  ) : categoryArticles.length > 0 ? (
                    categoryArticles.map((article, idx) => (
                      <div key={article._id || idx} className="flex items-center text-xs text-gray-500">
                        <ChevronRight className="h-3 w-3 mr-1 text-gray-400 group-hover:text-yellow-600 transition-colors" />
                        <span className="group-hover:text-gray-700 transition-colors line-clamp-1">{article.title}</span>
                      </div>
                    ))
                  ) : (
                    <div className="text-xs text-gray-400 italic">No articles yet</div>
                  )}
                </div>

                <div className="flex items-center text-yellow-600 font-semibold text-xs group-hover:text-yellow-700 mt-3">
                  <span>Explore topics</span>
                  <ChevronRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Guides */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Guides</h2>
              <p className="text-gray-600">Handpicked resources to get you started</p>
            </div>
            <Link
              href="/articles"
              className="hidden md:flex items-center space-x-2 text-yellow-700 hover:text-yellow-800 font-semibold group"
            >
              <span>View all articles</span>
              <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {featuredGuides.map((guide) => {
              const Icon = guide.icon;
              return (
                <Link
                  key={guide.href}
                  href={guide.href}
                  className="group bg-white rounded-2xl p-6 hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-yellow-300"
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-100 to-amber-100 rounded-xl flex items-center justify-center">
                      <Icon className="h-6 w-6 text-yellow-700" />
                    </div>
                    <span className="text-sm font-medium text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                      {guide.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-yellow-700 transition-colors">
                    {guide.title}
                  </h3>
                  <p className="text-gray-600 mb-4">{guide.description}</p>

                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="h-4 w-4 mr-1" />
                    {guide.readTime}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-yellow-100 rounded-full px-4 py-2 mb-4">
            <MessageCircle className="h-4 w-4 text-yellow-700" />
            <span className="text-sm font-semibold text-yellow-700">Frequently Asked</span>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Common Questions</h2>
          <p className="text-lg text-gray-600">Quick answers to questions you may have</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isExpanded = expandedFaq === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:border-yellow-300 transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(isExpanded ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-yellow-50 transition-colors"
                >
                  <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                  <ChevronDown
                    className={`h-5 w-5 text-yellow-600 flex-shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''
                      }`}
                  />
                </button>

                {isExpanded && (
                  <div className="px-6 pb-5 text-gray-600 leading-relaxed animate-slideDown">
                    <div className="pt-2 border-t border-gray-100">
                      {faq.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/articles"
            className="inline-flex items-center space-x-2 text-yellow-700 hover:text-yellow-800 font-semibold"
          >
            <span>See more FAQs</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 shadow-xl border border-yellow-200">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-yellow-200 to-orange-200 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-amber-200 to-yellow-200 rounded-full blur-3xl"></div>
          </div>

          <div className="relative px-8 md:px-16 py-12 md:py-16">
            <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
              <div>
                <div className="inline-flex items-center space-x-2 bg-white/60 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-yellow-300/50">
                  <HeartHandshake className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-semibold text-amber-800">We're Here for You</span>
                </div>

                <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                  Can't Find What You Need?
                </h2>
                <p className="text-xl text-gray-700 mb-8 leading-relaxed">
                  Our dedicated support team is ready to help you 24/7. Get personalized assistance within minutes.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/contact"
                    className="group inline-flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 rounded-xl font-bold hover:shadow-xl hover:shadow-yellow-400/30 hover:scale-105 transition-all"
                  >
                    <MessageCircle className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                    <span>Contact Support</span>
                  </Link>
                  <a
                    href="mailto:support@extrahand.in"
                    className="inline-flex items-center justify-center space-x-2 px-8 py-4 bg-white/80 backdrop-blur border-2 border-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-white transition-all"
                  >
                    <span>Email Us</span>
                  </a>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Zap className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{'< 2min'}</div>
                  <div className="text-gray-600 text-sm">Avg Response Time</div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <CheckCircle2 className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">98%</div>
                  <div className="text-gray-600 text-sm">Issue Resolution</div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Users className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">50k+</div>
                  <div className="text-gray-600 text-sm">Happy Customers</div>
                </div>

                <div className="group bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-yellow-200 hover:border-yellow-400 hover:shadow-lg transition-all">
                  <div className="bg-gradient-to-br from-yellow-400 to-orange-500 w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <Award className="h-6 w-6 text-gray-900" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">4.9/5</div>
                  <div className="text-gray-600 text-sm">Support Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
