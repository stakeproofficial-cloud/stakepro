'use client';
import { fetchProfile } from "@/store/authSlice";
import { useAppDispatch } from "@/store/hooks";
import { RootState } from "@/store/store";
import { fetchUserWithdraws } from "@/store/withdrawRequestsSlice";
import { useEffect } from "react";
import { useSelector } from "react-redux";

export default function WithdrawHistoryPage() {
    const dispatch = useAppDispatch();
    const { profile } = useSelector((s: RootState) => s.auth);
    const { userList: withdrawals, loading } = useSelector((s: RootState) => s.withdrawRequests);
    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchUserWithdraws());
    }, [dispatch]);

    const getStatusColor = (status: string) => {
        switch (status?.toLowerCase()) {
            case '1': return 'bg-green-900/30 text-green-400';
            case '2': return 'bg-red-900/30 text-red-400';
            case '0': return 'bg-yellow-900/30 text-yellow-400';
            default: return 'bg-pm-brown-900/30 text-pm-muted';
        }
    };
    return (<main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
        <div className="card-premium rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-pm-gold-500">Withdrawal History</h2>

            {!Array.isArray(withdrawals) || withdrawals.length === 0 ? (
                <div className="text-center py-8">
                    <p className="text-pm-muted">No withdrawal requests yet</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {withdrawals.map((withdrawal: any) => (
                        <div
                            key={withdrawal.id}
                            className="p-4 bg-pm-brown-900/30 rounded-lg border border-pm-gold-900/20"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <p className="text-pm-gold-500 font-semibold text-lg">
                                        ${Number(withdrawal.amount).toFixed(2)}
                                    </p>
                                    <p className="text-sm text-pm-muted">
                                        {new Date(withdrawal.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <span className={`px-3 py-1 rounded-full text-xs ${getStatusColor(withdrawal.state)}`}>
                                    {withdrawal.state === "0" ? 'Pending' : withdrawal.state === "1" ? 'Approved' : 'Rejected'}
                                </span>
                            </div>
                            {withdrawal.address && (
                                <p className="text-xs text-pm-muted font-mono mt-2">
                                    {withdrawal.address.substring(0, 20)}...
                                </p>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    </main>
    )
}