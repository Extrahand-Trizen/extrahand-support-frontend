'use client';

import HierarchicalCategoryContent from '@/components/HierarchicalCategoryContent';
import { FileText } from 'lucide-react';

export default function ManagingTasksPage() {
  return <HierarchicalCategoryContent categoryName="Managing Tasks" icon={FileText} />;
}

