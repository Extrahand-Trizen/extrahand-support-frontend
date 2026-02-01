'use client';

import HierarchicalCategoryContent from '@/components/HierarchicalCategoryContent';
import { Users } from 'lucide-react';

export default function AccountManagementPage() {
  return <HierarchicalCategoryContent categoryName="Login/Account Management" icon={Users} />;
}

