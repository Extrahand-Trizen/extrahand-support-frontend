export interface Article {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  subCategory?: string;
  subSubCategory?: string;
  imageUrl?: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  articleCount: number;
}
