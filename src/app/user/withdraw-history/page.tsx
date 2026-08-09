'use client';

import TransactionHistoryView from '@/components/TransactionHistoryView';

export default function UserWithdrawHistoryPage() {
    return (
        <TransactionHistoryView
            initialTab="withdrawals"
            title="Withdrawal History & Requests"
            subtitle="Track your USDT withdrawal requests, status updates, and payout details"
        />
    );
}
