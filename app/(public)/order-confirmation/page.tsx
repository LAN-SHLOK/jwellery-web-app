import React, { Suspense } from 'react';

import OrderConfirmationClient from './OrderConfirmationClient';

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[60vh] flex items-center justify-center text-sm opacity-40 tracking-widest uppercase">
          Loading…
        </div>
      }
    >
      <OrderConfirmationClient />
    </Suspense>
  );
}
