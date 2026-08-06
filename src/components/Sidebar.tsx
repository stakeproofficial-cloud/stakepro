export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed top-0 left-0 z-50 h-full w-72 transform border-r border-white/10 bg-[#08131f]/95 shadow-2xl shadow-black/40 transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
            >
                <div className="flex h-16 items-center justify-between px-5 border-b border-white/10">
                    <div>
                        <p className="text-lg font-semibold text-white">StakePro Menu</p>
                        <p className="text-xs text-slate-400">Navigate your account</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/5 text-slate-100 transition hover:bg-white/10"
                        aria-label="Close menu"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <nav className="px-4 py-5">
                    <ul className="space-y-2">
                        {[
                            { href: '/user', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                            { href: '/user/deposit-record', label: 'Deposit Record', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1' },
                            { href: '/user/withdraw', label: 'Withdraw', icon: 'M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z' },
                            { href: '/user/change-password', label: 'Change Password', icon: 'M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11zm0 2c-1.657 0-3 .895-3 2v1h6v-1c0-1.105-1.343-2-3-2z' },
                            { href: '/user/support', label: 'Support', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
                            { href: '/user/about-us', label: 'About Us', icon: 'M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z' },
                        ].map((item) => (
                            <li key={item.href}>
                                <a
                                    href={item.href}
                                    className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10"
                                    onClick={onClose}
                                >
                                    <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                                    </svg>
                                    {item.label}
                                </a>
                            </li>
                        ))}
                        <li className="pt-4 border-t border-white/10">
                            <a
                                href="/logout"
                                className="flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
                                onClick={onClose}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Logout
                            </a>
                        </li>
                    </ul>
                </nav>
            </aside>
        </>
    );
}