'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchArticlesByCategoryFromAPI } from '@/data/articleAPI';
import { Article } from '@/types';
import ArticleImage from './ArticleImage';

interface DynamicCategoryContentProps {
    categoryName: string;
    icon: any;
}

export default function DynamicCategoryContent({ categoryName, icon: Icon }: DynamicCategoryContentProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await fetchArticlesByCategoryFromAPI(categoryName);
                setArticles(fetchedArticles);
                if (fetchedArticles.length > 0) {
                    setSelectedArticle(fetchedArticles[0]);
                }
            } catch (error) {
                console.error('Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [categoryName]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-yellow-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading articles...</p>
                </div>
            </div>
        );
    }

    if (articles.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-4">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-yellow-600 hover:text-yellow-700 flex items-center font-medium">
                                <Home className="h-4 w-4 mr-1" />
                                Support Centre
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700 font-medium">{categoryName}</span>
                        </nav>
                    </div>
                </div>
                <div className="max-w-4xl mx-auto px-4 py-20 text-center">
                    <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100">
                        <div className="w-20 h-20 bg-yellow-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Icon className="h-10 w-10 text-yellow-600" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Articles Found</h2>
                        <p className="text-gray-600 mb-8 max-w-md mx-auto">
                            We haven't posted any articles for this category yet. Please check back later or contact our support team.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center px-6 py-3 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all font-bold shadow-lg shadow-yellow-200"
                        >
                            Back to Support Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-white via-yellow-50/20 to-white">
            {/* Breadcrumb */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex items-center space-x-2 text-sm">
                        <Link href="/" className="text-yellow-600 hover:text-yellow-700 flex items-center font-bold">
                            <Home className="h-4 w-4 mr-1" />
                            Support Centre
                        </Link>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                        <span className="text-gray-700 font-bold">{categoryName}</span>
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Left Sidebar - Articles in this section */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl p-6 sticky top-24 border border-gray-100 shadow-xl shadow-gray-100/50">
                            <div className="flex items-center space-x-2 mb-6 pb-4 border-b border-gray-100">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <Icon className="h-5 w-5 text-yellow-700" />
                                </div>
                                <h3 className="text-base font-bold text-gray-900">Articles in this section</h3>
                            </div>
                            <div className="space-y-1">
                                {articles.sort((a, b) => a.title.localeCompare(b.title)).map((article: Article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => {
                                            setSelectedArticle(article);
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }}
                                        className={`block w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 group border-2 ${selectedArticle?.id === article.id
                                            ? 'bg-white text-gray-900 font-bold border-gray-900 shadow-md ring-2 ring-gray-900/5'
                                            : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 border-transparent'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="line-clamp-2 capitalize break-words">{article.title.toLowerCase()}</span>
                                            {selectedArticle?.id === article.id && <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full shadow-sm"></div>}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Main Article Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-xl shadow-gray-100/50">
                            {selectedArticle && (
                                <div className="mb-8">
                                    <div className="flex items-center space-x-2 mb-4">
                                        <span className="text-xs font-bold text-yellow-700 bg-yellow-100 px-3 py-1 rounded-full uppercase tracking-wider">
                                            {selectedArticle.category}
                                        </span>
                                        <span className="text-xs text-gray-400 font-medium">
                                            {selectedArticle.views.toLocaleString()} views
                                        </span>
                                    </div>

                                    <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 leading-tight">
                                        {selectedArticle.title}
                                    </h1>

                                    <p className="text-lg text-gray-600 mb-8 font-medium leading-relaxed italic border-l-4 border-yellow-400 pl-4">
                                        {selectedArticle.description}
                                    </p>

                                    {selectedArticle.imageUrl && (
                                        <div className="mb-8 rounded-2xl overflow-hidden shadow-2xl border border-gray-100 ring-4 ring-gray-50">
                                            <ArticleImage
                                                src={selectedArticle.imageUrl}
                                                alt={selectedArticle.title}
                                                className="w-full h-auto max-h-[500px] object-cover"
                                            />
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="prose max-w-none break-words overflow-hidden">
                                <ReactMarkdown
                                    components={{
                                        h1: ({ children }: any) => (
                                            <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 mb-8 pb-4 border-b border-gray-100">
                                                {children}
                                            </h1>
                                        ),
                                        h2: ({ children }: any) => (
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 mt-10 flex items-center space-x-3">
                                                <span className="w-1 h-6 bg-yellow-500 rounded-full"></span>
                                                <span>{children}</span>
                                            </h2>
                                        ),
                                        h3: ({ children }: any) => (
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 mt-8">
                                                {children}
                                            </h3>
                                        ),
                                        p: ({ children }: any) => (
                                            <p className="text-gray-700 mb-6 leading-relaxed text-base md:text-lg">{children}</p>
                                        ),
                                        ul: ({ children }: any) => (
                                            <ul className="space-y-4 mb-8 ml-4">
                                                {children}
                                            </ul>
                                        ),
                                        li: ({ children }: any) => (
                                            <li className="text-gray-700 flex items-start space-x-3 text-base md:text-lg">
                                                <span className="text-yellow-500 mt-2 flex-shrink-0 w-1.5 h-1.5 rounded-full bg-yellow-500"></span>
                                                <span className="flex-1">{children}</span>
                                            </li>
                                        ),
                                        strong: ({ children }: any) => (
                                            <strong className="font-bold text-gray-900">
                                                {children}
                                            </strong>
                                        ),
                                    }}
                                >
                                    {selectedArticle?.content || ''}
                                </ReactMarkdown>
                            </div>

                            <div className="mt-12 pt-8 border-t border-gray-100">
                                <div className="flex items-center justify-between text-sm">
                                    <div className="flex items-center text-gray-500 bg-gray-50 px-3 py-1.5 rounded-full font-medium">
                                        <span className="mr-2">5 min read</span>
                                        <span className="w-1 h-1 bg-gray-300 rounded-full mx-2"></span>
                                        <span>Updated {selectedArticle ? new Date(selectedArticle.updatedAt).toLocaleDateString() : ''}</span>
                                    </div>
                                    <div className="flex items-center text-yellow-700 font-bold bg-yellow-50 px-3 py-1.5 rounded-full">
                                        <span className="mr-1">✓</span>
                                        <span>Verified Guide</span>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 pt-8 border-t border-gray-100 bg-gray-50/50 -mx-8 px-8 pb-8 rounded-b-2xl">
                                <p className="text-base font-bold text-gray-900 mb-6 text-center">Was this article helpful to you?</p>
                                <div className="flex justify-center gap-4">
                                    <button className="flex-1 max-w-[120px] px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-green-50 hover:border-green-300 hover:text-green-700 hover:scale-105 transition-all shadow-sm">
                                        Yes
                                    </button>
                                    <button className="flex-1 max-w-[120px] px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-red-50 hover:border-red-300 hover:text-red-700 hover:scale-105 transition-all shadow-sm">
                                        No
                                    </button>
                                </div>
                            </div>

                            <div className="mt-10 text-center">
                                <Link
                                    href="/"
                                    className="inline-flex items-center px-8 py-3.5 bg-yellow-600 text-white rounded-xl hover:bg-yellow-700 transition-all font-bold shadow-lg shadow-yellow-200 hover:scale-105"
                                >
                                    Back to All Categories
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
