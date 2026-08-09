'use client';

import TransactionHistoryView from '@/components/TransactionHistoryView';

export default function UserDepositHistoryPage() {
    return (
        <TransactionHistoryView
            initialTab="deposits"
            title="Deposit History"
            subtitle="View your past USDT deposit transactions on Binance Smart Chain"
        />
    );
}
