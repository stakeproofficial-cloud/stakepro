'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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
    FaUserCheck,
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

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-[#050409]/70 backdrop-blur-sm transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 transform border-r border-[#221E2F] bg-[#14111D] shadow-2xl shadow-black/80 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-5 border-b border-[#221E2F] bg-[#1A1626]/50">
                    <div>
                        <p className="text-base font-semibold text-[#F4F2FB]">StakePro Menu</p>
                        <p className="text-xs text-[#8B85A3]">Navigate account options</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A1626] text-[#8B85A3] transition hover:text-[#F4F2FB] hover:bg-[#221E2F]"
                        aria-label="Close menu"
                    >
                        <FaTimes className="h-4 w-4" />
                    </button>
                </div>

                <nav className="px-3 py-4 overflow-y-auto max-h-[calc(100vh-4rem)]">
                    <ul className="space-y-1.5">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        onClick={onClose}
                                        className={`flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all ${isActive
                                            ? 'bg-[#7C5CF0] text-[#F4F2FB] shadow-md shadow-[#7C5CF0]/30 font-semibold'
                                            : 'text-[#8B85A3] hover:bg-[#1A1626] hover:text-[#F4F2FB]'
                                            }`}
                                    >
                                        <Icon className={`h-4 w-4 ${isActive ? 'text-[#F4F2FB]' : 'text-[#A78BFA]'}`} />
                                        <span>{item.label}</span>
                                    </Link>
                                </li>
                            );
                        })}

                        <li className="pt-4 border-t border-[#221E2F] mt-3">
                            <Link
                                href="/logout"
                                onClick={onClose}
                                className="flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium text-[#E24B4A] transition hover:bg-[#E24B4A]/10"
                            >
                                <FaSignOutAlt className="h-4 w-4" />
                                <span>Logout</span>
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}