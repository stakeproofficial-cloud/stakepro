'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/authSlice';
import { useToast } from '@/components/ToastProvider';
import {
    FaEye,
    FaEyeSlash,
    FaBolt,
    FaCoins,
    FaArrowDown,
    FaArrowUp,
    FaLayerGroup,
    FaChartLine,
    FaGift,
    FaChevronRight,
    FaCopy,
    FaUsers,
    FaOpencart
} from 'react-icons/fa';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [hideBalance, setHideBalance] = useState(false);
    const { showToast } = useToast();

    const dispatch = useAppDispatch();
    const { profile } = useSelector((s: RootState) => s.auth);

    useEffect(() => {
        dispatch(fetchProfile());
        setMounted(true);
    }, [dispatch]);

    const user = profile?.user;
    const stats = profile?.stats;

    const fullName = user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Valued Member'
        : 'Member Profile';

    const getInitials = () => {
        const f = user?.first_name ? user.first_name[0].toUpperCase() : '';
        const l = user?.last_name ? user.last_name[0].toUpperCase() : '';
        const combined = `${f}${l}`;
        return combined || 'SP';
    };

    const balanceValue = Number(user?.balance ?? 0);
    const activeStakingValue = Number(stats?.active_staking ?? stats?.active_investment ?? 0);
    const totalProfitsValue = Number(stats?.total_profits ?? 0);
    const referralEarningsValue = Number(stats?.referral_earnings ?? 0);
    const refferrals = Number(stats?.total_referrals ?? 0);
    const referralCode = user?.referral_code || '';
    const referralLink = mounted
        ? `${window.location.origin}/register?ref=${referralCode}`
        : `https://stakepro.org/register?ref=${referralCode}`;

    const handleCopyCode = () => {
        if (!referralCode) return;
        navigator.clipboard.writeText(referralCode);
        showToast('Referral code copied to clipboard!', 'success');
    };

    const handleCopyLink = () => {
        if (!referralCode) return;
        navigator.clipboard.writeText(referralLink);
        showToast('Referral link copied to clipboard!', 'success');
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Profile & USDT Staking Balance Card */}
            <div className="relative overflow-hidden rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl shadow-[#7C5CF0]/10">
                {/* Soft ambient purple glow in top-right corner */}
                <div className="absolute -top-10 -right-10 h-36 w-36 rounded-full bg-[#7C5CF0]/15 blur-2xl pointer-events-none" />

                <div className="relative z-10 space-y-4">
                    {/* Top Row: Avatar & Profile Info */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-2 border-[#7C5CF0] bg-[#1C1826] text-xl font-bold text-[#B9A4F7] shadow-lg shadow-[#7C5CF0]/20 overflow-hidden flex-shrink-0">
                                {user?.image_url ? (
                                    <Image
                                        src={user.image_url}
                                        alt="Avatar"
                                        fill
                                        className="object-cover"
                                        unoptimized
                                    />
                                ) : (
                                    <span>{getInitials()}</span>
                                )}
                            </div>
                            <div>
                                <p className="text-xs text-[#8B85A3]">Member Profile</p>
                                <h2 className="text-lg font-semibold text-[#F4F2FB] tracking-tight">{fullName}</h2>
                            </div>
                        </div>

                        {/* Daily Profit Rate Badge */}
                        <div className="flex items-center gap-1.5 rounded-xl border border-[#22C55E]/30 bg-[#12261A] px-3 py-1.5 text-xs font-semibold text-[#22C55E]">
                            <FaBolt className="h-3 w-3 text-[#22C55E]" />
                            <span>0.19% - 0.30 Daily Rate</span>
                        </div>
                    </div>

                    <div className="h-[1px] w-full bg-[#221E2F]" />

                    {/* Middle Row: Balance Display & Mask Toggle */}
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#8B85A3]">USDT Staking Balance</p>
                            <p className="text-2xl font-bold text-[#F4F2FB] tracking-tight">
                                {hideBalance ? '••••••••' : `$${balanceValue.toFixed(2)} USDT`}
                            </p>
                        </div>
                        <button
                            onClick={() => setHideBalance(!hideBalance)}
                            className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5 text-[#8B85A3] transition hover:text-[#F4F2FB]"
                            title={hideBalance ? 'Show Balance' : 'Hide Balance'}
                        >
                            {hideBalance ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Bottom Row: Stat Overview Items */}
                    <div className="grid grid-cols-2 gap-2.5 pt-1 sm:grid-cols-4">
                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                            <div className="flex items-center gap-1.5 text-[#A78BFA]">
                                <FaLayerGroup className="h-3 w-3" />
                                <span className="text-[11px] text-[#8B85A3]">Active Stakes</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#F4F2FB]">${activeStakingValue.toFixed(2)}</p>
                        </div>

                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                            <div className="flex items-center gap-1.5 text-[#22C55E]">
                                <FaChartLine className="h-3 w-3" />
                                <span className="text-[11px] text-[#8B85A3]">Total Profits</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#22C55E]">+${totalProfitsValue.toFixed(2)}</p>
                        </div>

                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                            <div className="flex items-center gap-1.5 text-[#A78BFA]">
                                <FaGift className="h-3 w-3" />
                                <span className="text-[11px] text-[#8B85A3]">Referral Earned</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#A78BFA]">+${referralEarningsValue.toFixed(2)}</p>
                        </div>

                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                            <div className="flex items-center gap-1.5 text-[#8B85A3]">
                                <FaUsers className="h-3 w-3" />
                                <span className="text-[11px] text-[#8B85A3]">Referrals</span>
                            </div>
                            <p className="mt-1 text-sm font-semibold text-[#F4F2FB]">{refferrals}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Quick Actions Grid */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#F4F2FB]">Quick Actions</h3>
                <div className="grid grid-cols-2 gap-3">
                    <Link
                        href="/user/usdt-staking"
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#221E2F] bg-[#1A1626] py-5 text-center transition hover:border-[#7C5CF0]/50 hover:bg-[#1A1626]/80 active:scale-[0.98]"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CF0]/15 text-[#A78BFA]">
                            <FaCoins className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-[#F4F2FB]">Stake USDT</span>
                    </Link>

                    <Link
                        href="/user/deposit"
                        className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-[#221E2F] bg-[#1A1626] py-5 text-center transition hover:border-[#7C5CF0]/50 hover:bg-[#1A1626]/80 active:scale-[0.98]"
                    >
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#7C5CF0]/15 text-[#A78BFA]">
                            <FaArrowDown className="h-5 w-5" />
                        </div>
                        <span className="text-sm font-medium text-[#F4F2FB]">Deposit Funds</span>
                    </Link>
                </div>

                <Link
                    href="/user/withdraw"
                    className="flex items-center gap-3 rounded-2xl border border-[#221E2F] bg-[#1A1626] px-5 py-4 transition hover:border-[#7C5CF0]/50 hover:bg-[#1A1626]/80 active:scale-[0.98]"
                >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C5CF0]/15 text-[#A78BFA]">
                        <FaArrowUp className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium text-[#F4F2FB]">Withdrawal Request</span>
                </Link>
            </div>

            {/* 2x2 Grid Stats Overview Cards */}
            <div className="space-y-3">
                <h3 className="text-sm font-semibold text-[#F4F2FB]">Portfolio Statistics</h3>
                <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4">
                        <FaChartLine className="h-5 w-5 text-[#A78BFA]" />
                        <p className="mt-3 text-xs text-[#8B85A3]">Investments</p>
                        <p className="mt-1 text-base font-semibold text-[#F4F2FB]">${activeStakingValue.toFixed(2)}</p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4">
                        <FaOpencart className="h-5 w-5 text-[#22C55E]" />
                        <p className="mt-3 text-xs text-[#8B85A3]">Profits</p>
                        <p className="mt-1 text-base font-semibold text-[#22C55E]">+${totalProfitsValue.toFixed(2)}</p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4">
                        <FaLayerGroup className="h-5 w-5 text-[#A78BFA]" />
                        <p className="mt-3 text-xs text-[#8B85A3]">Active Pools</p>
                        <p className="mt-1 text-base font-semibold text-[#F4F2FB]">{activeStakingValue > 0 ? '1 Active' : '0 Active'}</p>
                    </div>

                    <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4">
                        <FaGift className="h-5 w-5 text-[#22C55E]" />
                        <p className="mt-3 text-xs text-[#8B85A3]">Referrals Paid</p>
                        <p className="mt-1 text-base font-semibold text-[#22C55E]">+${referralEarningsValue.toFixed(2)}</p>
                    </div>
                </div>
            </div>

            {/* Referral Program Section */}
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-[#F4F2FB]">Referral Program</h3>
                </div>

                <div className="rounded-2xl border border-[#221E2F] bg-[#14111D] p-4 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-[#8B85A3]">Referral Code</span>
                            <button
                                onClick={handleCopyCode}
                                className="flex items-center gap-1.5 rounded-lg bg-[#7C5CF0]/20 px-2.5 py-1 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#7C5CF0]/30"
                            >
                                <FaCopy className="h-3 w-3" />
                                <span>Copy Code</span>
                            </button>
                        </div>
                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-sm font-mono text-[#F4F2FB]">
                            {referralCode || 'Loading code...'}
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs font-medium text-[#8B85A3]">Referral Link</span>
                            <button
                                onClick={handleCopyLink}
                                className="flex items-center gap-1.5 rounded-lg bg-[#22C55E]/20 px-2.5 py-1 text-xs font-semibold text-[#22C55E] transition hover:bg-[#22C55E]/30"
                            >
                                <FaCopy className="h-3 w-3" />
                                <span>Copy Link</span>
                            </button>
                        </div>
                        <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-xs font-mono text-[#A78BFA] break-all">
                            {referralLink}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
