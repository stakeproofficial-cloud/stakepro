'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    FaHome,
    FaCoins,
    FaWallet,
    FaUser,
    FaTimes,
    FaCrosshairs,
    FaArrowUp,
    FaGift
} from 'react-icons/fa';

export default function BottomBar() {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    const toggleWheel = () => {
        setIsOpen(!isOpen);
    };

    const chambers = [
        { href: '/user', icon: FaHome, label: 'Home' },
        { href: '/user/usdt-staking', icon: FaCoins, label: 'Staking' },
        { href: '/user/deposit', icon: FaWallet, label: 'Deposit' },
        { href: '/user/personal-center', icon: FaUser, label: 'Account' },
        { href: '/user/withdraw', icon: FaArrowUp, label: 'Withdraw' },
        { href: '/user/team', icon: FaGift, label: 'Referral' },
    ];

    // Calculate polar coordinates for 6 radial chambers spaced 60° apart starting from top (-90°)
    const getChamberStyle = (index: number) => {
        const radius = 95; // Radius in pixels
        const angleDegrees = -90 + index * 60;
        const angleRadians = (angleDegrees * Math.PI) / 180;
        const x = 110 + radius * Math.cos(angleRadians) - 23; // 110 is center of 220px wheel, 23 is half of 46px chamber badge
        const y = 110 + radius * Math.sin(angleRadians) - 23;

        return {
            left: `${x}px`,
            top: `${y}px`,
        };
    };

    return (
        <>
            {/* Scrim Backdrop Overlay when Revolver Wheel is open */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-[#050409]/70 backdrop-blur-sm transition-opacity duration-300"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Radial Wheel Popover */}
            {isOpen && (
                <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2 transition-all duration-300">
                    <div className="relative h-[220px] w-[220px] rounded-full border border-[#2C2740] bg-[#14111D] shadow-[0_16px_50px_rgba(0,0,0,0.8)] animate-in zoom-in-75 duration-200">
                        {/* Faint center background watermark icon */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-10">
                            <FaCrosshairs className="h-20 w-20 text-[#A78BFA]" />
                        </div>

                        {/* 6 Radial Chambers */}
                        {chambers.map((chamber, idx) => {
                            const Icon = chamber.icon;
                            const isActive = pathname === chamber.href;
                            return (
                                <Link
                                    key={chamber.href}
                                    href={chamber.href}
                                    onClick={() => setIsOpen(false)}
                                    style={getChamberStyle(idx)}
                                    className={`absolute flex h-11 w-11 items-center justify-center rounded-full border transition-all duration-200 ${
                                        isActive
                                            ? 'border-[#A78BFA] bg-[#3A2F66] text-[#E3D9FF] shadow-lg shadow-[#7C5CF0]/40 scale-110'
                                            : 'border-[#322C42] bg-[#1C1826] text-[#A78BFA] hover:border-[#7C5CF0] hover:scale-105'
                                    }`}
                                    title={chamber.label}
                                >
                                    <Icon className="h-4 w-4" />
                                </Link>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Flat Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#221E2F] bg-[#0D0B13]/95 backdrop-blur-lg">
                <div className="relative mx-auto flex h-[72px] max-w-md items-center justify-between px-6">
                    {/* Home Tab */}
                    <Link
                        href="/user"
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                            pathname === '/user' ? 'text-[#A78BFA]' : 'text-[#6F6A83] hover:text-[#8B85A3]'
                        }`}
                    >
                        <FaHome className="h-5 w-5" />
                        <span className="text-[10px] font-medium tracking-wide">Home</span>
                    </Link>

                    {/* Staking Tab */}
                    <Link
                        href="/user/usdt-staking"
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                            pathname === '/user/usdt-staking' ? 'text-[#A78BFA]' : 'text-[#6F6A83] hover:text-[#8B85A3]'
                        }`}
                    >
                        <FaCoins className="h-5 w-5" />
                        <span className="text-[10px] font-medium tracking-wide">Staking</span>
                    </Link>

                    {/* Spacer for Center FAB */}
                    <div className="w-12" />

                    {/* Wallet Tab */}
                    <Link
                        href="/user/deposit"
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                            pathname === '/user/deposit' || pathname === '/user/withdraw'
                                ? 'text-[#A78BFA]'
                                : 'text-[#6F6A83] hover:text-[#8B85A3]'
                        }`}
                    >
                        <FaWallet className="h-5 w-5" />
                        <span className="text-[10px] font-medium tracking-wide">Wallet</span>
                    </Link>

                    {/* Account Tab */}
                    <Link
                        href="/user/personal-center"
                        className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                            pathname === '/user/personal-center' ? 'text-[#A78BFA]' : 'text-[#6F6A83] hover:text-[#8B85A3]'
                        }`}
                    >
                        <FaUser className="h-5 w-5" />
                        <span className="text-[10px] font-medium tracking-wide">Account</span>
                    </Link>

                    {/* Center Trigger FAB */}
                    <button
                        onClick={toggleWheel}
                        className={`absolute left-1/2 -top-5 flex h-[56px] w-[56px] -translate-x-1/2 items-center justify-center rounded-full border-[2.5px] border-[#0A0A10] bg-[#7C5CF0] text-[#F4F2FB] shadow-xl shadow-[#7C5CF0]/40 transition-transform duration-300 active:scale-95 ${
                            isOpen ? 'rotate-180 bg-[#14111D]' : ''
                        }`}
                        aria-label="Toggle Navigation Wheel"
                    >
                        {isOpen ? (
                            <FaTimes className="h-5 w-5 text-[#F4F2FB]" />
                        ) : (
                            <FaCrosshairs className="h-6 w-6 text-[#F4F2FB]" />
                        )}
                    </button>
                </div>
            </div>
        </>
    );
}
