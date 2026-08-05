"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsersSummary } from "@/store/adminSlice";

const currency = (value: number) => `$${Number(value || 0).toFixed(2)}`;

export default function AdminUsersSummaryPage() {
    const dispatch = useAppDispatch();
    const {
        usersSummary,
        usersSummaryLoading,
        usersSummaryError,
        usersSummaryTotal,
    } = useAppSelector((s) => s.admin);

    const [page, setPage] = useState(1);
    const [size, setSize] = useState(25);

    useEffect(() => {
        dispatch(fetchUsersSummary({ page, size }) as any);
    }, [dispatch, page, size]);

    const totalPages = Math.max(1, Math.ceil(usersSummaryTotal / size));
    const startIndex = usersSummaryTotal === 0 ? 0 : (page - 1) * size + 1;
    const endIndex = Math.min(page * size, usersSummaryTotal);

    return (
        <div className="p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Users Summary</h1>
                    <p className="text-sm text-gray-600">Data source: GET ?route=admin/users/summary</p>
                </div>
                <div className="flex items-center gap-3">
                    <Link
                        href="/admin/users"
                        className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                        Back to Users
                    </Link>
                    <div className="flex items-center gap-2">
                        <label className="text-sm text-gray-600">Size:</label>
                        <select
                            value={size}
                            onChange={(e) => {
                                setSize(Number(e.target.value));
                                setPage(1);
                            }}
                            className="px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            </div>

            {usersSummaryError && (
                <div className="mb-4 rounded border border-red-200 bg-red-50 px-4 py-3 text-red-700 text-sm">
                    {String(usersSummaryError)}
                </div>
            )}

            {usersSummaryLoading ? (
                <div className="bg-white rounded-lg shadow p-6">Loading users summary...</div>
            ) : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Invest</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Invest</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Active Profit</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Completed Profit</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Profit</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Referral Invest</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty Amount</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Penalty Created At</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {usersSummary.length === 0 ? (
                                    <tr>
                                        <td colSpan={9} className="px-4 py-6 text-center text-sm text-gray-500">
                                            No summary users found.
                                        </td>
                                    </tr>
                                ) : (
                                    usersSummary.map((user: any) => (
                                        <tr key={user.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3 text-sm text-gray-900">{user.id}</td>
                                            <td className="px-4 py-3 text-sm text-gray-900">{user.email || "N/A"}</td>
                                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{currency(user.balance)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.active_investments_sum)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.completed_investments_sum)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.active_investment_profit_sum)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.completed_investment_profit_sum)}</td>
                                            <td className="px-4 py-3 text-sm font-semibold text-green-700">{currency(user.total_investment_profit_sum)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.referral_investments_sum)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{currency(user.penalty_amount)}</td>
                                            <td className="px-4 py-3 text-sm text-gray-700">{user.penalty_created_at || "N/A"}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex} to {endIndex} of {usersSummaryTotal} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setPage((prev) => Math.max(1, prev - 1))}
                                disabled={page <= 1}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNumber) => {
                                if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                                ) {
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setPage(pageNumber)}
                                            className={`px-3 py-1 border rounded transition ${page === pageNumber
                                                ? "bg-blue-600 text-white border-blue-600"
                                                : "border-gray-300 hover:bg-gray-50"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    );
                                }

                                if (pageNumber === page - 2 || pageNumber === page + 2) {
                                    return <span key={pageNumber} className="px-2">...</span>;
                                }

                                return null;
                            })}
                            <button
                                onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
                                disabled={page >= totalPages}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
