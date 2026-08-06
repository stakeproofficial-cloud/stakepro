export default function Sidebar({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return (
        <>
            {/* Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 z-50 bg-black/50 transition-opacity"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 z-50 h-full w-64 transform bg-pm-char transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex h-16 items-center justify-between px-4 border-b border-pm-gold-900/30">
                    <h2 className="text-xl font-bold text-pm-gold-500">Menu</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-pm-brown-900 rounded-lg text-pm-gold-500"
                        aria-label="Close menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <nav className="px-4 py-4">
                    <ul className="space-y-2">
                        <li>
                            <a
                                href="/user"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                Dashboard
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/deposit-record"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                </svg>
                                Deposit Record
                            </a>
                        </li>
                        {/* <li>
                            <a
                                href="/user/profile"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Profile
                            </a>
                        </li> */}
                        <li>
                            <a
                                href="/user/transactions"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                Transaction History
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/withdraw"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                Withdraw
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/withdraw-history"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Withdraw History
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/change-password"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c.828 0 1.5-.672 1.5-1.5S12.828 8 12 8s-1.5.672-1.5 1.5S11.172 11 12 11zm0 2c-1.657 0-3 .895-3 2v1h6v-1c0-1.105-1.343-2-3-2z" />
                                </svg>
                                Change Password
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/support"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-6 w-6"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                Support
                            </a>
                        </li>
                        <li>
                            <a
                                href="/user/about-us"
                                className="flex items-center rounded-lg p-3 text-pm-gold-500 hover:bg-pm-brown-900 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z" />
                                </svg>
                                About Us
                            </a>
                        </li>

                        <li className="pt-4 border-t border-pm-gold-900/30">
                            <a
                                href="/logout"
                                className="flex items-center rounded-lg p-3 text-red-400 hover:bg-red-900/20 transition"
                                onClick={onClose}
                            >
                                <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                                Log out
                            </a>
                        </li>
                    </ul>
                </nav>
            </div>
        </>
    );
}