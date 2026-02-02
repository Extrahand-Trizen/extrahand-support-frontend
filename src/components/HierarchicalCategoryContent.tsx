'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { fetchArticlesByCategoryFromAPI } from '@/data/articleAPI';
import { Article } from '@/types';
import ArticleImage from './ArticleImage';

interface HierarchicalCategoryContentProps {
    categoryName: string;
    icon: any;
}

export default function HierarchicalCategoryContent({ categoryName, icon: Icon }: HierarchicalCategoryContentProps) {
    const [articles, setArticles] = useState<Article[]>([]);
    const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
    const [selectedSubSubCategory, setSelectedSubSubCategory] = useState<string | null>(null);
    const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const fetchedArticles = await fetchArticlesByCategoryFromAPI(categoryName);
                console.log('✅ Fetched articles:', fetchedArticles);
                console.log('📊 Total articles:', fetchedArticles.length);
                if (fetchedArticles.length > 0) {
                    console.log('📄 First article:', fetchedArticles[0]);
                }
                setArticles(fetchedArticles);
            } catch (error) {
                console.error('❌ Error fetching articles:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchArticles();
    }, [categoryName]);

    // Get unique subcategories
    const subCategories = Array.from(
        new Set(articles.filter(a => a.subCategory).map(a => a.subCategory))
    ).filter(Boolean) as string[];
    
    // Debug: Log subcategories
    if (articles.length > 0) {
        console.log('📚 Articles with subCategory:', articles.filter(a => a.subCategory).length);
        console.log('🏷️ Unique subcategories:', subCategories);
    }

    // Get sub-subcategories for selected subcategory
    const subSubCategories = selectedSubCategory
        ? Array.from(
            new Set(
                articles
                    .filter(a => a.subCategory === selectedSubCategory && a.subSubCategory)
                    .map(a => a.subSubCategory)
            )
        ).filter(Boolean) as string[]
        : [];

    // Get articles for the selected sub-subcategory
    const filteredArticles = articles.filter(a => {
        if (selectedSubCategory && selectedSubSubCategory) {
            return a.subCategory === selectedSubCategory && a.subSubCategory === selectedSubSubCategory;
        }
        return false;
    });

    const handleSubCategorySelect = (subCategory: string) => {
        // If this subcategory only has one sub-subcategory which in turn has one article,
        // shortcut directly to the article view to avoid an extra click.
        const subSubCats = Array.from(
            new Set(
                articles
                    .filter(a => a.subCategory === subCategory && a.subSubCategory)
                    .map(a => a.subSubCategory)
            )
        ).filter(Boolean) as string[];

        if (subSubCats.length === 1) {
            const subs = articles.filter(a => a.subCategory === subCategory && a.subSubCategory === subSubCats[0]);
            if (subs.length === 1) {
                setSelectedSubCategory(subCategory);
                setSelectedSubSubCategory(subSubCats[0]);
                setSelectedArticle(subs[0]);
                return;
            }
        }

        setSelectedSubCategory(subCategory);
        setSelectedSubSubCategory(null);
        setSelectedArticle(null);
    };

    const handleSubSubCategorySelect = (subSubCategory: string) => {
        // If this sub-subcategory contains exactly one article, open it directly.
        const subs = articles.filter(a => a.subCategory === selectedSubCategory && a.subSubCategory === subSubCategory);
        if (subs.length === 1) {
            setSelectedSubSubCategory(subSubCategory);
            setSelectedArticle(subs[0]);
            return;
        }

        setSelectedSubSubCategory(subSubCategory);
        setSelectedArticle(null);
    };

    const handleArticleSelect = (article: Article) => {
        setSelectedArticle(article);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleBackToCategory = () => {
        setSelectedSubCategory(null);
        setSelectedSubSubCategory(null);
        setSelectedArticle(null);
    };

    const handleBackToSubCategory = () => {
        setSelectedSubSubCategory(null);
        setSelectedArticle(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <Loader2 className="h-10 w-10 animate-spin text-yellow-600 mx-auto mb-4" />
                    <p className="text-gray-600 font-medium">Loading category...</p>
                </div>
            </div>
        );
    }

    // Show subcategories (Level 1)
    if (!selectedSubCategory) {
        if (subCategories.length === 0) {
            // If no subcategories, show "No articles" message
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

        // Show subcategories as clickable sections
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm mb-8">
                            <Link href="/" className="text-yellow-600 hover:text-yellow-700">
                                ExtraHand Support Centre
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{categoryName}</span>
                        </nav>

                        <h1 className="text-3xl font-bold text-gray-900 mb-12">{categoryName}</h1>

                        <div className="space-y-8">
                            {subCategories.map((subCategory) => (
                                <button
                                    key={subCategory}
                                    onClick={() => handleSubCategorySelect(subCategory)}
                                    className="block w-full text-left group"
                                >
                                    <h2 className="text-xl font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">
                                        {subCategory}
                                    </h2>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show sub-subcategories for selected subcategory (Level 2)
    if (selectedSubCategory && !selectedSubSubCategory) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm mb-8">
                            <Link href="/" className="text-yellow-600 hover:text-yellow-700">
                                ExtraHand Support Centre
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={handleBackToCategory} className="text-yellow-600 hover:text-yellow-700">
                                {categoryName}
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{selectedSubCategory}</span>
                        </nav>

                        <h1 className="text-3xl font-bold text-gray-900 mb-12">{selectedSubCategory}</h1>

                        <div className="space-y-6">
                            {subSubCategories.length > 0 ? (
                                subSubCategories.map((subSubCategory) => (
                                    <button
                                        key={subSubCategory}
                                        onClick={() => handleSubSubCategorySelect(subSubCategory)}
                                        className="block w-full text-left group"
                                    >
                                        <h2 className="text-lg font-normal text-gray-900 group-hover:text-yellow-600 transition-colors">
                                            {subSubCategory}
                                        </h2>
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-600">No topics available in this section.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show articles list for selected sub-subcategory (Level 3)
    if (selectedSubCategory && selectedSubSubCategory && !selectedArticle) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-4xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm mb-8">
                            <Link href="/" className="text-yellow-600 hover:text-yellow-700">
                                ExtraHand Support Centre
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={handleBackToCategory} className="text-yellow-600 hover:text-yellow-700">
                                {categoryName}
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={handleBackToSubCategory} className="text-yellow-600 hover:text-yellow-700">
                                {selectedSubCategory}
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <span className="text-gray-700">{selectedSubSubCategory}</span>
                        </nav>

                        <h1 className="text-3xl font-bold text-gray-900 mb-12">{selectedSubSubCategory}</h1>

                        <div className="space-y-6">
                            {filteredArticles.length > 0 ? (
                                filteredArticles.map((article) => (
                                    <button
                                        key={article.id}
                                        onClick={() => handleArticleSelect(article)}
                                        className="block w-full text-left group"
                                    >
                                        <h2 className="text-lg font-normal text-gray-900 group-hover:text-yellow-600 transition-colors">
                                            {article.title}
                                        </h2>
                                    </button>
                                ))
                            ) : (
                                <p className="text-gray-600">No articles available in this section.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Show article with sidebar (Level 4)
    if (selectedArticle) {
        return (
            <div className="min-h-screen bg-white">
                <div className="bg-white border-b border-gray-200">
                    <div className="max-w-6xl mx-auto px-4 py-6">
                        <nav className="flex items-center space-x-2 text-sm">
                            <Link href="/" className="text-yellow-600 hover:text-yellow-700">
                                ExtraHand Support Centre
                            </Link>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={handleBackToCategory} className="text-yellow-600 hover:text-yellow-700">
                                {categoryName}
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={handleBackToSubCategory} className="text-yellow-600 hover:text-yellow-700">
                                {selectedSubCategory}
                            </button>
                            <ChevronRight className="h-4 w-4 text-gray-400" />
                            <button onClick={() => setSelectedArticle(null)} className="text-yellow-600 hover:text-yellow-700">
                                {selectedSubSubCategory}
                            </button>
                        </nav>
                    </div>
                </div>

                <div className="max-w-6xl mx-auto px-4 py-12">
                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Left Sidebar - Articles in this section */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Articles in this section</h3>
                                <div className="space-y-1">
                                    {filteredArticles.map((article) => (
                                        <button
                                            key={article.id}
                                            onClick={() => handleArticleSelect(article)}
                                            className={`block w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                                                selectedArticle?.id === article.id
                                                    ? 'text-yellow-600 font-medium bg-yellow-50'
                                                    : 'text-gray-700 hover:bg-gray-50'
                                            }`}
                                        >
                                            {article.title}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Article Content */}
                        <div className="lg:col-span-3">
                            <ArticleDisplay article={selectedArticle} />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}

// Article Display Component (Airtasker style)
function ArticleDisplay({ article }: { article: Article }) {
    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">{article.title}</h1>
            
            <div className="flex items-center space-x-4 text-sm text-gray-600 mb-8">
                <span className="font-medium text-gray-700">By {article.author || 'ExtraHand Team'}</span>
                <span>·</span>
                <span>{new Date(article.updatedAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                <span>·</span>
                <span>Updated</span>
            </div>

            {article.imageUrl && (
                <div className="mb-8">
                    <ArticleImage
                        src={article.imageUrl}
                        alt={article.title}
                        className="w-full h-auto rounded-lg"
                    />
                </div>
            )}

            <div className="prose prose-lg max-w-none">
                <ReactMarkdown
                    components={{
                        h1: ({ children }: any) => (
                            <h1 className="text-3xl font-bold text-gray-900 mt-8 mb-4">
                                {children}
                            </h1>
                        ),
                        h2: ({ children }: any) => (
                            <h2 className="text-2xl font-semibold text-gray-900 mt-6 mb-3">
                                {children}
                            </h2>
                        ),
                        h3: ({ children }: any) => (
                            <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-3">
                                {children}
                            </h3>
                        ),
                        p: ({ children }: any) => (
                            <p className="text-gray-700 mb-4 leading-relaxed">{children}</p>
                        ),
                        ul: ({ children }: any) => (
                            <ul className="list-disc list-inside space-y-2 mb-4 text-gray-700">
                                {children}
                            </ul>
                        ),
                        li: ({ children }: any) => (
                            <li className="text-gray-700">{children}</li>
                        ),
                        strong: ({ children }: any) => (
                            <strong className="font-semibold text-gray-900">
                                {children}
                            </strong>
                        ),
                        a: ({ children, href }: any) => (
                            <a href={href} className="text-yellow-600 hover:text-yellow-700 underline">
                                {children}
                            </a>
                        ),
                    }}
                >
                    {article.content || ''}
                </ReactMarkdown>
            </div>
        </div>
    );
}
