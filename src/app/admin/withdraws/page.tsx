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

    const filteredWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(w => statusFilter === 'all' || w.state === statusFilter)
        : [];

    const copyAddress = (address: string, id: number) => {
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
        if (confirm("Are you sure you want to reject this withdrawal?")) {
            try {
                await dispatch(updateWithdrawStatus({ id, action: 'reject' })).unwrap();
                dispatch(fetchAdminWithdraws());
            } catch (err) {
                alert("Failed to reject withdrawal");
            }
        }
    };

    const getStatusBadge = (state: string) => {
        switch (state) {
            case '0': return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded text-xs">Pending</span>;
            case '1': return <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Approved</span>;
            case '2': return <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Rejected</span>;
            default: return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs">Unknown</span>;
        }
    };

    if (loading) {
        return <div className="p-6">Loading withdrawals...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Withdrawal Requests</h1>
                <div className="flex gap-2">
                    <button
                        onClick={() => setStatusFilter('all')}
                        className={`px-4 py-2 rounded transition ${statusFilter === 'all'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        All ({withdrawals?.length || 0})
                    </button>
                    <button
                        onClick={() => setStatusFilter('0')}
                        className={`px-4 py-2 rounded transition ${statusFilter === '0'
                            ? 'bg-yellow-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Pending ({withdrawals?.filter(w => w.state === '0').length || 0})
                    </button>
                    <button
                        onClick={() => setStatusFilter('1')}
                        className={`px-4 py-2 rounded transition ${statusFilter === '1'
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Approved ({withdrawals?.filter(w => w.state === '1').length || 0})
                    </button>
                    <button
                        onClick={() => setStatusFilter('2')}
                        className={`px-4 py-2 rounded transition ${statusFilter === '2'
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                    >
                        Rejected ({withdrawals?.filter(w => w.state === '2').length || 0})
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
                            filteredWithdrawals.map((withdrawal) => (
                                <tr key={withdrawal.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{withdrawal.id}</td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="text-gray-900 font-medium">
                                            {withdrawal.user?.name || `User #${withdrawal.user_id}`}
                                        </div>
                                        <div className="text-xs text-gray-500 mt-1">
                                            {withdrawal.email || 'No email'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <div className="font-semibold text-gray-900">
                                            ${Number(withdrawal.amount).toFixed(2)}
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
                                            <span className="text-gray-600 font-mono text-xs truncate max-w-[200px]" title={withdrawal.address || 'N/A'}>
                                                {withdrawal.address || 'N/A'}
                                            </span>
                                            {withdrawal.address && (
                                                <button
                                                    onClick={() => copyAddress(withdrawal.address!, withdrawal.id)}
                                                    className="px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-xs transition"
                                                    title="Copy address"
                                                >
                                                    {copiedId === withdrawal.id ? '✓' : '📋'}
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">{getStatusBadge(withdrawal.state)}</td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {new Date(withdrawal.created_at || '').toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        {withdrawal.state === '0' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleApprove(withdrawal.id)}
                                                    className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                                >
                                                    Approve
                                                </button>
                                                <button
                                                    onClick={() => handleReject(withdrawal.id)}
                                                    className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400">No actions</span>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
