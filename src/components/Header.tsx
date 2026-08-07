'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useAppSelector } from '@/store/hooks';
import { FaWhatsapp, FaBars } from 'react-icons/fa';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    const profile = useAppSelector((s) => s.auth.profile);
    const user = profile?.user;

    const getInitials = () => {
        const f = user?.first_name ? user.first_name[0].toUpperCase() : '';
        const l = user?.last_name ? user.last_name[0].toUpperCase() : '';
        const combined = `${f}${l}`;
        return combined || 'SP';
    };

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-[#221E2F] bg-[#0A0A0F]/90 backdrop-blur-md">
            <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4 sm:px-6">
                {/* Left Drawer Menu Toggle Button */}
                <button
                    onClick={toggleSidebar}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#221E2F] bg-[#14111D] text-[#F4F2FB] transition hover:bg-[#1A1626] focus:outline-none"
                    aria-label="Open menu"
                >
                    <FaBars className="h-4 w-4 text-[#F4F2FB]" />
                </button>

                {/* Center Brand Title */}
                <div className="flex items-center gap-2">
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7C5CF0] to-[#A78BFA] shadow-md shadow-[#7C5CF0]/30">
                        <Image src="/logo.png" alt="StakePro logo" width={60} height={60} unoptimized className="rounded-md" />
                    </span>
                    <span className="text-base font-semibold text-[#F4F2FB] tracking-tight">Stake Pro</span>
                </div>

                {/* Right Actions: WhatsApp & Avatar */}
                <div className="flex items-center gap-3">
                    <a
                        href="https://whatsapp.com/channel/0029Vb9HApl4Y9lkRQ1OlV26"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative inline-flex h-9 w-9 items-center justify-center rounded-xl border border-[#25D366]/30 bg-[#25D366]/10 text-[#25D366] transition hover:bg-[#25D366]/20 hover:text-white"
                        aria-label="WhatsApp Channel"
                    >
                        <FaWhatsapp className="h-4 w-4" />
                    </a>

                    <Link
                        href="/user/personal-center"
                        className="flex items-center gap-2"
                    >
                        <div className="relative flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#7C5CF0] bg-[#1C1826] text-xs font-semibold text-[#B9A4F7] shadow-sm shadow-[#7C5CF0]/20 overflow-hidden">
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
                    </Link>
                </div>
            </div>
        </header>
    );
}