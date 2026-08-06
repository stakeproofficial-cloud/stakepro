'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/authSlice';
import { fetchUserPenalties } from '@/store/penaltySlice';
import { reqUserWithdraws } from '@/store/withdrawRequestsSlice';
import { useToast } from '@/components/ToastProvider';
import { useRouter } from 'next/navigation';

export default function WithdrawPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { showToast } = useToast();
    const { profile } = useSelector((s: RootState) => s.auth);
    const { userList: withdrawals, loading } = useSelector((s: RootState) => s.withdrawRequests);
    const { userPenalties, userPenaltiesLoading, totalPendingAmount } = useSelector((s: RootState) => s.penalty);

    const [amount, setAmount] = useState('');
    const [walletAddress, setWalletAddress] = useState('');

    const withdrawAmount = parseFloat(amount) || 0;
    const feePercentage = 8;
    const feeAmount = (withdrawAmount * feePercentage) / 100;
    const amountAfterFee = withdrawAmount - feeAmount;

    // Check if user has active penalties
    const hasPenalties = userPenalties && userPenalties.filter(p => p.status === 'active').length > 0;

    useEffect(() => {
        dispatch(fetchProfile());
        dispatch(fetchUserPenalties());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (hasPenalties) {
            showToast('You cannot withdraw while you have active penalties', 'error');
            return;
        }

        const withdrawAmount = parseFloat(amount);

        if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        if (withdrawAmount > (profile?.user?.balance ?? 0)) {
            showToast('Insufficient balance', 'error');
            return;
        }

        if (!walletAddress || walletAddress.length < 20) {
            showToast('Please enter a valid wallet address', 'error');
            return;
        }

        try {
            await dispatch(reqUserWithdraws({
                wallet_address: walletAddress,
                amount: withdrawAmount,
            })).unwrap();

            showToast('Withdraw request submitted successfully!', 'success');
            setAmount('');
            setWalletAddress('');
            dispatch(fetchProfile());

            // Navigate to withdraw history page
            router.push('/user/withdraw-history');
        } catch (err: any) {
            showToast(err?.message || 'Failed to submit withdraw request', 'error');
        }
    };

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Penalty Alert */}
                {userPenaltiesLoading ? (
                    <div className="card-premium rounded-lg shadow-lg p-6 border border-pm-gold-900/30">
                        <p className="text-pm-muted text-sm">Loading penalty information...</p>
                    </div>
                ) : hasPenalties && (
                    <div className="bg-red-900/30 border-2 border-red-600 rounded-lg p-6">
                        <div className="flex items-start gap-4">
                            <div className="text-3xl">⛔</div>
                            <div className="flex-1">
                                <h2 className="text-xl font-bold text-red-400 mb-3">Active Penalties Detected</h2>
                                <p className="text-red-200 mb-4">You cannot withdraw while you have active penalties. Please settle them first.</p>

                                <div className="bg-red-900/50 rounded-lg p-4 space-y-3">
                                    {userPenalties.map((penalty, index) => {
                                        const remaining = Number(penalty.penalty_amount) - Number(penalty.amount_deducted);
                                        return (
                                            <div key={penalty.id || index} className="border-b border-red-700/50 pb-3 last:border-0 last:pb-0">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div className="flex-1">
                                                        <p className="text-red-300 font-semibold text-sm">Penalty ID: #{penalty.id}</p>
                                                        <p className="text-red-200 text-xs">Created: {penalty.created_at}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded text-xs font-semibold ${penalty.status === 'active' ? 'bg-red-600 text-red-100' : 'bg-yellow-600 text-yellow-100'}`}>
                                                        {penalty.status?.toUpperCase()}
                                                    </span>
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 mt-2">
                                                    <div>
                                                        <p className="text-red-300 font-semibold text-sm">Penalty Amount:</p>
                                                        <p className="text-red-100 font-bold">${Number(penalty.penalty_amount).toFixed(2)}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-red-300 font-semibold text-sm">Already Deducted:</p>
                                                        <p className="text-red-100 font-bold">${Number(penalty.amount_deducted).toFixed(2)}</p>
                                                    </div>
                                                </div>
                                                <div className="mt-2 p-2 bg-red-950 rounded">
                                                    <div className="flex justify-between items-center">
                                                        <p className="text-red-300 font-semibold text-sm">Remaining to Settle:</p>
                                                        <p className="text-yellow-300 font-bold text-lg">${remaining.toFixed(2)}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="border-t border-red-600 pt-3 mt-3">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <p className="text-red-300 font-semibold text-sm">Total Pending:</p>
                                                <p className="text-red-100 font-bold text-lg">${totalPendingAmount.toFixed(2)}</p>
                                            </div>
                                            <div>
                                                <p className="text-red-300 font-semibold text-sm">Total Deducted:</p>
                                                <p className="text-green-300 font-bold text-lg">-$0.00</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Withdraw Form */}
                <div className="card-premium rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Withdraw Request</h1>

                    <div className="mb-6 p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                        <p className="text-sm text-pm-muted mb-1">Available Balance</p>
                        <p className="text-2xl font-bold text-pm-gold-500">
                            ${Number(profile?.user?.balance ?? 0).toFixed(2)}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                Withdraw Amount (USD)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount Minimum 10"
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent placeholder-pm-muted disabled:opacity-50 disabled:cursor-not-allowed"
                                step="0.01"
                                min="10"
                                disabled={hasPenalties || userPenaltiesLoading}
                                required
                            />
                        </div>

                        {withdrawAmount > 0 && !hasPenalties && (
                            <div className="p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-pm-muted">Requested Amount:</span>
                                    <span className="text-pm-gold-500 font-semibold">${withdrawAmount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-pm-muted">Processing Fee ({feePercentage}%):</span>
                                    <span className="text-red-400 font-semibold">-${feeAmount.toFixed(2)}</span>
                                </div>
                                <div className="border-t border-pm-gold-900/30 pt-2 mt-2">
                                    <div className="flex justify-between">
                                        <span className="text-pm-gold-500 font-medium">You will receive:</span>
                                        <span className="text-pm-gold-500 font-bold text-lg">${amountAfterFee.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                Wallet Address (USDT - BEP20)
                            </label>
                            <input
                                type="text"
                                value={walletAddress}
                                onChange={(e) => setWalletAddress(e.target.value)}
                                placeholder="Enter your wallet address"
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent placeholder-pm-muted font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                disabled={hasPenalties || userPenaltiesLoading}
                                required
                            />
                        </div>

                        <div className="p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ Please ensure your wallet address is correct otherwise your assets will be lost. An 8% processing fee will be deducted. Withdrawals are processed within 1-12 hours.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || hasPenalties || userPenaltiesLoading}
                            className="w-full btn-gold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {userPenaltiesLoading ? 'Loading...' : hasPenalties ? 'Withdraw Disabled - Settle Penalties' : loading ? 'Processing...' : 'Submit Withdraw Request'}
                        </button>
                    </form>
                </div>
            </div>
        </main>
    );
}