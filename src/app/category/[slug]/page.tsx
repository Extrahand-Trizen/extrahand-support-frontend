import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getArticlesByCategory } from '@/data/articles';
import { ArrowLeft, Clock, Eye } from 'lucide-react';

const categoryInfo: Record<string, { title: string; description: string }> = {
  'understanding-extrahand': {
    title: 'Understanding ExtraHand',
    description: 'Learn the basics of how ExtraHand works',
  },
  'account-management': {
    title: 'Account Management',
    description: 'Manage your account and login settings',
  },
  'payments-refunds': {
    title: 'Payments & Refunds',
    description: 'Payment methods, refunds, and billing',
  },
  'managing-tasks': {
    title: 'Managing Tasks',
    description: 'Post, manage, and complete tasks',
  },
  'tips-customers': {
    title: 'Tips for Customers',
    description: 'Best practices for posting tasks',
  },
  'trust-safety': {
    title: 'Trust & Safety',
    description: 'Stay safe on ExtraHand',
  },
};

export function generateStaticParams() {
  return Object.keys(categoryInfo).map((slug) => ({
    slug,
  }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = categoryInfo[slug];

  if (!info) {
    return {
      title: 'Category Not Found',
    };
  }

  return {
    title: `${info.title} | ExtraHand Help`,
    description: info.description,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const info = categoryInfo[slug];

  if (!info) {
    notFound();
  }

  // Get articles for this category
  const articles = getArticlesByCategory(info.title);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <Link
          href="/"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-primary-dark transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to home</span>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">{info.title}</h1>
          <p className="text-lg sm:text-xl text-gray-600">{info.description}</p>
        </div>

        {articles.length > 0 ? (
          <div className="grid gap-6">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={`/article/${article.id}`}
                className="bg-white rounded-xl border-2 border-gray-200 p-6 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 group-hover:text-primary-dark transition-colors">
                      {article.title}
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 mb-4">{article.description}</p>
                    <div className="flex items-center space-x-4 text-sm ">
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
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No articles yet
            </h3>
            <p className="text-gray-600 mb-6">
              Articles for this category will be added soon.
            </p>
            <Link
              href="/"
              className="inline-block px-6 py-3 bg-gradient-to-r from-primary to-primary-dark text-gray-900 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              Browse Other Categories
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
