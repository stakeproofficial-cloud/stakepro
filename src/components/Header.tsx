import Image from 'next/image';
import Link from 'next/link';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-[#07111f]/95 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <button
                    onClick={toggleSidebar}
                    className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400"
                    aria-label="Open menu"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                </button>

                <div className="flex items-center gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-cyan-400 to-cyan-300 shadow-lg shadow-violet-500/20">
                        <Image src="/logo.png" alt="StakePro logo" width={26} height={26} unoptimized className="rounded-lg" />
                    </span>
                    <div>
                        <p className="text-sm font-semibold text-white">StakePro</p>
                        <p className="text-xs text-slate-400">User Portal</p>
                    </div>
                </div>

                <Link
                    href="https://t.me/stakepro"
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-slate-100 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
                    aria-label="Help"
                    target="_blank"
                >
                    <span>Support</span>
                </Link>
            </div>
        </header>
    );
}