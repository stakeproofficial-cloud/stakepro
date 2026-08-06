import Image from 'next/image';
import Link from 'next/link';

export default function Header({ toggleSidebar }: { toggleSidebar: () => void }) {
    return (
        <header className="bg-pm-char/90 fixed top-0 left-0 right-0 z-50 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-4">
                {/* Hamburger Menu */}
                <button
                    onClick={toggleSidebar}
                    className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
                    aria-label="Menu"
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
                            d="M4 6h16M4 12h16M4 18h16"
                        />
                    </svg>
                </button>

                {/* Brand Name */}
                <div className="flex items-center gap-2">
                    <Image
                        src="/logo.png"
                        alt="Money Martx Logo"
                        width={40}
                        height={40}
                        unoptimized
                        className="rounded"
                    />
                    <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                        Money Martx
                    </h1>
                </div>

                {/* Help Icon */}
                <Link
                    href="https://t.me/moneymartx"
                    className="p-2 hover:bg-gray-100 rounded-lg dark:hover:bg-gray-800"
                    aria-label="Help"
                    target="_blank"
                >
                    <Image
                        src="/tglogo.webp"
                        alt="Help Icon"
                        width={24}
                        height={24}
                        unoptimized
                    />
                </Link>
            </div>
        </header>
    );
}