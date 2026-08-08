'use client';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchProfile } from '@/store/authSlice';
import Image from 'next/image';
import Link from 'next/link';
import {
    FaUser,
    FaCoins,
    FaArrowDown,
    FaArrowUp,
    FaUsers,
    FaChevronRight,
    FaKey,
    FaHeadset,
    FaInfoCircle,
    FaSignOutAlt
} from 'react-icons/fa';

export default function PersonalCenterPage() {
    const dispatch = useAppDispatch();
    const { profile } = useSelector((s: RootState) => s.auth);

    useEffect(() => {
        dispatch(fetchProfile());
    }, [dispatch]);

    const user = profile?.user;

    const getInitials = () => {
        const f = user?.first_name ? user.first_name[0].toUpperCase() : '';
        const l = user?.last_name ? user.last_name[0].toUpperCase() : '';
        const combined = `${f}${l}`;
        return combined || 'SP';
    };

    const fullName = user
        ? `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Valued Member'
        : 'Member Profile';

    const menuSections = [
        {
            title: 'Account Settings',
            items: [
                { icon: FaUser, label: 'Profile Center', href: '/user/profile' },
                { icon: FaKey, label: 'Change Password', href: '/user/change-password' },
                { icon: FaCoins, label: 'USDT Staking', href: '/user/usdt-staking' },
            ]
        },
        {
            title: 'Financial & Wallet',
            items: [
                { icon: FaArrowDown, label: 'Deposit USDT', href: '/user/deposit' },
                { icon: FaArrowUp, label: 'Withdrawal Request', href: '/user/withdraw' },
            ]
        },
        {
            title: 'Community & Help',
            items: [
                { icon: FaHeadset, label: 'Support & Tickets', href: '/user/support' },
                { icon: FaInfoCircle, label: 'About StakePro', href: '/user/about-us' },
            ]
        }
    ];

    return (
        <div className="space-y-6 pb-8">
            {/* Profile Summary Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl space-y-4">
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
                        <h1 className="text-lg font-bold text-[#F4F2FB] tracking-tight">{fullName}</h1>
                        <p className="text-xs font-mono text-[#8B85A3]">{user?.email}</p>
                    </div>
                </div>

                {/* Quick Balance Pills */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                    <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-center">
                        <p className="text-[11px] text-[#8B85A3]">Balance</p>
                        <p className="mt-1 text-sm font-semibold text-[#F4F2FB]">
                            ${Number(user?.balance ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-center">
                        <p className="text-[11px] text-[#8B85A3]">Total Profits</p>
                        <p className="mt-1 text-sm font-semibold text-[#22C55E]">
                            +${Number(profile?.stats?.total_profits ?? 0).toFixed(2)}
                        </p>
                    </div>
                    <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-center">
                        <p className="text-[11px] text-[#8B85A3]">Active Stake</p>
                        <p className="mt-1 text-sm font-semibold text-[#A78BFA]">
                            ${Number(profile?.stats?.active_staking ?? profile?.stats?.active_investment ?? 0).toFixed(2)}
                        </p>
                    </div>
                </div>
            </div>

            {/* Menu Links */}
            {menuSections.map((section, idx) => (
                <div key={idx} className="space-y-2.5">
                    <h3 className="text-xs font-semibold text-[#8B85A3] px-1">{section.title}</h3>
                    <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-2 space-y-1">
                        {section.items.map((item, itemIdx) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={itemIdx}
                                    href={item.href}
                                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-[#F4F2FB] transition hover:bg-[#1A1626]"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CF0]/15 text-[#A78BFA]">
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        <span>{item.label}</span>
                                    </div>
                                    <FaChevronRight className="h-3 w-3 text-[#6F6A83]" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            ))}

            {/* Logout Action */}
            <Link
                href="/logout"
                className="flex items-center justify-center gap-2 rounded-2xl border border-[#E24B4A]/30 bg-[#E24B4A]/10 py-4 text-sm font-semibold text-[#E24B4A] transition hover:bg-[#E24B4A]/20 active:scale-[0.99]"
            >
                <FaSignOutAlt className="h-4 w-4" />
                <span>Log Out</span>
            </Link>
        </div>
    );
}