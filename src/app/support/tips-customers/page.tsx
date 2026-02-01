'use client';

import HierarchicalCategoryContent from '@/components/HierarchicalCategoryContent';
import { Lightbulb } from 'lucide-react';

export default function TipsCustomersPage() {
  return <HierarchicalCategoryContent categoryName="Tips for Customers" icon={Lightbulb} />;
}

