"use client";
import { useEffect, useState } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchAdminWithdraws, updateWithdrawStatus } from "@/store/withdrawRequestsSlice";

export default function AdminWithdrawsPage() {
    const dispatch = useAppDispatch();
    const { adminList: withdrawals, loading } = useSelector((s: RootState) => s.withdrawRequests);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>('all');

    useEffect(() => {
        dispatch(fetchAdminWithdraws());
    }, [dispatch]);

    const getStatusStr = (w: any) => {
        const st = (w.status || w.state || 'pending').toString().toLowerCase();
        if (st === '0' || st === 'pending') return 'pending';
        if (st === '1' || st === 'approved' || st === 'completed') return 'approved';
        if (st === '2' || st === 'rejected') return 'rejected';
        return st;
    };

    const filteredWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(w => statusFilter === 'all' || getStatusStr(w) === statusFilter)
        : [];

    const copyAddress = (address: string, id: number) => {
        if (!address) return;
        navigator.clipboard.writeText(address);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handleApprove = async (id: number) => {
        if (confirm("Are you sure you want to approve this withdrawal?")) {
            try {
                await dispatch(updateWithdrawStatus({ id, action: 'approve' })).unwrap();
                dispatch(fetchAdminWithdraws());
            } catch (err) {
                alert("Failed to approve withdrawal");
            }
        }
    };

    const handleReject = async (id: number) => {
        const reason = prompt("Enter reason for rejection:");
        if (reason !== null) {
            try {
                await dispatch(updateWithdrawStatus({ id, action: 'reject', reason })).unwrap();
                dispatch(fetchAdminWithdraws());
            } catch (err) {
                alert("Failed to reject withdrawal");
            }
        }
    };

    const getStatusBadge = (statusStr: string) => {
        switch (statusStr) {
            case 'pending': return <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 rounded font-semibold text-xs">Pending</span>;
            case 'approved': return <span className="px-2.5 py-1 bg-green-100 text-green-800 rounded font-semibold text-xs">Approved</span>;
            case 'rejected': return <span className="px-2.5 py-1 bg-red-100 text-red-800 rounded font-semibold text-xs">Rejected</span>;
            default: return <span className="px-2.5 py-1 bg-gray-100 text-gray-800 rounded font-semibold text-xs">{statusStr}</span>;
        }
    };

    if (loading) {
        return <div className="p-6">Loading withdrawals...</div>;
    }

    const pendingCount = withdrawals?.filter(w => getStatusStr(w) === 'pending').length || 0;
    const approvedCount = withdrawals?.filter(w => getStatusStr(w) === 'approved').length || 0;
    const rejectedCount = withdrawals?.filter(w => getStatusStr(w) === 'rejected').length || 0;

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
                <div className="flex flex-wrap gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded transition text-xs font-semibold ${statusFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All ({withdrawals?.length || 0})
                    </button>
                    <button
                        onClick={() => setStatusFilter('pending')}
                        className={`px-4 py-2 rounded transition text-xs font-semibold ${statusFilter === 'pending'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Pending ({pendingCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('approved')}
                        className={`px-4 py-2 rounded transition text-xs font-semibold ${statusFilter === 'approved'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Approved ({approvedCount})
                    </button>
                    <button
                        onClick={() => setStatusFilter('rejected')}
                        className={`px-4 py-2 rounded transition text-xs font-semibold ${statusFilter === 'rejected'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Rejected ({rejectedCount})
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Wallet Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredWithdrawals.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                                    No withdrawal requests found
                                </td>
                            </tr>
                        ) : (
                            filteredWithdrawals.map((withdrawal) => {
                                const stStr = getStatusStr(withdrawal);
                                const addr = withdrawal.wallet_address_full || withdrawal.wallet_address || withdrawal.address || '';
                                return (
                                    <tr key={withdrawal.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">#{withdrawal.id}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="text-gray-900 font-medium">
                                                {withdrawal.user?.name || `User #${withdrawal.user_id}`}
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {withdrawal.email || withdrawal.email || 'No email'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="font-semibold text-gray-900">
                                                ${Number(withdrawal.amount).toFixed(2)} USDT
                                            </div>
                                            <div className="text-xs text-gray-500 mt-1">
                                                Fee (8%): ${(Number(withdrawal.amount) * 0.08).toFixed(2)}
                                            </div>
                                            <div className="text-xs text-green-600 font-medium">
                                                To Pay: ${(Number(withdrawal.amount) * 0.92).toFixed(2)}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            <div className="flex items-center gap-2">
                                                <span className="text-gray-600 font-mono text-xs truncate max-w-[200px]" title={addr || 'N/A'}>
                                                    {addr || 'N/A'}
                                                </span>
                                                {addr && (
                                                    <button
                                                        onClick={() => copyAddress(addr, withdrawal.id)}
                                                        className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition"
                                                        title="Copy address"
                                                    >
                                                        {copiedId === withdrawal.id ? '✓' : '📋'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">{getStatusBadge(stStr)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">
                                            {withdrawal.created_at ? new Date(withdrawal.created_at).toLocaleString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4 text-sm">
                                            {stStr === 'pending' ? (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleApprove(withdrawal.id)}
                                                        className="px-3 py-1 bg-green-600 text-white rounded text-xs font-semibold hover:bg-green-700 transition"
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        onClick={() => handleReject(withdrawal.id)}
                                                        className="px-3 py-1 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">Processed</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
