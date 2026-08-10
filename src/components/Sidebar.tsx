'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
    FaHome,
    FaUser,
    FaCoins,
    FaArrowDown,
    FaArrowUp,
    FaKey,
    FaHeadset,
    FaInfoCircle,
    FaSignOutAlt,
    FaTimes,
    FaHistory
} from 'react-icons/fa';

export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const pathname = usePathname();

    const menuItems = [
        { href: '/user', label: 'Dashboard', icon: FaHome },
        { href: '/user/profile', label: 'My Profile', icon: FaUser },
        { href: '/user/usdt-staking', label: 'USDT Staking', icon: FaCoins },
        { href: '/user/deposit', label: 'Deposit', icon: FaArrowDown },
        { href: '/user/withdraw', label: 'Withdrawal', icon: FaArrowUp },
        { href: '/user/history', label: 'History & Transactions', icon: FaHistory },
        { href: '/user/change-password', label: 'Change Password', icon: FaKey },
        { href: '/user/support', label: 'Support & Tickets', icon: FaHeadset },
        { href: '/user/about-us', label: 'About StakePro', icon: FaInfoCircle },
    ];

    // Flutter Staggered Drawer List Animation Variants
    const navListVariants: Variants = {
        open: {
            transition: {
                staggerChildren: 0.045,
                delayChildren: 0.06,
            },
        },
        closed: {
            transition: {
                staggerChildren: 0.02,
                staggerDirection: -1,
            },
        },
    };

    const navItemVariants: Variants = {
        open: {
            opacity: 1,
            x: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 300,
                damping: 24,
            },
        },
        closed: {
            opacity: 0,
            x: -24,
            scale: 0.95,
            transition: {
                duration: 0.15,
            },
        },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop Overlay with Flutter Fade & Blur Transition */}
                    <motion.div
                        key="sidebar-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="fixed inset-0 z-50 bg-[#050409]/75 backdrop-blur-sm"
                        onClick={onClose}
                    />

                    {/* Drawer Panel Container with Flutter Spring Physics */}
                    <motion.aside
                        key="sidebar-drawer"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{
                            type: 'spring',
                            damping: 26,
                            stiffness: 280,
                            mass: 0.85,
                        }}
                        className="fixed top-0 left-0 z-50 h-full w-72 border-r border-[#221E2F] bg-[#14111D] shadow-[12px_0_40px_rgba(0,0,0,0.85)]"
                    >
                        {/* Drawer Header */}
                        <div className="flex h-16 items-center justify-between px-5 border-b border-[#221E2F] bg-[#1A1626]/60">
                            <div>
                                <p className="text-base font-semibold text-[#F4F2FB] tracking-wide">StakePro Menu</p>
                                <p className="text-xs text-[#8B85A3]">Navigate account options</p>
                            </div>
                            <motion.button
                                onClick={onClose}
                                whileHover={{ rotate: 90, scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1626] text-[#8B85A3] transition hover:text-[#F4F2FB] hover:bg-[#221E2F]"
                                aria-label="Close menu"
                            >
                                <FaTimes className="h-4 w-4" />
                            </motion.button>
                        </div>

                        {/* Drawer Navigation List with Staggered Cascading Items */}
                        <nav className="px-3 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
                            <motion.ul
                                variants={navListVariants}
                                initial="closed"
                                animate="open"
                                exit="closed"
                                className="space-y-1.5"
                            >
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = pathname === item.href;
                                    return (
                                        <motion.li key={item.href} variants={navItemVariants}>
                                            <Link
                                                href={item.href}
                                                onClick={onClose}
                                                className="relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
                                            >
                                                {/* Animated Sliding Active Indicator Pill */}
                                                {isActive && (
                                                    <motion.div
                                                        layoutId="activeSidebarTab"
                                                        className="absolute inset-0 rounded-2xl bg-gradient-to-r from-[#7C5CF0] to-[#6342E8] shadow-md shadow-[#7C5CF0]/35"
                                                        transition={{
                                                            type: 'spring',
                                                            stiffness: 380,
                                                            damping: 30,
                                                        }}
                                                    />
                                                )}

                                                <motion.div
                                                    whileHover={{ scale: 1.03, x: 4 }}
                                                    whileTap={{ scale: 0.96 }}
                                                    className="relative z-10 flex items-center gap-3.5 w-full"
                                                >
                                                    <Icon
                                                        className={`h-4 w-4 transition-transform duration-200 ${isActive ? 'text-[#F4F2FB] scale-110' : 'text-[#A78BFA]'
                                                            }`}
                                                    />
                                                    <span
                                                        className={
                                                            isActive
                                                                ? 'text-[#F4F2FB] font-semibold'
                                                                : 'text-[#8B85A3] group-hover:text-[#F4F2FB]'
                                                        }
                                                    >
                                                        {item.label}
                                                    </span>
                                                </motion.div>
                                            </Link>
                                        </motion.li>
                                    );
                                })}

                                <motion.li
                                    variants={navItemVariants}
                                    className="pt-4 border-t border-[#221E2F] mt-3"
                                >
                                    <Link
                                        href="/logout"
                                        onClick={onClose}
                                        className="flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-[#E24B4A] transition hover:bg-[#E24B4A]/10 active:scale-95"
                                    >
                                        <FaSignOutAlt className="h-4 w-4" />
                                        <span>Logout</span>
                                    </Link>
                                </motion.li>
                            </motion.ul>
                        </nav>
                    </motion.aside>
                </>
            )}
        </AnimatePresence>
    );
}