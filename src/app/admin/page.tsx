"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers } from "@/store/adminSlice";
import { fetchTransactions } from "@/store/transactionSlice";
import { fetchAdminWithdraws } from "@/store/withdrawRequestsSlice";
import Link from "next/link";

export default function AdminDashboard() {
    const dispatch = useAppDispatch();
    const { users } = useAppSelector((s) => s.admin);
    const { items: transactions } = useAppSelector((s) => s.transactions);
    const { adminList: withdrawals } = useAppSelector((s) => s.withdrawRequests);

    useEffect(() => {
        dispatch(fetchUsers() as any);
        dispatch(fetchTransactions());
        dispatch(fetchAdminWithdraws());
    }, [dispatch]);

    const totalBalance = users.reduce((sum, user) => sum + (Number(user.balance) || 0), 0);
    const pendingWithdrawals = Array.isArray(withdrawals)
        ? withdrawals.filter(w => w.state === '0').length
        : 0;

    const stats = [
        {
            title: "Total Users",
            value: users.length,
            icon: "👥",
            color: "bg-blue-500",
            link: "/admin/users"
        },
        {
            title: "Total Balance",
            value: `$${totalBalance.toFixed(2)}`,
            icon: "💰",
            color: "bg-green-500",
            link: "/admin/balances"
        },
        {
            title: "USDT Staking Pending",
            value: 0,
            icon: "⏳",
            color: "bg-yellow-500",
            link: "/admin/usdt-staking"
        },
        {
            title: "Total Transactions",
            value: transactions.length,
            icon: "🔄",
            color: "bg-cyan-500",
            link: "/admin/transactions"
        },
    ];

    const recentTransactions = transactions.slice(0, 5);

    return (
        <div>
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
                    <p className="text-gray-600">Overview of your HYIP platform</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/support"
                        className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow transition"
                        title="Support Tickets"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Support
                    </Link>
                    <Link
                        href="/logout"
                        className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md shadow transition"
                        title="Logout"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        Logout
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Link
                        key={index}
                        href={stat.link}
                        className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center text-2xl`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h3 className="text-gray-600 text-sm font-medium mb-1">{stat.title}</h3>
                        <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Transactions</h2>
                    <div className="space-y-3">
                        {recentTransactions.length === 0 ? (
                            <p className="text-gray-500 text-center py-4">No transactions yet</p>
                        ) : (
                            recentTransactions.map((txn) => (
                                <div key={txn.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                                    <div>
                                        <div className="font-medium text-sm">{txn.txn_type}</div>
                                        <div className="text-xs text-gray-500">{txn.txn_number}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">${Number(txn.amount).toFixed(2)}</div>
                                        <div className="text-xs text-gray-500">
                                            {txn.created_at ? new Date(txn.created_at).toLocaleDateString() : 'N/A'}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                    <Link href="/admin/transactions" className="block mt-4 text-center text-blue-600 hover:text-blue-800 font-medium">
                        View All Transactions →
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">System Overview</h2>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Active Users</span>
                            <span className="font-semibold">{users.length}</span>
                        </div>
                        <div className="flex justify-between items-center pb-3 border-b">
                            <span className="text-gray-600">Staking Accounts</span>
                            <span className="font-semibold">{users.length}</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Pending Withdrawals</span>
                            <span className="font-semibold">{pendingWithdrawals}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
                <h2 className="text-2xl font-bold mb-2">Quick Actions</h2>
                <p className="mb-4 opacity-90">Manage your platform efficiently</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Link href="/admin/usdt-staking" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">📈</div>
                        <div className="text-sm font-medium">Staking</div>
                    </Link>
                    <Link href="/admin/users" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">👤</div>
                        <div className="text-sm font-medium">Manage Users</div>
                    </Link>
                    <Link href="/admin/withdraws" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">💸</div>
                        <div className="text-sm font-medium">Withdrawals</div>
                    </Link>
                    <Link href="/admin/balances" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">💳</div>
                        <div className="text-sm font-medium">Update Balance</div>
                    </Link>
                    <Link href="/admin/banners" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">🖼️</div>
                        <div className="text-sm font-medium">Manage Banners</div>
                    </Link>
                    <Link href="/admin/penalties" className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-4 text-center transition">
                        <div className="text-2xl mb-2">🖼️</div>
                        <div className="text-sm font-medium" style={{
                            color: 'black'
                        }}>Manage Penalties</div>
                    </Link>
                </div>
            </div>
        </div>
    );
}
