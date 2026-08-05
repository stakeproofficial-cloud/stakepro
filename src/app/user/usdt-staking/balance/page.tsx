'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import {
    fetchBalance,
    topupBalance,
    withdrawBalance,
} from '@/store/usdtStakingSlice';
import { parseDecimal } from '@/utils/validators';

export default function BalancePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { balance, loading } = useAppSelector((s) => s.usdtStaking);
    const [topupAmount, setTopupAmount] = useState('');
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState<'topup' | 'withdraw'>('topup');

    useEffect(() => {
        dispatch(fetchBalance());
    }, [dispatch]);

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!topupAmount || parseDecimal(topupAmount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(topupBalance({ amount: parseDecimal(topupAmount) })).unwrap();
            showToast('Balance topped up successfully!', 'success');
            setTopupAmount('');
            dispatch(fetchBalance());
        } catch (err: any) {
            const msg = err?.message || 'Failed to topup balance';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!withdrawAmount || parseDecimal(withdrawAmount) <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        if (balance && parseDecimal(withdrawAmount) > balance.available_for_withdrawal) {
            showToast('Insufficient available balance', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(withdrawBalance({ amount: parseDecimal(withdrawAmount) })).unwrap();
            showToast('Withdrawal processed successfully!', 'success');
            setWithdrawAmount('');
            dispatch(fetchBalance());
        } catch (err: any) {
            const msg = err?.message || 'Failed to process withdrawal';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <main className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Manage Balance</h1>
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800"
                >
                    ← Back
                </button>
            </div>

            {/* Balance Card */}
            {balance && (
                <div className="grid md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-lg p-6">
                        <p className="text-sm text-blue-100 mb-2">Staking Balance</p>
                        <p className="text-3xl font-bold">${balance.usdt_staking_balance.toFixed(2)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-lg p-6">
                        <p className="text-sm text-green-100 mb-2">Available</p>
                        <p className="text-3xl font-bold">
                            ${balance.available_for_withdrawal.toFixed(2)}
                        </p>
                    </div>

                    <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-lg p-6">
                        <p className="text-sm text-purple-100 mb-2">Active Staking</p>
                        <p className="text-3xl font-bold">${balance.active_staking_amount.toFixed(2)}</p>
                    </div>

                    <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-lg p-6">
                        <p className="text-sm text-orange-100 mb-2">Main Balance</p>
                        <p className="text-3xl font-bold">${balance.main_balance.toFixed(2)}</p>
                    </div>
                </div>
            )}

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-lg">
                <div className="flex border-b">
                    {/* <button
                        onClick={() => setActiveTab('topup')}
                        className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'topup'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600'
                            }`}
                    >
                        Top-up Balance
                    </button>
                    <button
                        onClick={() => setActiveTab('withdraw')}
                        className={`flex-1 py-4 text-center font-semibold transition ${activeTab === 'withdraw'
                            ? 'border-b-2 border-blue-600 text-blue-600'
                            : 'text-gray-600'
                            }`}
                    >
                        Withdraw Balance
                    </button> */}
                </div>

                <div className="p-8">
                    {/* {activeTab === 'topup' ? ( */}
                    <form onSubmit={handleTopup} className="max-w-md mx-auto">
                        <h2 className="text-2xl font-bold mb-6">Top-up Your Balance</h2>

                        <div className="mb-6">
                            <label htmlFor="topup-amount" className="block text-sm font-medium text-gray-700 mb-2">
                                Amount (USDT)
                            </label>
                            <input
                                type="number"
                                id="topup-amount"
                                value={topupAmount}
                                onChange={(e) => setTopupAmount(e.target.value)}
                                placeholder="Enter amount"
                                step="0.01"
                                disabled={isSubmitting}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                            <p className="text-sm text-gray-600">
                                <strong>Note:</strong> You'll be redirected to complete the payment with your wallet.
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting || loading}
                            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                        >
                            {isSubmitting ? 'Processing...' : 'Continue'}
                        </button>
                    </form>
                    {/* // ) : ( */}
                    {/* //     <form onSubmit={handleWithdraw} className="max-w-md mx-auto">
                    //         <h2 className="text-2xl font-bold mb-6">Withdraw Balance</h2>

                    //         <div className="mb-6">
                    //             <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-2">
                    //                 Amount (USDT)
                    //             </label>
                    //             <input
                    //                 type="number"
                    //                 id="withdraw-amount"
                    //                 value={withdrawAmount}
                    //                 onChange={(e) => setWithdrawAmount(e.target.value)}
                    //                 placeholder="Enter amount"
                    //                 step="0.01"
                    //                 disabled={isSubmitting}
                    //                 className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    //             />
                    //             {balance && (
                    //                 <p className="text-xs text-gray-500 mt-2">
                    //                     Max available: ${balance.available_for_withdrawal.toFixed(2)}
                    //                 </p>
                    //             )}
                    //         </div>

                    //         <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    //             <p className="text-sm text-gray-600">
                    //                 <strong>Note:</strong> Withdrawals may take 24-48 hours to process.
                    //             </p>
                    //         </div>

                    //         <button
                    //             type="submit"
                    //             disabled={isSubmitting || loading}
                    //             className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    //         >
                    //             {isSubmitting ? 'Processing...' : 'Withdraw'}
                    //         </button>
                    //     </form>
                    // )} */}
                </div>
            </div>
        </main>
    );
}
