'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import {
    fetchAdminWithdrawals,
    approveRejectWithdrawal,
} from '@/store/usdtStakingSlice';

export default function AdminWithdrawalsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { adminWithdrawals, loading } = useAppSelector((s) => s.usdtStaking);
    const [selectedWithdrawal, setSelectedWithdrawal] = useState<number | null>(
        null
    );
    const [reason, setReason] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        dispatch(fetchAdminWithdrawals());
    }, [dispatch]);

    const handleApprove = async (withdrawalId: number) => {
        setIsProcessing(true);
        try {
            await dispatch(
                approveRejectWithdrawal({
                    withdraw_id: withdrawalId,
                    action: 'approve',
                })
            ).unwrap();

            showToast('Withdrawal approved!', 'success');
            dispatch(fetchAdminWithdrawals());
            setSelectedWithdrawal(null);
            setReason('');
        } catch (err: any) {
            const msg = err?.message || 'Failed to approve withdrawal';
            showToast(msg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReject = async (withdrawalId: number) => {
        if (!reason.trim()) {
            showToast('Please provide a reason for rejection', 'error');
            return;
        }

        setIsProcessing(true);
        try {
            await dispatch(
                approveRejectWithdrawal({
                    withdraw_id: withdrawalId,
                    action: 'reject',
                    reason,
                })
            ).unwrap();

            showToast('Withdrawal rejected!', 'success');
            dispatch(fetchAdminWithdrawals());
            setSelectedWithdrawal(null);
            setReason('');
        } catch (err: any) {
            const msg = err?.message || 'Failed to reject withdrawal';
            showToast(msg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };
    const handleCopyAddress = (address: string) => {
        navigator.clipboard.writeText(address);
        showToast('Wallet address copied!', 'success');
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const pendingWithdrawals = adminWithdrawals.filter(
        (w) => w.status === 'pending'
    );
    const processedWithdrawals = adminWithdrawals.filter(
        (w) => w.status !== 'pending'
    );

    return (
        <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Withdrawals</h1>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </button>
            </div>

            {/* Stats */}
            <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-yellow-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">
                        {pendingWithdrawals.length}
                    </p>
                </div>

                <div className="bg-green-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Approved</p>
                    <p className="text-2xl font-bold text-green-600">
                        {adminWithdrawals.filter((w) => w.status === 'approved').length}
                    </p>
                </div>

                <div className="bg-red-100 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">Rejected</p>
                    <p className="text-2xl font-bold text-red-600">
                        {adminWithdrawals.filter((w) => w.status === 'rejected').length}
                    </p>
                </div>
            </div>

            {/* Pending Withdrawals */}
            <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <h2 className="text-2xl font-bold mb-6">Pending Withdrawals</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : pendingWithdrawals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No pending withdrawals
                    </div>
                ) : (
                    <div className="space-y-4">
                        {pendingWithdrawals.map((withdrawal) => (
                            <div
                                key={withdrawal.id}
                                className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-semibold">
                                            User #{withdrawal.user_id}{' '}
                                            {withdrawal.email && (
                                                <span className="text-sm text-gray-500">
                                                    ({withdrawal.email})
                                                </span>
                                            )}
                                        </p>
                                        {withdrawal.wallet_address_full && (
                                            <div className="flex items-center gap-2 mt-1">
                                                <p className="text-sm text-gray-600 font-medium">
                                                    Wallet: <span className="text-gray-800 break-all">{withdrawal.wallet_address_full}</span>
                                                </p>
                                                <button
                                                    onClick={() => handleCopyAddress(withdrawal.wallet_address_full)}
                                                    className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                                    title="Copy wallet address"
                                                    aria-label="Copy wallet address"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        )}
                                        <p className="text-2xl font-bold text-blue-600 mt-1">
                                            ${withdrawal.amount.toFixed(2)}
                                        </p>
                                        <p className="text-xs text-gray-500 mt-2">
                                            Requested:{' '}
                                            {new Date(withdrawal.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => setSelectedWithdrawal(withdrawal.id)}
                                            className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                                        >
                                            Process
                                        </button>
                                    </div>
                                </div>

                                {/* Action Modal */}
                                {selectedWithdrawal === withdrawal.id && (
                                    <div className="mt-4 pt-4 border-t border-gray-200">
                                        <div className="bg-gray-50 rounded-lg p-4 mb-4">
                                            <h3 className="font-semibold mb-3">Process Withdrawal</h3>

                                            <div className="mb-4">
                                                <label
                                                    htmlFor={`reason-${withdrawal.id}`}
                                                    className="block text-sm font-medium text-gray-700 mb-2"
                                                >
                                                    Reason (Required for rejection)
                                                </label>
                                                <textarea
                                                    id={`reason-${withdrawal.id}`}
                                                    value={reason}
                                                    onChange={(e) => setReason(e.target.value)}
                                                    placeholder="Enter reason if rejecting..."
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                                                    rows={3}
                                                    disabled={isProcessing}
                                                />
                                            </div>

                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(withdrawal.id)}
                                                    disabled={isProcessing}
                                                    className="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 transition"
                                                >
                                                    {isProcessing ? 'Processing...' : 'Approve'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(withdrawal.id)}
                                                    disabled={isProcessing}
                                                    className="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 transition"
                                                >
                                                    {isProcessing ? 'Processing...' : 'Reject'}
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        setSelectedWithdrawal(null);
                                                        setReason('');
                                                    }}
                                                    disabled={isProcessing}
                                                    className="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 transition"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Processed Withdrawals */}
            <div className="bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-2xl font-bold mb-6">Processed Withdrawals</h2>

                {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading...</div>
                ) : processedWithdrawals.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                        No processed withdrawals
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        User
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Amount
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Status
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-semibold">
                                        Requested
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {processedWithdrawals.map((withdrawal) => (
                                    <tr key={withdrawal.id} className="border-t hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <span className="font-semibold">
                                                User #{withdrawal.user_id}
                                            </span>
                                            {withdrawal.email && (
                                                <p className="text-xs text-gray-500">
                                                    {withdrawal.email}
                                                </p>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-semibold">
                                            ${withdrawal.amount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(
                                                    withdrawal.status
                                                )}`}
                                            >
                                                {withdrawal.status.charAt(0).toUpperCase() +
                                                    withdrawal.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {new Date(withdrawal.created_at).toLocaleDateString()}
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
