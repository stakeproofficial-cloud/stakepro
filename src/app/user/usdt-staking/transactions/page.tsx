'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchTransactions } from '@/store/usdtStakingSlice';

export default function TransactionsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { transactions, loading } = useAppSelector((s) => s.usdtStaking);
    const transactionList = Array.isArray(transactions) ? transactions : [];

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'deposit':
                return 'text-green-600';
            case 'withdrawal':
                return 'text-red-600';
            case 'reward':
                return 'text-blue-600';
            case 'topup':
                return 'text-purple-600';
            default:
                return 'text-gray-600';
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'deposit':
                return '↓';
            case 'withdrawal':
                return '↑';
            case 'reward':
                return '⭐';
            case 'topup':
                return '➕';
            default:
                return '•';
        }
    };

    return (
        <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Transactions</h1>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </button>
            </div>

            {/* Transaction Stats */}
            <div className="grid md:grid-cols-4 gap-4 mb-8">
                <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Stake</p>
                    <p className="text-2xl font-bold text-green-600">
                        $
                        {transactionList
                            .filter((t) => t.type === 'stake')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>

                <div className="bg-red-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Withdrawals</p>
                    <p className="text-2xl font-bold text-red-600">
                        $
                        {transactionList
                            .filter((t) => t.type === 'withdraw_refund')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>

                <div className="bg-blue-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Rewards</p>
                    <p className="text-2xl font-bold text-blue-600">
                        $
                        {transactionList
                            .filter((t) => t.type === 'profit_earned')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>

                <div className="bg-purple-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Total Top-ups</p>
                    <p className="text-2xl font-bold text-purple-600">
                        $
                        {transactionList
                            .filter((t) => t.type === 'topup')
                            .reduce((sum, t) => sum + t.amount, 0)
                            .toFixed(2)}
                    </p>
                </div>
            </div>

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">All Transactions</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No transactions yet</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Type
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Balance Before
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Balance After
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Reference
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Date
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactionList.map((transaction) => (
                                    <tr key={transaction.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className={`font-semibold ${getTypeColor(transaction.type)}`}>
                                                <span className="mr-2">{getTypeIcon(transaction.type)}</span>
                                                {transaction.type.charAt(0).toUpperCase() +
                                                    transaction.type.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            ${transaction.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            ${transaction.balance_before.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            ${transaction.balance_after.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {transaction.reference || '-'}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(transaction.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </main>
    );
}
