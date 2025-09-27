// src/app/auth/auth-code-error/page.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get('error');
  const detailsParam = searchParams.get('details');
  
  let details = null;
  if (detailsParam) {
    try {
      details = JSON.parse(decodeURIComponent(detailsParam));
    } catch (e) {
      console.error("Failed to parse error details:", e);
      details = { message: "Could not parse error details." };
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-lsr-charcoal text-white">
      <div className="container flex flex-col items-center justify-center gap-6 px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-[5rem]">
          Authentication Error
        </h1>
        <p className="text-lg">
          An error occurred during the sign-in process. Please copy the information below and provide it for troubleshooting.
        </p>
        <div className="mt-4 w-full max-w-2xl rounded-md bg-gray-800 p-4 text-left">
          <h2 className="text-xl font-bold text-red-400">Error Message:</h2>
          <p className="mt-2 font-mono text-sm text-gray-300">{error || 'No error message provided.'}</p>
          
          {details && (
            <div className="mt-4">
              <h2 className="text-xl font-bold text-red-400">Technical Details:</h2>
              <pre className="mt-2 overflow-x-auto whitespace-pre-wrap rounded-md bg-gray-900 p-3 font-mono text-xs text-gray-300">
                {JSON.stringify(details, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default function AuthCodeErrorPage() {
  return (
    <Suspense fallback={<div>Loading error...</div>}>
      <AuthErrorContent />
    </Suspense>
  );
}