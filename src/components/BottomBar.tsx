import { FaHome, FaUsers, FaChartBar, FaMedal, FaUserCircle } from 'react-icons/fa';

export default function BottomBar() {
    return (
        <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-4xl -translate-x-1/2">
            <div className="rounded-full border border-white/10 bg-[#0c1728]/95 px-5 py-3 shadow-[0_24px_64px_rgba(0,0,0,0.35)] backdrop-blur-xl">
                <div className="flex justify-between items-center text-slate-200 text-xl">
                    <a href="/user" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                        <FaHome />
                    </a>
                    <a href="/user/team" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaUsers />
                    </a>
                    <a href="/user/usdt-staking" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaChartBar />
                    </a>
                    <a href="/user/personal-center" className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5 transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400">
                        <FaUserCircle />
                    </a>
                </div>
            </div>
        </div>
    );
}
