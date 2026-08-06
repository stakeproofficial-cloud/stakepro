'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import Image from "next/image";
import Link from "next/link";
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/authSlice';
import { useToast } from '@/components/ToastProvider';

export default function Home() {
    const [mounted, setMounted] = useState(false);
    const [progressPercent, setProgressPercent] = useState(0);
    const { showToast } = useToast();

    const dispatch = useAppDispatch();
    const { profile } = useSelector((s: RootState) => s.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (profile?.stats) {
            const totalProfits = parseFloat(profile.stats.total_profits ?? 0);
            const activeInvestment = parseFloat(profile.stats.active_investment ?? 0);

            const percent =
                activeInvestment > 0
                    ? Math.min(Math.max((totalProfits / (activeInvestment * 3)) * 100, 0), 100)
                    : 0;
            setProgressPercent(Number(percent.toFixed(2)));
        }
    }, [profile]);

    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-10 bg-[#07111f] sm:items-start">
            <div className="flex justify-between items-center w-full px-4 mb-6 rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_25px_60px_rgba(0,0,0,0.35)]">
                <div className="flex-1 text-left">
                    <div className="text-xl font-semibold text-white">
                        ${Number(profile?.user?.balance ?? 0).toFixed(2)}
                    </div>
                    <div className="text-xs text-slate-400">Available Balance</div>
                </div>

                <div className="flex-shrink-0 mx-4">
                    <div className="relative w-24 h-24">
                        <Image
                            src={profile?.user?.image_url || 'https://placehold.co/600x400'}
                            alt="Profile"
                            fill
                            className="rounded-full object-cover border-4 border-pm-gold-900"
                            unoptimized
                        />
                    </div>
                </div>

                <div className="flex-1 text-right">
                    <div className="text-lg font-semibold text-white">
                        {(profile?.user?.first_name || "") + " " + (profile?.user?.last_name || "")}
                    </div>
                    <div className="text-xs text-slate-400">Welcome to StakePro</div>
                </div>
            </div>
            <div className='flex justify-around w-full px-4 mb-6'>
                <Link
                    href="/user/deposit"
                    className="group rounded-lg border border-pm-gold-900/20 px-5 py-4 transition-colors hover:border-pm-gold-900/40 hover:bg-pm-brown-900/40 flex flex-col items-center"
                >
                    <Image src="/deposit.png" alt="Deposit" width={32} height={32} unoptimized />
                    <h2 className={`mb-3 text-2xl font-semibold text-white`} style={{ textShadow: '0 0 1px #ffbd59, 0 0 2px #ffbd59' }}>
                        Deposit{' '}

                    </h2>
                </Link>
                <Link
                    href="/user/usdt-staking"
                    className="group rounded-lg border border-pm-gold-900/20 px-5 py-4 transition-colors hover:border-pm-gold-900/40 hover:bg-pm-brown-900/40 flex flex-col items-center"
                >
                    <Image src="/staking.png" alt="Staking" width={32} height={32} unoptimized />
                    <h2 className={`mb-3 text-2xl font-semibold text-white`} style={{ textShadow: '0 0 1px #ffbd59, 0 0 2px #ffbd59' }}>
                        Staking{' '}
                    </h2>
                </Link>
            </div>

            <section className="grid grid-cols-2 gap-3 mb-6 px-4 w-full">
                <div className="rounded-[2rem] border border-white/10 bg-[#0f1a2b]/85 shadow-[0_24px_50px_rgba(0,0,0,0.35)] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-cyan-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <h3 className="text-xs font-medium text-slate-300">My Invest Profit</h3>
                    </div>
                    <p className="text-xl font-bold text-cyan-300">
                        ${Number(profile?.stats?.total_profits ?? 0).toFixed(2)}
                    </p>
                </div>

                <div className="rounded-[2rem] border border-white/10 bg-[#0f1a2b]/85 shadow-[0_24px_50px_rgba(0,0,0,0.35)] p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <svg className="w-4 h-4 text-violet-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        <h3 className="text-xs font-medium text-slate-300">Team Commissions</h3>
                    </div>
                    <p className="text-xl font-bold text-violet-300">
                        ${Number(profile?.stats?.referral_earnings ?? 0).toFixed(2)}
                    </p>
                </div>
            </section>

            <section className="mb-6 w-full px-4">
                <h2 className="text-xl font-bold mb-4 text-white">3x Progress Bar</h2>
                <div className="w-full bg-white/10 rounded-full h-4 relative overflow-hidden">
                    <div
                        className="bg-gradient-to-r from-amber-400 to-cyan-400 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                    />
                    <span className="absolute right-3 top-[-1.5rem] text-xs text-slate-300">{progressPercent}%</span>
                </div>

                <div className="mt-6 space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">Referral Code</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(profile?.user?.referral_code || "");
                                    showToast('Referral code copied!', 'success');
                                }}
                                className="text-xs bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition"
                            >
                                Copy Code
                            </button>
                        </div>
                        <p className="text-sm text-pm-gold-500 font-mono bg-pm-brown-900/40 p-2 rounded border border-pm-gold-900/30">
                            {profile?.user?.referral_code || "Loading..."}
                        </p>
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <h3 className="text-sm font-semibold text-gray-700">Referral Link</h3>
                            <button
                                onClick={() => {
                                    const referralLink = `${window.location.origin}/register?ref=${profile?.user?.referral_code || ""}`;
                                    navigator.clipboard.writeText(referralLink);
                                    showToast('Referral link copied!', 'success');
                                }}
                                className="text-xs bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded transition"
                            >
                                Copy Link
                            </button>
                        </div>
                        <p className="text-xs text-pm-gold-500 font-mono bg-pm-brown-900/40 p-2 rounded border border-pm-gold-900/30 break-all">
                            {mounted ? `${window.location.origin}/register?ref=${profile?.user?.referral_code || ""}` : "Loading..."}
                        </p>
                    </div>
                </div>
            </section>
        </main>
    );
}
