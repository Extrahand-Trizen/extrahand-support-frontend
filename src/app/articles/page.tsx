import Link from 'next/link';
import { fetchArticlesFromAPI } from '@/data/articleAPI';
import { Clock, Eye } from 'lucide-react';
import ArticleImage from '@/components/ArticleImage';

export const metadata = {
  title: 'All Articles | ExtraHand Help Center',
  description: 'Browse all help articles and guides',
};

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ArticlesPage() {
  const articles = await fetchArticlesFromAPI();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">All Articles</h1>
        <p className="text-base text-gray-600">
          Browse through all our help articles and guides
        </p>
      </div>

      {articles.length === 0 ? (
        <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No Articles Found</h2>
          <p className="text-gray-600">
            Articles will appear here once they are published by administrators.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/article/${article.id}`}
              className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary hover:shadow-lg transition-all group"
            >
              <div className="flex flex-col sm:flex-row items-start gap-6">
                {/* Article Image Thumbnail */}
                {article.imageUrl && (
                  <div className="w-full sm:w-48 flex-shrink-0">
                    <ArticleImage
                      src={article.imageUrl}
                      alt={article.title}
                      className="w-full h-48 sm:h-32 object-cover rounded-lg shadow-sm"
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xs font-medium text-primary bg-yellow-100 px-2.5 py-0.5 rounded-full">
                      {article.category}
                    </span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                    {article.title}
                  </h2>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2 leading-relaxed">{article.description}</p>
                  <div className="text-xs text-gray-500 mb-3">
                    By <span className="font-medium text-gray-700">{article.author || 'ExtraHand Team'}</span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs sm:text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        {new Date(article.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
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
      )}
    </div>
  );
}
