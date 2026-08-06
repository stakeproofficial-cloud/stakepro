"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchUsers, deleteUser, searchReferralInvestment } from "@/store/adminSlice";

export default function AdminUsersPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const {
        users,
        loading,
        totalUsers,
        currentPage: serverPage,
        perPage: serverPerPage,
        referralSearchResult,
        referralSearchLoading,
        referralSearchError
    } = useAppSelector((s) => s.admin);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        dispatch(fetchUsers({ page: currentPage, per_page: itemsPerPage }) as any);
    }, [dispatch, currentPage, itemsPerPage]);

    // Pagination logic - server-side
    const totalPages = Math.ceil(totalUsers / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, totalUsers);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };

    const handleItemsPerPageChange = (value: number) => {
        setItemsPerPage(value);
        setCurrentPage(1);
    };

    const handleDeleteUser = (userId: number) => {
        if (typeof window === "undefined") return;
        const confirmed = window.confirm("Are you sure you want to delete this user? This action cannot be undone.");
        if (!confirmed) return;
        dispatch(deleteUser(userId) as any);
    };

    const handleSearch = () => {
        const trimmed = searchQuery.trim();
        if (!trimmed) return;
        dispatch(searchReferralInvestment(trimmed) as any);
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Users</h1>
                <div className="flex items-center gap-2">
                    <Link
                        href="/admin/users/summary"
                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 transition"
                    >
                        Summary
                    </Link>
                    <label className="text-sm text-gray-600">Show:</label>
                    <select
                        value={itemsPerPage}
                        onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        className="px-3 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value={10}>10</option>
                        <option value={25}>25</option>
                        <option value={50}>50</option>
                        <option value={100}>100</option>
                    </select>
                    <span className="text-sm text-gray-600">entries</span>
                </div>
            </div>
            <div className="mb-6 bg-white rounded-lg shadow px-4 py-3">
                <div className="flex flex-col md:flex-row md:items-center gap-3">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search referral investment by user id or email"
                        className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleSearch}
                        className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        disabled={referralSearchLoading}
                    >
                        {referralSearchLoading ? "Searching..." : "Search"}
                    </button>
                </div>
                {referralSearchError && (
                    <p className="mt-2 text-sm text-red-600">{String(referralSearchError)}</p>
                )}
                {referralSearchResult && (
                    <pre className="mt-3 bg-gray-50 border border-gray-200 rounded p-3 text-xs overflow-auto">
                        {JSON.stringify(referralSearchResult, null, 2)}
                    </pre>
                )}
            </div>
            {loading ? <p>Loading...</p> : (
                <>
                    <div className="bg-white rounded-lg shadow overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {users.map((u: any) => (
                                    <tr key={u.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{u.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{u.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{u.name || 'N/A'}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${u.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {u.role || "user"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm flex gap-2">
                                            <button
                                                className="text-blue-600 hover:text-blue-800 font-medium"
                                                onClick={() => router.push(`/admin/referral-investments/${u.id}`)}
                                            >
                                                Referrals
                                            </button>
                                            <button
                                                className="text-orange-600 hover:text-orange-800 font-medium"
                                                onClick={() => router.push(`/admin/penalties?userId=${u.id}`)}
                                            >
                                                Penalty
                                            </button>
                                            <button className="text-red-600 hover:text-red-800 font-medium" onClick={() => handleDeleteUser(u.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-6 flex items-center justify-between bg-white rounded-lg shadow px-6 py-4">
                        <div className="text-sm text-gray-600">
                            Showing {startIndex + 1} to {endIndex} of {totalUsers} users
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                            >
                                Previous
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                                if (
                                    page === 1 ||
                                    page === totalPages ||
                                    (page >= currentPage - 1 && page <= currentPage + 1)
                                ) {
                                    return (
                                        <button
                                            key={page}
                                            onClick={() => handlePageChange(page)}
                                            className={`px-3 py-1 border rounded transition ${currentPage === page
                                                ? 'bg-blue-600 text-white border-blue-600'
                                                : 'border-gray-300 hover:bg-gray-50'
                                                }`}
                                        >
                                            {page}
                                        </button>
                                    );
                                } else if (
                                    page === currentPage - 2 ||
                                    page === currentPage + 2
                                ) {
                                    return <span key={page} className="px-2">...</span>;
                                }
                                return null;
                            })}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
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