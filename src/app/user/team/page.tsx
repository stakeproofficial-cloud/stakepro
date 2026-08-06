'use client';
import { useAppDispatch } from "@/store/hooks";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { fetchTeam } from "@/store/referralSlice";
import { useEffect } from "react";

export default function Teams() {
    const dispatch = useAppDispatch();
    const { teamData, loading } = useSelector((s: RootState) => s.referral);

    useEffect(() => {
        dispatch(fetchTeam());
    }, [dispatch]);

    const stats = teamData?.stats;
    const byLevel = stats?.by_level || {};

    return (
        <div className="min-h-screen py-10 bg-gradient-to-br from-pm-ink via-pm-char to-pm-brown-900 pb-20">
            <header className="bg-pm-brown-900 text-white p-4 shadow rounded-t-lg mx-4">
                <h1 className="text-xl font-bold">Team Levels</h1>
            </header>

            {/* Summary */}
            <div className="p-4 mx-4 bg-pm-brown-900/40 border border-pm-gold-900/30 shadow mb-4 rounded">
                {loading ? (
                    <p className="text-pm-gold-500">Loading team data...</p>
                ) : (
                    <div className="flex justify-between text-sm text-pm-gold-500">
                        <div>Team Size: <span className="font-semibold">{stats?.total_users || 0}</span></div>
                        <div>Total Business: <span className="font-semibold">${Number(stats?.total_investment || 0).toFixed(2)}</span></div>
                        <div>Total Rewards: <span className="font-semibold">${Number(stats?.total_rewards || 0).toFixed(2)}</span></div>
                    </div>
                )}
            </div>

            {/* Levels Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">
                {Object.entries(byLevel).map(([level, data]) => (
                    <div key={level} className="bg-pm-brown-900/40 p-4 rounded shadow border border-pm-gold-900/30">
                        <h2 className="text-lg font-semibold mb-2 text-pm-gold-500">Level {level}</h2>
                        <p className="text-sm text-pm-gold-500">Total Users: <span className="font-semibold">{data.users}</span></p>
                        <p className="text-sm text-pm-gold-500">Total Business: <span className="font-semibold">${Number(data.total_investment).toFixed(2)}</span></p>
                        <p className="text-sm text-pm-gold-500">Total Rewards: <span className="font-semibold">${Number(data.total_rewards).toFixed(2)}</span></p>
                    </div>
                ))}
            </div>

            {/* Referral Code */}
            {teamData?.referral_code && (
                <div className="mt-6 mx-4 p-4 bg-pm-brown-900/40 border border-pm-gold-900/30 rounded">
                    <p className="text-sm text-pm-muted">Your Referral Code:</p>
                    <p className="text-lg font-mono font-bold text-pm-gold-500">{teamData.referral_code}</p>
                </div>
            )}
        </div>
    );
}