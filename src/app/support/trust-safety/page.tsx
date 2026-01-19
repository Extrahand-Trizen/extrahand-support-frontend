'use client';

import DynamicCategoryContent from '@/components/DynamicCategoryContent';
import { Shield } from 'lucide-react';

export default function TrustSafetyPage() {
  return <DynamicCategoryContent categoryName="Trust & Safety" icon={Shield} />;
}

