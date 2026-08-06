import { Metadata } from 'next';

export function generateMetadata(title: string, description?: string): Metadata {
    return {
        title,
        description: description || 'Secure USDT staking platform with rewards and withdrawals',
        openGraph: {
            title,
            description: description || 'Secure USDT staking platform with rewards and withdrawals',
            type: 'website',
            locale: 'en_US',
            siteName: 'stakepro'
        },
        twitter: {
            card: 'summary_large_image',
            title,
            description: description || 'Secure USDT staking platform with rewards and withdrawals'
        }
    };
}