"use client";
import { useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTransactions } from "@/store/transactionSlice";

export default function DepositRecordPage() {
    const dispatch = useAppDispatch();
    const { items: transactions, loading } = useSelector((s: RootState) => s.transactions);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const deposits = Array.isArray(transactions)
        ? transactions.filter(t => t.txn_type?.toLowerCase() === "deposit")
        : [];

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="card-premium rounded-lg shadow-lg p-6 w-full">
                <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Deposit Record</h1>
                {loading && <p className="text-pm-muted mb-4">Loading deposits...</p>}
                {!loading && deposits.length === 0 && (
                    <p className="text-pm-muted mb-4">No deposit transactions found.</p>
                )}
                <div className="space-y-3">
                    {deposits.map(d => (
                        <div key={d.id} className="p-4 bg-pm-brown-900/40 border border-pm-gold-900/30 rounded">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-pm-gold-500 font-semibold">${Number(d.amount).toFixed(2)}</span>
                                <span className="text-xs text-pm-muted">{new Date(d.created_at || '').toLocaleDateString()}</span>
                            </div>
                            <p className="text-xs text-pm-muted font-mono">Txn: {d.txn_number}</p>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

