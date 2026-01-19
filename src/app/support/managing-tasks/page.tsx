'use client';

import DynamicCategoryContent from '@/components/DynamicCategoryContent';
import { FileText } from 'lucide-react';

export default function ManagingTasksPage() {
  return <DynamicCategoryContent categoryName="Managing Tasks" icon={FileText} />;
}

