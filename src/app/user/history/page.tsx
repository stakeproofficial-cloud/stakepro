'use client';

import TransactionHistoryView from '@/components/TransactionHistoryView';

export default function UserHistoryPage() {
    return (
        <TransactionHistoryView
            initialTab="all"
            title="Transaction & Wallet History"
            subtitle="Track all your USDT deposits, withdrawal requests, and reward distributions"
        />
    );
}
