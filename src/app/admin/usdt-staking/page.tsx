'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchAdminDashboard, fetchStakings } from '@/store/usdtStakingSlice';

export default function AdminUsdtStakingPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const { adminDashboard, stakings, loading } = useAppSelector(
        (s) => s.usdtStaking
    );

    useEffect(() => {
        dispatch(fetchAdminDashboard());
        dispatch(fetchStakings());
    }, [dispatch]);

    return (
        <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">USDT Staking Dashboard</h1>
                <button
                    onClick={() => router.push('/admin/usdt-staking/withdrawals')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Manage Withdrawals
                </button>
            </div>

            {/* Dashboard Stats */}
            {adminDashboard && (
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                        <p className="text-sm text-blue-100 mb-2">Total Staked</p>
                        <p className="text-3xl font-bold">
                            ${adminDashboard.total_staking_balance.toFixed(2)}
                        </p>
                    </div>

                    {/* <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                        <p className="text-sm text-green-100 mb-2">Total Stakers</p>
                        <p className="text-3xl font-bold">{adminDashboard.total_stakers}</p>
                    </div>

                    <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-lg p-6">
                        <p className="text-sm text-yellow-100 mb-2">Pending Withdrawals</p>
                        <p className="text-3xl font-bold">
                            {adminDashboard.pending_withdrawals}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                        <p className="text-sm text-purple-100 mb-2">Rewards Paid</p>
                        <p className="text-3xl font-bold">
                            ${adminDashboard.total_rewards_paid.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-pink-500 to-pink-600 text-white rounded-lg p-6">
                        <p className="text-sm text-pink-100 mb-2">Average APY</p>
                        <p className="text-3xl font-bold">
                            {adminDashboard.average_apy.toFixed(2)}%
                        </p>
                    </div> */}
                </div>
            )}

            {/* Key Metrics */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Quick Stats</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Active Stakes</span>
                            <span className="font-semibold">
                                {adminDashboard?.active_stakings.count || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Stakers</span>
                            <span className="font-semibold">
                                {adminDashboard?.total_users_with_staking || 0}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Pending Withdrawals</span>
                            <span className="font-semibold">
                                {adminDashboard?.pending_withdrawals?.count || 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Financial Summary</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Locked</span>
                            <span className="font-semibold">
                                ${adminDashboard?.total_staking_balance.toFixed(2) || '0.00'}
                            </span>
                        </div>
                        {/* <div className="flex justify-between">
                            <span className="text-gray-600">Avg APY</span>
                            <span className="font-semibold">
                                {adminDashboard?.average_apy.toFixed(2) || '0.00'}%
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-600">Total Rewards</span>
                            <span className="font-semibold">
                                ${adminDashboard?.total_rewards_paid.toFixed(2) || '0.00'}
                            </span>
                        </div> */}
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-lg font-bold mb-4">Actions</h3>
                    <button
                        onClick={() => router.push('/admin/usdt-staking/withdrawals')}
                        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition mb-3"
                    >
                        Manage Withdrawals
                    </button>
                    <button
                        onClick={() => router.refresh()}
                        className="w-full bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition"
                    >
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* All Stakings */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">All Active & Completed Stakings</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : !Array.isArray(stakings) || stakings.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No stakings found</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        User ID
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Amount
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
                                {stakings.map((staking) => (
                                    <tr key={staking.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">#{staking.user_id}</td>
                                        <td className="px-4 py-3 font-semibold">
                                            ${Number(staking.amount || 0).toFixed(2)} USDT
                                        </td>
                                        <td className="px-4 py-3">${Number(staking.max_return || 0).toFixed(2)} USDT</td>
                                        <td className="px-4 py-3 text-green-600 font-semibold">+${Number(staking.total_earned ?? staking.profit_earned ?? 0).toFixed(2)} USDT</td>
                                        <td className="px-4 py-3">{Number(staking.completion_percentage || 0).toFixed(2)}%</td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${staking.state === 'active'
                                                    ? 'bg-green-100 text-green-800'
                                                    : staking.state === 'completed'
                                                        ? 'bg-blue-100 text-blue-800'
                                                        : 'bg-gray-100 text-gray-800'
                                                    }`}
                                            >
                                                {staking.state ? (staking.state.charAt(0).toUpperCase() + staking.state.slice(1)) : 'Active'}
                                            </span>
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
