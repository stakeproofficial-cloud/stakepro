'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchTeamInv, fetchMilestoneProgress } from '@/store/referralSlice';
import Link from 'next/link';

export default function RanksPage() {
    const dispatch = useAppDispatch();
    // Using milestoneProgress from your referralSlice based on the JSON provided
    const { milestoneProgress } = useSelector((s: RootState) => s.referral);

    useEffect(() => {
        dispatch(fetchTeamInv());
        dispatch(fetchMilestoneProgress());
    }, [dispatch]);

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="card-premium rounded-lg shadow-lg p-6 w-full">
                <h2 className="text-2xl font-bold mb-6 text-pm-gold-500">All Ranks & Milestones</h2>

                <div className="space-y-4">
                    {milestoneProgress?.map((item) => {
                        const isUnlocked = item.status.is_unlocked;
                        const percent = item.progress.overall_percent;

                        return (
                            <Link
                                key={item.milestone_id}
                                href={`/user/ranks/${item.milestone_id}`}
                                className={`block p-5 rounded-lg border transition-all ${isUnlocked
                                        ? 'border-pm-gold-500 bg-pm-gold-900/20 shadow-md'
                                        : 'border-pm-gold-900/10 bg-pm-brown-900/10 opacity-80'
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    {/* Milestone Image/Icon */}
                                    <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md border border-pm-gold-900/30">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="h-full w-full object-cover"
                                        />
                                    </div>

                                    <div className="flex-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-bold text-lg text-pm-gold-500 uppercase">
                                                {item.name}
                                            </h3>
                                            {isUnlocked && (
                                                <span className="text-[10px] font-bold bg-pm-gold-500 text-black px-2 py-0.5 rounded uppercase">
                                                    Unlocked
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            {/* Self Investment Info */}
                                            <div className="flex flex-col">
                                                <span className="text-xs text-pm-muted">Self Investment</span>
                                                <span className={`text-sm font-medium ${item.status.self_completed ? 'text-green-500' : 'text-white'}`}>
                                                    ${item.user_current.self_investments.toLocaleString()} / ${item.requirements.self_investment_required.toLocaleString()}
                                                </span>
                                            </div>

                                            {/* Direct Investment Info */}
                                            <div className="flex flex-col">
                                                <span className="text-xs text-pm-muted">Direct Referrals</span>
                                                <span className={`text-sm font-medium ${item.status.direct_completed ? 'text-green-500' : 'text-white'}`}>
                                                    ${item.user_current.direct_investments.toLocaleString()} / ${item.requirements.direct_investment_required.toLocaleString()}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Progress Bar */}
                                        <div className="mt-4">
                                            <div className="flex justify-between text-[10px] mb-1 uppercase tracking-wider">
                                                <span className="text-pm-muted">Completion Progress</span>
                                                <span className="text-pm-gold-500 font-bold">{percent}%</span>
                                            </div>
                                            <div className="w-full bg-black/40 rounded-full h-2 relative border border-pm-gold-900/20">
                                                <div
                                                    className="bg-gradient-to-r from-pm-gold-900 to-pm-gold-500 h-full rounded-full transition-all duration-700 ease-out"
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}