'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
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
        { href: '/user/withdraw-history', icon: FaGift, label: 'Referral' },
    ];

    const bottomTabs = [
        { href: '/user', icon: FaHome, label: 'Home' },
        { href: '/user/usdt-staking', icon: FaCoins, label: 'Staking' },
        { href: '/user/deposit', icon: FaWallet, label: 'Wallet', altHrefs: ['/user/deposit', '/user/withdraw'] },
        { href: '/user/personal-center', icon: FaUser, label: 'Account' },
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
            <AnimatePresence>
                {/* Backdrop Scrim Overlay with Blur */}
                {isOpen && (
                    <motion.div
                        key="revolver-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="fixed inset-0 z-40 bg-[#050409]/75 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />
                )}

                {/* Radial Wheel Speed Dial Popover */}
                {isOpen && (
                    <div className="fixed bottom-24 left-1/2 z-50 -translate-x-1/2">
                        <motion.div
                            key="revolver-wheel"
                            initial={{ scale: 0.15, opacity: 0, rotate: -60 }}
                            animate={{ scale: 1, opacity: 1, rotate: 0 }}
                            exit={{ scale: 0.15, opacity: 0, rotate: 45 }}
                            transition={{
                                type: 'spring',
                                damping: 20,
                                stiffness: 320,
                                mass: 0.8,
                            }}
                            className="relative h-[220px] w-[220px] rounded-full border border-[#2C2740] bg-[#14111D] shadow-[0_20px_60px_rgba(124,92,240,0.35)]"
                        >
                            {/* Center Faint Crosshair Watermark */}
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-15">
                                <FaCrosshairs className="h-20 w-20 text-[#A78BFA]" />
                            </div>

                            {/* 6 Radial Chamber Badges with Staggered Flutter Spring Explosions */}
                            {chambers.map((chamber, idx) => {
                                const Icon = chamber.icon;
                                const isActive = pathname === chamber.href;
                                return (
                                    <motion.div
                                        key={chamber.href}
                                        style={getChamberStyle(idx)}
                                        className="absolute"
                                        initial={{ scale: 0, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        exit={{ scale: 0, opacity: 0 }}
                                        transition={{
                                            type: 'spring',
                                            stiffness: 420,
                                            damping: 22,
                                            delay: idx * 0.035,
                                        }}
                                    >
                                        <Link
                                            href={chamber.href}
                                            onClick={() => setIsOpen(false)}
                                            title={chamber.label}
                                        >
                                            <motion.div
                                                whileHover={{ scale: 1.2, rotate: 6 }}
                                                whileTap={{ scale: 0.88 }}
                                                className={`flex h-11 w-11 items-center justify-center rounded-full border transition-shadow duration-200 ${isActive
                                                        ? 'border-[#A78BFA] bg-[#3A2F66] text-[#E3D9FF] shadow-[0_0_20px_rgba(124,92,240,0.7)] scale-110'
                                                        : 'border-[#322C42] bg-[#1C1826] text-[#A78BFA] hover:border-[#7C5CF0] hover:text-[#F4F2FB]'
                                                    }`}
                                            >
                                                <Icon className="h-4 w-4" />
                                            </motion.div>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Bottom Navigation Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#221E2F] bg-[#0D0B13]/95 backdrop-blur-xl">
                <div className="relative mx-auto flex h-[72px] max-w-md items-center justify-between px-6">
                    {/* Left Nav Items: Home & Staking */}
                    {bottomTabs.slice(0, 2).map((tab) => {
                        const Icon = tab.icon;
                        const isActive = pathname === tab.href;
                        return (
                            <Link key={tab.href} href={tab.href} className="relative">
                                <motion.div
                                    whileTap={{ scale: 0.88 }}
                                    className={`flex flex-col items-center justify-center gap-1 transition-colors px-3 py-1 ${isActive ? 'text-[#A78BFA]' : 'text-[#6F6A83] hover:text-[#8B85A3]'
                                        }`}
                                >
                                    <motion.div
                                        animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.div>
                                    <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>

                                    {/* Active Tab Sliding Pill Underline */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomTabIndicator"
                                            className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-[#7C5CF0] to-[#A78BFA] shadow-[0_0_10px_#7C5CF0]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Center FAB Spacer */}
                    <div className="w-12" />

                    {/* Right Nav Items: Wallet & Account */}
                    {bottomTabs.slice(2, 4).map((tab) => {
                        const Icon = tab.icon;
                        const isActive = tab.altHrefs
                            ? tab.altHrefs.includes(pathname)
                            : pathname === tab.href;
                        return (
                            <Link key={tab.href} href={tab.href} className="relative">
                                <motion.div
                                    whileTap={{ scale: 0.88 }}
                                    className={`flex flex-col items-center justify-center gap-1 transition-colors px-3 py-1 ${isActive ? 'text-[#A78BFA]' : 'text-[#6F6A83] hover:text-[#8B85A3]'
                                        }`}
                                >
                                    <motion.div
                                        animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                                        transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </motion.div>
                                    <span className="text-[10px] font-medium tracking-wide">{tab.label}</span>

                                    {/* Active Tab Sliding Pill Underline */}
                                    {isActive && (
                                        <motion.div
                                            layoutId="bottomTabIndicator"
                                            className="absolute -bottom-1 h-1 w-6 rounded-full bg-gradient-to-r from-[#7C5CF0] to-[#A78BFA] shadow-[0_0_10px_#7C5CF0]"
                                            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                                        />
                                    )}
                                </motion.div>
                            </Link>
                        );
                    })}

                    {/* Flutter Floating Action Button (FAB) Speed Dial Trigger */}
                    <div className="absolute left-1/2 -top-5 -translate-x-1/2">
                        {/* Ambient Pulsing Glow Halo around FAB */}
                        <div className="absolute -inset-1 rounded-full bg-[#7C5CF0] opacity-30 blur-md animate-pulse" />

                        <motion.button
                            onClick={toggleWheel}
                            animate={{
                                rotate: isOpen ? 180 : 0,
                                backgroundColor: isOpen ? '#14111D' : '#7C5CF0',
                                scale: isOpen ? 1.05 : 1,
                            }}
                            whileHover={{ scale: 1.08 }}
                            whileTap={{ scale: 0.92 }}
                            transition={{
                                type: 'spring',
                                damping: 16,
                                stiffness: 260,
                            }}
                            className="relative flex h-[56px] w-[56px] items-center justify-center rounded-full border-[2.5px] border-[#0A0A10] text-[#F4F2FB] shadow-xl shadow-[#7C5CF0]/45"
                            aria-label="Toggle Navigation Wheel"
                        >
                            {isOpen ? (
                                <FaTimes className="h-5 w-5 text-[#F4F2FB]" />
                            ) : (
                                <FaCrosshairs className="h-6 w-6 text-[#F4F2FB]" />
                            )}
                        </motion.button>
                    </div>
                </div>
            </div>
        </>
    );
}

