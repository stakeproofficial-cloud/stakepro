'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useToast } from '@/components/ToastProvider';
import { useAppDispatch } from '@/store/hooks';
import { fetchTeamach, claimAchievement, fetchMilestoneProgress } from '@/store/referralSlice';
import { RootState } from '@/store/store';
import { useSelector } from 'react-redux';

export default function RankDetailPage() {
    const params = useParams();
    const id = params?.id ?? '1';
    const idNum = Number(id);
    const [src, setSrc] = useState(`/rank${id}.jpg`);
    const { showToast } = useToast();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { ach, loading, milestoneProgress } = useSelector((s: RootState) => s.referral);

    useEffect(() => {
        dispatch(fetchTeamach());
        dispatch(fetchMilestoneProgress());
    }, [dispatch]);

    const handleClaim = async () => {
        const achId = Number(ach?.achievements.find((a: any) => Number(a.achievement_type.split('_').pop()) === idNum && a.status !== 'claimed')?.id);
        if (!achId) {
            showToast('No achievement available to claim', 'error');
            return;
        }

        try {
            await dispatch(claimAchievement(achId)).unwrap();
            showToast(`Rank ${id} claimed!`, 'success');
            dispatch(fetchTeamach());
        } catch (err: any) {
            showToast(err?.message || 'Claim failed', 'error');
        }
    };

    return (
        <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-start py-10 px-4">
            <div className="card-premium rounded-lg shadow-lg p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold mb-4 text-pm-gold-500">Rank {milestoneProgress?.find((m: any) => m.milestone_id === idNum)?.name ? milestoneProgress.find((m: any) => m.milestone_id === idNum)?.name : id}</h2>

                <div className="flex flex-col items-center">
                    <div className="w-full h-[280px] relative rounded overflow-hidden">
                        <Image
                            src={milestoneProgress?.find((m: any) => m.milestone_id === idNum)?.image ? milestoneProgress.find((m: any) => m.milestone_id === idNum)?.image.replace(/\+/g, '/') : src}
                            alt={`Rank ${id}`}
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                            onError={() => setSrc('https://placehold.co/600x400?text=Rank+Image')}
                            unoptimized
                        />
                    </div>

                    <button
                        disabled={loading || ach?.achievements?.find((a: any) => Number(a.achievement_type.split('_').pop()) === idNum)?.status === 'claimed'.toString()}
                        onClick={handleClaim}
                        className="mt-6 btn-gold w-full text-white px-4 py-2 rounded"
                    >
                        {
                            ach?.achievements?.find(
                                (a: any) => Number(a.achievement_type.split('_').pop()) === idNum
                            )?.status === 'claimed'
                                ? 'Claimed'
                                : loading
                                    ? 'Claiming...'
                                    : 'Claim'
                        } </button>

                    <button
                        onClick={() => router.push('/user/ranks')}
                        className="mt-3 text-sm text-pm-muted"
                    >
                        Back to ranks
                    </button>
                </div>
            </div>

            {milestoneProgress && milestoneProgress.length > 0 && (
                <div className="mt-8 w-full max-w-4xl">
                    <h3 className="text-xl font-bold mb-4 text-pm-gold-500">Milestone Progress</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {milestoneProgress.map((progress: any) => {
                            const normalizedImage = progress.image?.replace(/\+/g, '/');
                            return (
                                <div key={progress.milestone_id} className="card-premium rounded-lg shadow-lg p-4">
                                    <div className="flex items-center mb-2">
                                        {/* <Image
                                            src={normalizedImage || 'https://placehold.co/100x100?text=Milestone'}
                                            alt={progress.name}
                                            width={50}
                                            height={50}
                                            className="rounded mr-3"
                                            onError={(e) => { e.currentTarget.src = 'https://placehold.co/100x100?text=Milestone'; }}
                                        /> */}
                                        <div>
                                            <h4 className="font-semibold">{progress.name}</h4>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm">Self Investment: {progress.user_current.self_investments} / {progress.requirements.self_investment_required} ({progress.progress.self_percent}%)</p>
                                        {progress.progress.self_remaining > 0 && (
                                            <p className="text-xs text-gray-500">Remaining: {progress.progress.self_remaining}</p>
                                        )}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${Math.min(progress.progress.self_percent, 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm">Direct Investment: {progress.user_current.direct_investments} / {progress.requirements.direct_investment_required} ({progress.progress.direct_percent}%)</p>
                                        {progress.progress.direct_remaining > 0 && (
                                            <p className="text-xs text-gray-500">Remaining: {progress.progress.direct_remaining}</p>
                                        )}
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-green-600 h-2 rounded-full" style={{ width: `${Math.min(progress.progress.direct_percent, 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <p className="text-sm">Overall Progress: {progress.progress.overall_percent}%</p>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${Math.min(progress.progress.overall_percent, 100)}%` }}></div>
                                        </div>
                                    </div>
                                    <p className={`text-sm font-semibold ${progress.status.is_unlocked ? 'text-green-600' : 'text-red-600'}`}>
                                        {progress.status.is_unlocked ? 'Unlocked' : 'Locked'}
                                    </p>
                                    <div className="flex gap-2 text-xs">
                                        <span className={progress.status.self_completed ? 'text-green-600' : 'text-red-600'}>
                                            Self: {progress.status.self_completed ? '✓' : '✗'}
                                        </span>
                                        <span className={progress.status.direct_completed ? 'text-green-600' : 'text-red-600'}>
                                            Direct: {progress.status.direct_completed ? '✓' : '✗'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </main>
    );
}
