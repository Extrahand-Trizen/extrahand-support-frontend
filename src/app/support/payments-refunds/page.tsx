'use client';

import HierarchicalCategoryContent from '@/components/HierarchicalCategoryContent';
import { CreditCard } from 'lucide-react';

export default function PaymentsRefundsPage() {
  return <HierarchicalCategoryContent categoryName="Payments & Refunds" icon={CreditCard} />;
}

