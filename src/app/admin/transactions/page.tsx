"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions } from "@/store/transactionSlice";
import { fetchUsers } from "@/store/adminSlice";

export default function AdminTransactionsPage() {
    const dispatch = useAppDispatch();
    const { items: transactions, loading } = useAppSelector((s) => s.transactions);
    const { users } = useAppSelector((s) => s.admin);
    const [filter, setFilter] = useState<string>('all');

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchUsers() as any);
    }, [dispatch]);

    const getUserEmail = (userId: number) => {
        const user = users.find(u => u.id === userId);
        return user ? user.email : `User #${userId}`;
    };

    const getTypeBadge = (type: string) => {
        const types: Record<string, { label: string; color: string }> = {
            'deposit': { label: 'Deposit', color: 'bg-green-100 text-green-800' },
            'withdraw': { label: 'Withdraw', color: 'bg-red-100 text-red-800' },
            'investment': { label: 'Investment', color: 'bg-blue-100 text-blue-800' },
            'profit': { label: 'Profit', color: 'bg-purple-100 text-purple-800' },
            'referral': { label: 'Referral', color: 'bg-yellow-100 text-yellow-800' },
        };
        const typeInfo = types[type.toLowerCase()] || { label: type, color: 'bg-gray-100 text-gray-800' };
        return (
            <span className={`px-2 py-1 rounded text-xs font-medium ${typeInfo.color}`}>
                {typeInfo.label}
            </span>
        );
    };

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.txn_type.toLowerCase() === filter);

    const totalAmount = filteredTransactions.reduce((sum, txn) => sum + Number(txn.amount), 0);

    if (loading) {
        return <div className="p-6">Loading transactions...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">All Transactions</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded transition ${filter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All ({transactions.length})
                    </button>
                    <button
                        onClick={() => setFilter('deposit')}
                        className={`px-4 py-2 rounded transition ${filter === 'deposit'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Deposits
                    </button>
                    <button
                        onClick={() => setFilter('withdraw')}
                        className={`px-4 py-2 rounded transition ${filter === 'withdraw'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Withdrawals
                    </button>
                    <button
                        onClick={() => setFilter('investment')}
                        className={`px-4 py-2 rounded transition ${filter === 'investment'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Investments
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Transaction #</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No transactions found
                                </td>
                            </tr>
                        ) : (
                            filteredTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{transaction.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {getUserEmail(transaction.user_id)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-mono text-gray-600">
                                        {transaction.txn_number}
                                    </td>
                                    <td className="px-6 py-4">
                                        {getTypeBadge(transaction.txn_type)}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                        ${Number(transaction.amount).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {transaction.created_at
                                            ? new Date(transaction.created_at).toLocaleString()
                                            : 'N/A'}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Total Transactions</div>
                        <div className="text-2xl font-bold text-gray-900">{filteredTransactions.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Total Amount</div>
                        <div className="text-2xl font-bold text-gray-900">${totalAmount.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Average Amount</div>
                        <div className="text-2xl font-bold text-gray-900">
                            ${filteredTransactions.length > 0 ? (totalAmount / filteredTransactions.length).toFixed(2) : '0.00'}
                        </div>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Unique Users</div>
                        <div className="text-2xl font-bold text-gray-900">
                            {new Set(filteredTransactions.map(t => t.user_id)).size}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
