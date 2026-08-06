'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import {
    createStaking,
    fetchStakings,
    fetchBalance,
} from '@/store/usdtStakingSlice';
import { fetchProfile } from '@/store/authSlice';
import { parseDecimal } from '@/utils/validators';

export default function UsdtStakingPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { profile } = useAppSelector((s) => s.auth);
    const { stakings, balance, loading, error } = useAppSelector(
        (s) => s.usdtStaking
    );

    const [amount, setAmount] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile());
        } else {
            dispatch(fetchStakings());
            dispatch(fetchBalance());
        }
        console.log(stakings);
    }, [dispatch, profile]);

    const handleCreateStaking = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!amount || parseDecimal(amount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        setIsCreating(true);
        try {
            await dispatch(
                createStaking({
                    amount: parseDecimal(amount),
                })
            ).unwrap();

            showToast('Staking created successfully!', 'success');
            setAmount('');
            dispatch(fetchStakings());
        } catch (err: any) {
            const msg = err?.message || 'Failed to create staking';
            showToast(msg, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-6">
            <h1 className="text-3xl font-bold mb-8">USDT Staking</h1>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Balance Summary */}
            {balance && (
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg p-6 mb-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                            <p className="text-sm text-blue-100">Staking Balance</p>
                            <p className="text-2xl font-bold">${balance.usdt_staking_balance.toFixed(2)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-100">Available</p>
                            <p className="text-2xl font-bold">
                                ${balance.available_for_withdrawal.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-100">Active Staking</p>
                            <p className="text-2xl font-bold">
                                ${balance.active_staking_amount.toFixed(2)}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-blue-100">Main Balance</p>
                            <p className="text-2xl font-bold">${balance.main_balance.toFixed(2)}</p>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Staking Form */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Create New Staking</h2>

                <div className="grid md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Amount (USDT)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Enter amount"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            disabled={isCreating}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Estimated APY
                        </label>
                        <div className="px-4 py-2 bg-gray-100 rounded-lg text-gray-700 font-semibold">
                            12.5% - 18%
                        </div>
                    </div>
                </div>

                <button
                    onClick={handleCreateStaking}
                    disabled={isCreating || loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                >
                    {isCreating ? 'Creating...' : 'Create Staking'}
                </button>
            </div>

            {/* Active Stakings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Your Stakings</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : stakings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No active stakings yet
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Profit %
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Max Return
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Total Earned
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Completion %
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {stakings.length > 0 && stakings.map((staking) => (
                                    <tr key={staking.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold">
                                            ${staking.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">{staking.profit_percentage}%</td>
                                        <td className="px-4 py-3">${staking.max_return.toFixed(2)}</td>
                                        <td className="px-4 py-3">${staking.profit_earned.toFixed(2)}</td>
                                        <td className="px-4 py-3">{staking.completion_percentage}%</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${staking.state === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : staking.state === 'completed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {staking.state.charAt(0).toUpperCase() +
                                                    staking.state.slice(1)}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Quick Links */}
            <div className="grid md:grid-cols-3 gap-4 mt-8">
                <button
                    onClick={() => router.push('/user/usdt-staking/balance')}
                    className="bg-white border-2 border-blue-500 text-blue-600 py-4 rounded-lg font-semibold hover:bg-blue-50 transition"
                >
                    Manage Balance
                </button>
                <button
                    onClick={() => router.push('/user/usdt-staking/withdraw-requests')}
                    className="bg-white border-2 border-green-500 text-green-600 py-4 rounded-lg font-semibold hover:bg-green-50 transition"
                >
                    Withdraw Requests
                </button>
                <button
                    onClick={() => router.push('/user/usdt-staking/transactions')}
                    className="bg-white border-2 border-purple-500 text-purple-600 py-4 rounded-lg font-semibold hover:bg-purple-50 transition"
                >
                    View Transactions
                </button>
            </div>
        </main>
    );
}
