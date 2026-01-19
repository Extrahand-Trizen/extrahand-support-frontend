'use client';

import DynamicCategoryContent from '@/components/DynamicCategoryContent';
import { Users } from 'lucide-react';

export default function AccountManagementPage() {
  return <DynamicCategoryContent categoryName="Login/Account Management" icon={Users} />;
}

