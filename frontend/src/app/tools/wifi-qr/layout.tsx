import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Secure Wi-Fi QR Code Generator | QRPrimeGen',
    description: 'Create secure and customizable Wi-Fi QR codes instantly. Share your Wi-Fi network easily without revealing your password.',
    keywords: ['WiFi QR Code', 'QR Code Generator', 'Share WiFi', 'Secure WiFi', 'QRPrimeGen'],
    openGraph: {
        title: 'Secure Wi-Fi QR Code Generator | QRPrimeGen',
        description: 'Create secure and customizable Wi-Fi QR codes instantly. Share your Wi-Fi network easily without revealing your password.',
        type: 'website',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Secure Wi-Fi QR Code Generator | QRPrimeGen',
        description: 'Create secure and customizable Wi-Fi QR codes instantly. Share your Wi-Fi network easily without revealing your password.',
    },
};

export default function WiFiQRLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
