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
import { FaArrowUp, FaExclamationTriangle, FaBan } from 'react-icons/fa';

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

        const reqVal = parseFloat(amount);

        if (isNaN(reqVal) || reqVal <= 0) {
            showToast('Please enter a valid withdrawal amount', 'error');
            return;
        }

        if (reqVal > (profile?.user?.balance ?? 0)) {
            showToast('Insufficient available USDT balance', 'error');
            return;
        }

        if (!walletAddress || walletAddress.length < 20) {
            showToast('Please enter a valid BEP20 wallet address', 'error');
            return;
        }

        try {
            await dispatch(reqUserWithdraws({
                wallet_address: walletAddress,
                amount: reqVal,
            })).unwrap();

            showToast('Withdrawal request submitted successfully!', 'success');
            setAmount('');
            setWalletAddress('');
            dispatch(fetchProfile());
            router.push('/user/withdraw-history');
        } catch (err: any) {
            showToast(err?.message || 'Failed to submit withdrawal request', 'error');
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">Withdrawal Request</h1>
                    <p className="text-xs text-[#8B85A3]">Request USDT payout to your external wallet</p>
                </div>
            </div>

            {/* Penalty Alert */}
            {hasPenalties && (
                <div className="rounded-2xl border border-[#E24B4A]/40 bg-[#E24B4A]/10 p-5 space-y-3">
                    <div className="flex items-center gap-2.5 text-[#E24B4A]">
                        <FaBan className="h-5 w-5" />
                        <h2 className="text-sm font-bold">Active Penalties Detected</h2>
                    </div>
                    <p className="text-xs text-[#8B85A3]">
                        Withdrawals are locked while you have unsettled penalties ({totalPendingAmount.toFixed(2)} USDT pending).
                    </p>
                </div>
            )}

            {/* Withdrawal Form Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl space-y-5">
                <div>
                    <p className="text-xs text-[#8B85A3]">Available Staking Balance</p>
                    <p className="text-2xl font-bold text-[#F4F2FB]">
                        ${Number(profile?.user?.balance ?? 0).toFixed(2)} USDT
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Withdrawal Amount (USDT)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="Minimum 10 USDT"
                            className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none disabled:opacity-50"
                            step="0.01"
                            min="10"
                            disabled={hasPenalties || userPenaltiesLoading}
                            required
                        />
                    </div>

                    {/* Breakdown calculation box */}
                    {withdrawAmount > 0 && !hasPenalties && (
                        <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-[#8B85A3]">Requested Amount</span>
                                <span className="font-semibold text-[#F4F2FB]">${withdrawAmount.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-xs">
                                <span className="text-[#8B85A3]">Processing Fee ({feePercentage}%)</span>
                                <span className="font-semibold text-[#E24B4A]">-${feeAmount.toFixed(2)}</span>
                            </div>
                            <div className="border-t border-[#221E2F] pt-2 flex justify-between text-xs">
                                <span className="font-semibold text-[#A78BFA]">Net Payout Amount</span>
                                <span className="font-bold text-[#22C55E] text-sm">${amountAfterFee.toFixed(2)} USDT</span>
                            </div>
                        </div>
                    )}

                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Recipient Wallet Address (USDT - BEP20)</label>
                        <input
                            type="text"
                            value={walletAddress}
                            onChange={(e) => setWalletAddress(e.target.value)}
                            placeholder="0x..."
                            className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-xs font-mono font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none disabled:opacity-50"
                            disabled={hasPenalties || userPenaltiesLoading}
                            required
                        />
                    </div>

                    {/* Warning info box */}
                    <div className="flex items-start gap-2.5 rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 text-xs text-[#8B85A3]">
                        <FaExclamationTriangle className="h-4 w-4 text-[#A78BFA] flex-shrink-0 mt-0.5" />
                        <span>
                            Processing fee of 8% applies. Payouts are reviewed and fulfilled within 1-12 hours.
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={loading || hasPenalties || userPenaltiesLoading || !amount}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CF0] py-4 text-sm font-semibold text-[#F4F2FB] shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50"
                    >
                        <FaArrowUp className="h-4 w-4" />
                        <span>{userPenaltiesLoading ? 'Checking Account...' : hasPenalties ? 'Withdrawal Locked' : loading ? 'Submitting...' : 'Submit Withdrawal Request'}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}