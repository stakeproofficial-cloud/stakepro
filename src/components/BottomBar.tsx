import { FaHome, FaUsers, FaChartBar, FaMedal, FaUserCircle } from 'react-icons/fa';

export default function BottomBar() {
    return (
        <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 w-[75%] max-w-3xl">
            <div className="bg-pm-char/70 backdrop-blur-lg rounded-full shadow-2xl border border-pm-gold-900/30 px-6 py-3">
                <div className="flex justify-around items-center text-pm-gold-500 text-xl">
                    <a href="/user" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaHome />
                    </a>
                    <a href="/user/team" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaUsers />
                    </a>
                    <a href="/user/usdt-staking" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaChartBar />
                    </a>
                    <a href="/user/ranks" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaMedal />
                    </a>
                    <a href="/user/personal-center" className="hover:text-pm-gold-900 transition p-2 hover:scale-110">
                        <FaUserCircle />
                    </a>
                </div>
            </div>
        </div>
    );
}
