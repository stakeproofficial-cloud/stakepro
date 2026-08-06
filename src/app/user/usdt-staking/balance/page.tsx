'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import { fetchBalance, topupBalance } from '@/store/usdtStakingSlice';
import { fetchProfile } from '@/store/authSlice';
import { parseDecimal } from '@/utils/validators';
import { FaWallet, FaArrowLeft, FaPlusCircle } from 'react-icons/fa';

export default function BalancePage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { balance, loading } = useAppSelector((s) => s.usdtStaking);
    const { profile } = useAppSelector((s) => s.auth);
    const [topupAmount, setTopupAmount] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        dispatch(fetchBalance());
        dispatch(fetchProfile());
    }, [dispatch]);

    const currentBalance = Number(balance?.balance ?? profile?.user?.balance ?? 0);

    const handleTopup = async (e: React.FormEvent) => {
        e.preventDefault();

        const numVal = parseDecimal(topupAmount);
        if (!topupAmount || numVal <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        setIsSubmitting(true);
        try {
            await dispatch(topupBalance({ amount: numVal })).unwrap();
            showToast('Balance topped up successfully!', 'success');
            setTopupAmount('');
            dispatch(fetchBalance());
            dispatch(fetchProfile());
        } catch (err: any) {
            const msg = err?.message || 'Failed to topup balance';
            showToast(msg, 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">Manage Balance</h1>
                    <p className="text-xs text-[#8B85A3]">View and top-up your USDT staking balance</p>
                </div>
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-1.5 rounded-xl border border-[#221E2F] bg-[#14111D] px-3 py-1.5 text-xs font-semibold text-[#8B85A3] hover:text-[#F4F2FB]"
                >
                    <FaArrowLeft className="h-3 w-3" />
                    <span>Back</span>
                </button>
            </div>

            {/* Current Balance Display Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-6 shadow-xl space-y-2">
                <div className="flex items-center gap-2 text-[#A78BFA]">
                    <FaWallet className="h-4 w-4" />
                    <span className="text-xs text-[#8B85A3]">Total Available Balance</span>
                </div>
                <p className="text-3xl font-bold text-[#F4F2FB]">${currentBalance.toFixed(2)} USDT</p>
            </div>

            {/* Top-up Form Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl space-y-4">
                <h2 className="text-sm font-bold text-[#F4F2FB]">Top-up Balance</h2>

                <form onSubmit={handleTopup} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Amount (USDT)</label>
                        <input
                            type="number"
                            value={topupAmount}
                            onChange={(e) => setTopupAmount(e.target.value)}
                            placeholder="Enter amount"
                            step="0.01"
                            disabled={isSubmitting}
                            className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none disabled:opacity-50"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || loading || !topupAmount}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CF0] py-4 text-sm font-semibold text-[#F4F2FB] shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50"
                    >
                        <FaPlusCircle className="h-4 w-4" />
                        <span>{isSubmitting ? 'Processing...' : 'Confirm Top-up'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
