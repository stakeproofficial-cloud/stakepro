'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchTransactions } from '@/store/transactionSlice';

export default function TransactionsPage() {
    const dispatch = useAppDispatch();
    const { items: transactions, loading } = useSelector((s: RootState) => s.transactions);

    useEffect(() => {
        dispatch(fetchTransactions());
    }, [dispatch]);

    const getTypeColor = (type: string) => {
        switch (type?.toLowerCase()) {
            case 'deposit': return 'text-green-500';
            case 'withdraw': return 'text-red-500';
            case 'profit': return 'text-blue-500';
            default: return 'text-pm-gold-500';
        }
    };

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="w-full card-premium rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Transaction History</h1>

                {loading ? (
                    <p className="text-center text-pm-muted">Loading transactions...</p>
                ) : transactions.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-pm-muted">No transactions yet</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {transactions.map((tx: any) => (
                            <div key={tx.id} className="card-premium rounded-lg p-4 hover:bg-pm-brown-900/30 transition-colors">
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                            <p className={`font-semibold truncate ${getTypeColor(tx.type)}`}>
                                                {tx.txn_type || 'Referral'}
                                            </p>
                                            <p className="text-pm-muted text-xs mt-1">
                                                {new Date(tx.created_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="text-right ml-4">
                                            <p className="text-pm-gold-500 font-semibold whitespace-nowrap">
                                                ${Number(tx.amount).toFixed(2)}
                                            </p>
                                            <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs bg-green-900/30 text-green-400 whitespace-nowrap">
                                                Completed
                                            </span>
                                        </div>
                                    </div>
                                    <p className="text-pm-gold-500/70 font-mono text-xs truncate">
                                        {tx.txn_number}
                                    </p>
                                    <p className="text-pm-gold-500/70 font-mono text-xs truncate">
                                        {tx.display_text}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    );
}