'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import {
    fetchWithdrawRequests,
    requestWithdrawal,
} from '@/store/usdtStakingSlice';
import { parseDecimal } from '@/utils/validators';

export default function WithdrawRequestsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { withdrawRequests, loading } = useAppSelector((s) => s.usdtStaking);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchWithdrawRequests());
    }, [dispatch]);

    const handleRequestWithdrawal = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!withdrawAmount || parseDecimal(withdrawAmount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        if (!walletAddress || walletAddress.trim().length < 10) {
            showToast('Please enter a valid wallet address', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(
                requestWithdrawal({
                    amount: parseDecimal(withdrawAmount),
                    wallet_address: walletAddress.trim(),
                })
            ).unwrap();

            showToast('Withdrawal request submitted successfully!', 'success');
            setWithdrawAmount('');
            setWalletAddress('');
            dispatch(fetchWithdrawRequests());
        } catch (err: any) {
            const msg = err?.message || 'Failed to request withdrawal';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Withdrawal Requests</h1>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </button>
            </div>

            {/* New Withdrawal Request */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Request New Withdrawal</h2>

                <form onSubmit={handleRequestWithdrawal} className="max-w-md">
                    <div className="mb-6">
                        <label
                            htmlFor="amount"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Amount (USDT)
                        </label>
                        <input
                            type="number"
                            id="amount"
                            value={withdrawAmount}
                            onChange={(e) => setWithdrawAmount(e.target.value)}
                            placeholder="Enter withdrawal amount"
                            step="0.01"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="mb-6">
                        <label
                            htmlFor="walletAddress"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Wallet Address
                        </label>
                        <input
                            type="text"
                            id="walletAddress"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="Enter your USDT wallet address"
                            disabled={isSubmitting}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <p className="text-sm text-gray-600">
                            <strong>Processing time:</strong> Requests typically processed within 24-48 hours
                        </p>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || loading}
                        className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                        {isSubmitting ? 'Submitting...' : 'Submit Request'}
                    </button>
                </form>
            </div>

            {/* Withdrawal Requests List */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Your Requests</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : withdrawRequests.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No withdrawal requests yet
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
                                        Wallet Address
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Requested
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Processed
                                    </th>
                                    {withdrawRequests.length > 0 && withdrawRequests.some((r) => r.reason) && (
                                        <th className="px-4 py-3 text-left text-sm font-semibold">
                                            Reason
                                        </th>
                                    )}
                                </tr>
                            </thead>
                            <tbody>
                                {withdrawRequests.length > 0 && withdrawRequests.map((request) => (
                                    <tr key={request.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3 font-semibold">
                                            ${request.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {request.wallet_address || '-'}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    request.status
                                                )}`}
                                            >
                                                {request.status.charAt(0).toUpperCase() +
                                                    request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(request.requested_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {request.processed_at
                                                ? new Date(request.processed_at).toLocaleDateString()
                                                : '-'}
                                        </td>
                                        {withdrawRequests.some((r) => r.reason) && (
                                            <td className="px-4 py-3 text-sm text-gray-600">
                                                {request.reason || '-'}
                                            </td>
                                        )}
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
