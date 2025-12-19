'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const sessionId = searchParams.get('session_id');
    const [status, setStatus] = useState<string>('loading');

    useEffect(() => {
        if (sessionId) {
            setStatus('success');
            // You could optionally verify the session with the backend here if needed
        } else {
            setStatus('error');
        }
    }, [sessionId]);

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        {status === 'loading' ? (
                            <p className="text-gray-500">Processing your payment...</p>
                        ) : status === 'success' ? (
                            <>
                                <svg
                                    className="mx-auto h-12 w-12 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                    Payment Successful!
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    Thank you for your subscription. Your account has been upgraded.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/Dashboard"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Go to Dashboard
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <>
                                <svg
                                    className="mx-auto h-12 w-12 text-red-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                                <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                                    Something went wrong
                                </h2>
                                <p className="mt-2 text-sm text-gray-600">
                                    We couldn't verify your payment information.
                                </p>
                                <div className="mt-6">
                                    <Link
                                        href="/"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Return Home
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
