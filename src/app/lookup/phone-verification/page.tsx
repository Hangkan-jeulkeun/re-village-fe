import { Suspense } from 'react';

import AppLayout from '@/components/layout/AppLayout';
import { PageLoader } from '@/components/common/PageLoader';
import { PhoneVerificationForm } from '@/features/lookup/PhoneVerificationForm';

export default function PhoneVerificationPage() {
  return (
    <AppLayout
      style={{
        minHeight: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--page-padding-compact)',
        background: 'linear-gradient(180deg, #ffffff 0%, #f7f9fd 100%)',
      }}
    >
      <Suspense fallback={<PageLoader />}>
        <PhoneVerificationForm />
      </Suspense>
    </AppLayout>
  );
}
