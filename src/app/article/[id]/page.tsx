import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchArticlesFromAPI, fetchArticleByIdFromAPI } from '@/data/articleAPI';
import { ArrowLeft, Clock, Eye, ThumbsUp, ThumbsDown, Share2, Bookmark, TrendingUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ArticleImage from '@/components/ArticleImage';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function generateStaticParams() {
  const articles = await fetchArticlesFromAPI();
  return articles.map((article: any) => ({
    id: article.id,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await fetchArticleByIdFromAPI(id);

  if (!article) {
    return {
      title: 'Article Not Found',
    };
  }

  return {
    title: `${article.title} | ExtraHand Help`,
    description: article.description,
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const article = await fetchArticleByIdFromAPI(id);
  const articles = await fetchArticlesFromAPI(); // Fetch all articles for related section

  if (!article) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white">
      {/* Breadcrumb & Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/articles"
              className="inline-flex items-center space-x-2 text-gray-600 hover:text-yellow-700 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span>Back to articles</span>
            </Link>

            <div className="flex items-center space-x-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Share">
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Bookmark">
                <Bookmark className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Article Header */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden mb-6 shadow-sm">
              {/* Article Image - Full Width at Top */}
              {article.imageUrl && (
                <div className="w-full">
                  <ArticleImage
                    src={article.imageUrl}
                    alt={article.title}
                    className="w-full h-auto max-h-[500px] object-cover"
                  />
                </div>
              )}

              <div className="p-6">
                <div className="flex items-center space-x-2 mb-3">
                  <span className="text-xs font-semibold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full">
                    {article.category}
                  </span>
                  <div className="flex items-center space-x-1.5 text-xs text-gray-500">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>Trending</span>
                  </div>
                </div>

                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                  {article.title}
                </h1>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                  {article.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center space-x-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {new Date(article.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Eye className="h-3.5 w-3.5" />
                      <span>{article.views.toLocaleString()} views</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-bold text-green-700">✓</span>
                    </div>
                    <span className="text-xs text-gray-600">Verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content with Enhanced Styling */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="prose max-w-none">
                <ReactMarkdown
                  components={{
                    h1: ({ children }: any) => (
                      <h1 className="text-xl font-bold text-gray-900 mb-4 mt-6 pb-2 border-b border-yellow-200">
                        {children}
                      </h1>
                    ),
                    h2: ({ children }: any) => (
                      <h2 className="text-lg font-bold text-gray-900 mb-3 mt-6 flex items-center space-x-2">
                        <span className="w-1 h-5 bg-yellow-500 rounded-full"></span>
                        <span>{children}</span>
                      </h2>
                    ),
                    h3: ({ children }: any) => (
                      <h3 className="text-base font-bold text-gray-900 mb-2 mt-4">
                        {children}
                      </h3>
                    ),
                    p: ({ children }: any) => (
                      <p className="text-gray-700 mb-4 leading-relaxed text-sm">{children}</p>
                    ),
                    ul: ({ children }: any) => (
                      <ul className="space-y-2 mb-4 ml-4">
                        {children}
                      </ul>
                    ),
                    li: ({ children }: any) => (
                      <li className="text-gray-700 flex items-start space-x-2 text-sm">
                        <span className="text-yellow-500 mt-1">●</span>
                        <span className="flex-1">{children}</span>
                      </li>
                    ),
                    ol: ({ children }: any) => (
                      <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700 text-sm">
                        {children}
                      </ol>
                    ),
                    strong: ({ children }: any) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    code: ({ children }: any) => (
                      <code className="bg-gray-100 text-pink-600 px-1.5 py-0.5 rounded font-mono text-xs">
                        {children}
                      </code>
                    ),
                    pre: ({ children }: any) => (
                      <pre className="bg-gray-900 text-gray-100 p-3 rounded-lg overflow-x-auto mb-4 text-xs">
                        {children}
                      </pre>
                    ),
                    blockquote: ({ children }: any) => (
                      <blockquote className="border-l-3 border-yellow-500 pl-3 py-2 mb-4 bg-yellow-50 rounded-r-lg italic text-gray-700 text-sm">
                        {children}
                      </blockquote>
                    ),
                    img: ({ src, alt }: any) => (
                      <ArticleImage
                        src={src || ''}
                        alt={alt || ''}
                        className="w-full h-auto rounded-lg shadow-md my-6"
                      />
                    ),
                    a: ({ children, href }: any) => (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-yellow-700 hover:text-yellow-800 underline decoration-2 decoration-yellow-300 hover:decoration-yellow-500 transition-colors"
                      >
                        {children}
                      </a>
                    ),
                  }}
                >
                  {article.content}
                </ReactMarkdown>
              </div>
            </div>

            {/* Feedback Section - Redesigned */}
            <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-6 mt-6">
              <h3 className="text-base font-bold text-gray-900 mb-3 text-center">
                Was this helpful?
              </h3>
              <div className="flex justify-center space-x-3">
                <button className="flex flex-col items-center space-y-1.5 px-6 py-3 bg-white hover:bg-green-50 text-gray-700 hover:text-green-700 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-green-300">
                  <ThumbsUp className="h-5 w-5" />
                  <span className="font-semibold text-sm">Yes</span>
                </button>
                <button className="flex flex-col items-center space-y-1.5 px-6 py-3 bg-white hover:bg-red-50 text-gray-700 hover:text-red-700 rounded-xl hover:shadow-md transition-all border border-transparent hover:border-red-300">
                  <ThumbsDown className="h-5 w-5" />
                  <span className="font-semibold text-sm">No</span>
                </button>
              </div>
              <p className="text-center text-xs text-gray-600 mt-3">
                Your feedback helps us improve our content
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Table of Contents */}
            <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 sticky top-24">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Quick Navigation</h3>
              <div className="space-y-2 text-xs">
                <a href="#" className="block text-gray-600 hover:text-yellow-700 hover:pl-2 transition-all py-1">
                  Overview
                </a>
                <a href="#" className="block text-gray-600 hover:text-yellow-700 hover:pl-2 transition-all py-1">
                  Step-by-step Guide
                </a>
                <a href="#" className="block text-gray-600 hover:text-yellow-700 hover:pl-2 transition-all py-1">
                  Tips & Best Practices
                </a>
                <a href="#" className="block text-gray-600 hover:text-yellow-700 hover:pl-2 transition-all py-1">
                  Common Questions
                </a>
              </div>
            </div>

            {/* Related Articles */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-2xl border border-yellow-200 p-5">
              <h3 className="text-sm font-bold text-gray-900 mb-3">Related Articles</h3>
              <div className="space-y-2">
                {articles.slice(0, 3).filter(a => a.id !== article.id).map((relatedArticle) => (
                  <Link
                    key={relatedArticle.id}
                    href={`/article/${relatedArticle.id}`}
                    className="block p-2.5 bg-white rounded-lg hover:shadow-md transition-all border border-gray-100 hover:border-yellow-300"
                  >
                    <h4 className="font-semibold text-gray-900 text-xs mb-1 line-clamp-2 leading-tight">
                      {relatedArticle.title}
                    </h4>
                    <p className="text-[10px] text-gray-500">{relatedArticle.category}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Contact Support CTA */}
        <div className="mt-8 bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500 rounded-2xl p-6 text-center shadow-lg">
          <h3 className="text-lg font-bold text-white mb-2">
            Still Have Questions?
          </h3>
          <p className="text-sm text-white/90 mb-4">
            Our support team is ready to assist you personally
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 py-2.5 bg-white text-gray-900 rounded-lg font-semibold text-sm hover:shadow-xl hover:scale-105 transition-all"
          >
            Contact Support Team
          </Link>
        </div>
      </div>
    </div>
  );
}
