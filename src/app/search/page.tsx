'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { searchArticles } from '@/data/articles';
import { Search, ArrowLeft, Clock, Eye } from 'lucide-react';
import { Suspense } from 'react';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const results = query ? searchArticles(query) : [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        href="/"
        className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-dark transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to home</span>
      </Link>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Search Results
        </h1>
        <p className="text-xl text-gray-600">
          {results.length > 0
            ? `Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`
            : `No results found for "${query}"`}
        </p>
      </div>

      {results.length > 0 ? (
        <div className="grid gap-6">
          {results.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-primary bg-yellow-100 px-3 py-1 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-gray-600 mb-4">{article.description}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(article.updatedAt).toLocaleDateString(
                          'en-US',
                          {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          }
                        )}
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="h-4 w-4" />
                      <span>{article.views} views</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <Search className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No results found
          </h3>
          <p className="text-gray-600 mb-6">
            Try different keywords or browse our categories
          </p>
          <Link
            href="/"
            className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            Browse Categories
          </Link>
        </div>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">Loading...</div>}>
      <SearchResults />
    </Suspense>
  );
}
