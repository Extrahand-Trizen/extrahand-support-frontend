'use client';

import { Suspense } from 'react';
import InquiryForm from '@/components/InquiryForm';

export default function InquiryFormPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
            <InquiryForm />
        </Suspense>
    );
}
