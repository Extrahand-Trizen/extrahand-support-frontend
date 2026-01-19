'use client';

import DynamicCategoryContent from '@/components/DynamicCategoryContent';
import { CreditCard } from 'lucide-react';

export default function PaymentsRefundsPage() {
  return <DynamicCategoryContent categoryName="Payments & Refunds" icon={CreditCard} />;
}

