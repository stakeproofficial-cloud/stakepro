'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/authSlice';
import Image from 'next/image';
import Link from 'next/link';

export default function PersonalCenterPage() {
    const dispatch = useAppDispatch();
    const { profile } = useSelector((s: RootState) => s.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const menuItems = [
        {
            title: 'Account',
            items: [
                { icon: '👤', label: 'Profile Settings', href: '/user/profile' },
                { icon: '💰', label: 'Staking', href: '/user/usdt-staking' },
                { icon: '📊', label: 'Transactions', href: '/user/transactions' },
            ]
        },
        {
            title: 'Financial',
            items: [
                { icon: '💵', label: 'Deposit', href: '/user/deposit' },
                { icon: '💸', label: 'Withdraw', href: '/user/withdraw' },
                { icon: '📜', label: 'Withdraw History', href: '/user/withdraw-history' },
            ]
        },
        {
            title: 'Team',
            items: [
                { icon: '👥', label: 'Team Levels', href: '/user/team' },
                // { icon: '🏆', label: 'My Rank', href: '/user/ranks' },
            ]
        }
    ];

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <div className="w-full space-y-6">
                {/* Profile Header */}
                <div className="card-premium rounded-lg shadow-lg p-6">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="relative w-20 h-20">
                            <Image
                                src={profile?.user?.image_url || 'https://placehold.co/600x400'}
                                alt="Profile"
                                fill
                                className="rounded-full object-cover border-4 border-pm-gold-900"
                                unoptimized
                            />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-pm-gold-500">
                                {profile?.user?.first_name || profile?.user?.name || 'User'} {profile?.user?.last_name || ''}
                            </h1>
                            <p className="text-pm-muted">{profile?.user?.email}</p>
                        </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-4">
                        <div className="text-center p-3 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                            <p className="text-sm text-pm-muted">Balance</p>
                            <p className="text-sm font-bold text-pm-gold-500">
                                ${Number(profile?.user?.balance ?? 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                            <p className="text-sm text-pm-muted">Total Profits</p>
                            <p className="text-sm font-bold text-pm-gold-500">
                                ${Number(profile?.stats?.total_profits ?? 0).toFixed(2)}
                            </p>
                        </div>
                        <div className="text-center p-3 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                            <p className="text-sm text-pm-muted">Active</p>
                            <p className="text-sm font-bold text-pm-gold-500">
                                ${Number(profile?.stats?.active_investment ?? 0).toFixed(2)}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Menu Sections */}
                {menuItems.map((section, idx) => (
                    <div key={idx} className="card-premium rounded-lg shadow-lg p-6">
                        <h2 className="text-xl font-bold mb-4 text-pm-gold-500">{section.title}</h2>
                        <div className="space-y-2">
                            {section.items.map((item, itemIdx) => (
                                <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className="flex items-center justify-between p-4 bg-pm-brown-900/30 rounded-lg border border-pm-gold-900/20 hover:border-pm-gold-500 transition"
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className="text-pm-gold-500">{item.label}</span>
                                    </div>
                                    <svg
                                        className="w-5 h-5 text-pm-gold-500"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 5l7 7-7 7"
                                        />
                                    </svg>
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}

                {/* Logout Button */}
                <div className="card-premium rounded-lg shadow-lg p-6">
                    <Link
                        href="/logout"
                        className="flex items-center justify-center gap-3 p-4 bg-red-900/20 rounded-lg border border-red-500/50 text-red-400 hover:bg-red-900/30 transition"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                            />
                        </svg>
                        <span className="font-semibold">Log Out</span>
                    </Link>
                </div>
            </div>
        </main>
    );
}