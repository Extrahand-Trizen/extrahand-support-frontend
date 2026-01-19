'use client';

import DynamicCategoryContent from '@/components/DynamicCategoryContent';
import { Lightbulb } from 'lucide-react';

export default function TipsCustomersPage() {
  return <DynamicCategoryContent categoryName="Tips for Customers" icon={Lightbulb} />;
}

