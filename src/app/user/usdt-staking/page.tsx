'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { useToast } from '@/components/ToastProvider';
import {
    createStaking,
    fetchStakings,
    fetchBalance,
} from '@/store/usdtStakingSlice';
import { fetchProfile } from '@/store/authSlice';
import { parseDecimal } from '@/utils/validators';
import { FaCoins, FaBolt, FaLayerGroup, FaCheckCircle, FaStar } from 'react-icons/fa';

export default function UsdtStakingPage() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { profile } = useAppSelector((s) => s.auth);
    const { stakings, balance, loading, error } = useAppSelector(
        (s) => s.usdtStaking
    );

    const [amount, setAmount] = useState('');
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        if (!profile) {
            dispatch(fetchProfile());
        } else {
            dispatch(fetchStakings());
            dispatch(fetchBalance());
        }
    }, [dispatch, profile]);

    const currentBalance = balance?.balance ?? Number(profile?.user?.balance ?? 0);

    const handleQuickSelect = (val: number) => {
        setAmount(val.toString());
    };

    const handleSelectMax = () => {
        setAmount(currentBalance.toString());
    };

    const handleCreateStaking = async (e: React.FormEvent) => {
        e.preventDefault();

        const numVal = parseDecimal(amount);
        if (!amount || numVal <= 0) {
            showToast('Please enter a valid staking amount', 'error');
            return;
        }

        if (numVal > currentBalance) {
            showToast('Insufficient USDT staking balance', 'error');
            return;
        }

        setIsCreating(true);
        try {
            await dispatch(
                createStaking({
                    amount: numVal,
                })
            ).unwrap();

            showToast('USDT Staking contract initialized successfully!', 'success');
            setAmount('');
            dispatch(fetchStakings());
            dispatch(fetchBalance());
        } catch (err: any) {
            const msg = err?.message || 'Failed to create staking';
            showToast(msg, 'error');
        } finally {
            setIsCreating(false);
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header Title Banner */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">USDT Staking Pool</h1>
                    <p className="text-xs text-[#8B85A3]">Stake USDT to earn daily rewards up to 2x target</p>
                </div>
                <div className="flex items-center gap-1.5 rounded-xl border border-[#22C55E]/30 bg-[#12261A] px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
                    <FaBolt className="h-3 w-3 text-[#22C55E]" />
                    <span>0.19% to 0.30% Daily Yield</span>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-[#E24B4A]/30 bg-[#E24B4A]/10 p-4 text-xs font-medium text-[#E24B4A]">
                    {error}
                </div>
            )}

            {/* Staking Form Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl space-y-5">
                <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#F4F2FB]">Stake Amount</span>
                    <span className="text-xs text-[#8B85A3]">
                        Available: <strong className="text-[#A78BFA]">${currentBalance.toFixed(2)} USDT</strong>
                    </span>
                </div>

                {/* Amount Input Box */}
                <div className="relative">
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 pl-4 pr-16 text-lg font-bold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                        disabled={isCreating}
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-[#A78BFA]">
                        USDT
                    </span>
                </div>

                {/* Quick Selection Chips */}
                <div className="grid grid-cols-5 gap-2">
                    {[50, 100, 500, 1000].map((val) => (
                        <button
                            key={val}
                            type="button"
                            onClick={() => handleQuickSelect(val)}
                            className="rounded-xl border border-[#221E2F] bg-[#1A1626] py-2 text-xs font-semibold text-[#8B85A3] transition hover:border-[#7C5CF0] hover:text-[#F4F2FB]"
                        >
                            ${val}
                        </button>
                    ))}
                    <button
                        type="button"
                        onClick={handleSelectMax}
                        className="rounded-xl border border-[#7C5CF0]/40 bg-[#7C5CF0]/15 py-2 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#7C5CF0]/25"
                    >
                        MAX
                    </button>
                </div>

                {/* Terms & Target Summary Box */}
                <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8B85A3]">Daily Reward Rate</span>
                        <span className="font-semibold text-[#22C55E]">0.19% to 0.30% Daily</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8B85A3]">Return Target</span>
                        <span className="font-semibold text-[#A78BFA]">2x to 3x Target</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-[#8B85A3]">Yield Distribution</span>
                        <span className="font-medium text-[#F4F2FB]">Every 24 Hours</span>
                    </div>
                </div>

                {/* Submit Action Button */}
                <button
                    onClick={handleCreateStaking}
                    disabled={isCreating || loading || !amount}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CF0] py-4 text-sm font-semibold text-[#F4F2FB] shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50"
                >
                    <FaCoins className="h-4 w-4" />
                    <span>{isCreating ? 'Initializing Staking...' : 'Confirm & Stake USDT'}</span>
                </button>
            </div>

            {/* Active Stakings Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#F4F2FB]">Your Active Stakings</h3>
                    <span className="text-xs text-[#8B85A3]">{stakings.length} Pool(s)</span>
                </div>

                {loading ? (
                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-8 text-center text-xs text-[#8B85A3]">
                        Loading active stakings...
                    </div>
                ) : stakings.length === 0 ? (
                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-8 text-center space-y-2">
                        <FaLayerGroup className="mx-auto h-8 w-8 text-[#6F6A83]" />
                        <p className="text-sm font-medium text-[#F4F2FB]">No active stakings</p>
                        <p className="text-xs text-[#8B85A3]">Enter an amount above to begin earning daily rewards.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {stakings.map((staking) => {
                            const completion = Number(staking.completion_percentage ?? 0);
                            return (
                                <div
                                    key={staking.id}
                                    className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4 space-y-3"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CF0]/15 text-[#A78BFA]">
                                                <FaCoins className="h-4 w-4" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-[#F4F2FB]">
                                                    ${Number(staking.amount).toFixed(2)} USDT
                                                </p>
                                                <p className="text-[11px] text-[#8B85A3]">
                                                    Max Return: ${Number(staking.max_return).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <span
                                            className={`rounded-xl px-2.5 py-1 text-[11px] font-semibold uppercase ${staking.state === 'active'
                                                ? 'bg-[#12261A] text-[#22C55E] border border-[#22C55E]/30'
                                                : 'bg-[#1A1626] text-[#8B85A3] border border-[#221E2F]'
                                                }`}
                                        >
                                            {staking.state}
                                        </span>
                                    </div>



                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
