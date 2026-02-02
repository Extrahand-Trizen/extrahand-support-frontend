import { Article } from '@/types';
import { getArticlesApiBaseUrl } from '@/lib/apiBaseUrl';

export async function fetchArticlesFromAPI(): Promise<Article[]> {
  try {
    const API_BASE_URL = await getArticlesApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/articles`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch articles from API:', response.status);
      return [];
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('Invalid API response format');
      return [];
    }

    // Transform API response to match Article type with validation
    const articles: Article[] = result.data
      .filter((article: any) => article && article._id && article.title)
      .map((article: any) => ({
        id: article._id,
        title: article.title,
        description: article.description || '',
        category: article.category || 'Uncategorized',
        subCategory: article.subCategory ?? article.subcategory ?? undefined,
        subSubCategory: article.subSubCategory ?? article.subSubcategory ?? undefined,
        imageUrl: article.imageUrl || undefined,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        views: article.views || 0,
        content: article.content || '',
      }));

    return articles;
  } catch (error) {
    console.error('Error fetching articles from API:', error);
    return [];
  }
}

export async function fetchArticlesByCategoryFromAPI(category: string): Promise<Article[]> {
  try {
    const API_BASE_URL = await getArticlesApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/articles?category=${encodeURIComponent(category)}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch articles by category from API:', response.status);
      return [];
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('Invalid API response format');
      return [];
    }

    const articles: Article[] = result.data
      .filter((article: any) => article && article._id && article.title)
      .map((article: any) => ({
        id: article._id,
        title: article.title,
        description: article.description || '',
        category: article.category || 'Uncategorized',
        subCategory: article.subCategory ?? article.subcategory ?? undefined,
        subSubCategory: article.subSubCategory ?? article.subSubcategory ?? undefined,
        imageUrl: article.imageUrl || undefined,
        createdAt: article.createdAt,
        updatedAt: article.updatedAt,
        views: article.views || 0,
        content: article.content || '',
      }));

    return articles;
  } catch (error) {
    console.error('Error fetching articles by category from API:', error);
    return [];
  }
}

export async function fetchArticleByIdFromAPI(id: string): Promise<Article | null> {
  try {
    const API_BASE_URL = await getArticlesApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/articles/${id}`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch article from API:', response.status);
      return null;
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('Invalid API response format');
      return null;
    }

    const article = result.data;

    return {
      id: article._id,
      title: article.title,
      description: article.description,
      category: article.category,
      subCategory: article.subCategory ?? article.subcategory ?? undefined,
      subSubCategory: article.subSubCategory ?? article.subSubcategory ?? undefined,
      imageUrl: article.imageUrl,
      createdAt: article.createdAt,
      updatedAt: article.updatedAt,
      views: article.views,
      content: article.content,
    };
  } catch (error) {
    console.error('Error fetching article from API:', error);
    return null;
  }
}

export async function fetchCategoriesFromAPI(): Promise<string[]> {
  try {
    const API_BASE_URL = await getArticlesApiBaseUrl();
    const response = await fetch(`${API_BASE_URL}/api/articles/categories/list`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Failed to fetch categories from API:', response.status);
      return [];
    }

    const result = await response.json();

    if (!result.success || !result.data) {
      console.error('Invalid API response format');
      return [];
    }

    return result.data;
  } catch (error) {
    console.error('Error fetching categories from API:', error);
    return [];
  }
}









