"use client";
import { useEffect, useState, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { adminBalance, fetchUsers, searchUsers } from "@/store/adminSlice";

export default function AdminBalancesPage() {
    const dispatch = useAppDispatch();
    const { users, loading: usersLoading, totalUsers } = useAppSelector((s) => s.admin);
    const [selectedUser, setSelectedUser] = useState<number | null>(null);
    const [amount, setAmount] = useState<string>("");
    const [txnHash, setTxnHash] = useState<string>("");
    const [type, setType] = useState<string>("deposit");
    const [showForm, setShowForm] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const latestSearchQueryRef = useRef<string>("");

    useEffect(() => {
        dispatch(fetchUsers({ page: currentPage, per_page: itemsPerPage }) as any);
    }, [dispatch, currentPage, itemsPerPage]);

    useEffect(() => {
        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Dynamic user search handler
    const handleUserSearch = (query: string) => {
        setSearchQuery(query);
        setShowDropdown(true);
        latestSearchQueryRef.current = query.trim().toLowerCase();

        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (!query.trim()) {
            setFilteredUsers([]);
            return;
        }

        // Show immediate local matches while API request runs
        const localMatches = users.filter(u =>
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
        );
        setFilteredUsers(localMatches);

        // Always search via API to include users outside current page
        setSearching(true);
        const currentQuery = query.trim().toLowerCase();
        searchTimeoutRef.current = setTimeout(() => {
            dispatch(searchUsers(query) as any)
                .then((result: any) => {
                    const searchResults = result.payload?.users || result.payload?.data || result.payload || [];
                    const apiMatches = Array.isArray(searchResults) ? searchResults : [];
                    const mergedById = new Map<number, any>();

                    [...localMatches, ...apiMatches].forEach((user) => {
                        if (user?.id != null) {
                            mergedById.set(user.id, user);
                        }
                    });

                    if (latestSearchQueryRef.current === currentQuery) {
                        setFilteredUsers(Array.from(mergedById.values()));
                    }
                })
                .finally(() => setSearching(false));
        }, 300);
    };

    const handleSelectUser = (userId: number) => {
        setSelectedUser(userId);
        const user = [...users, ...filteredUsers].find(u => u.id === userId);
        if (user) {
            setSearchQuery(`${user.email} (Balance: $${Number(user.balance || 0).toFixed(2)})`);
        }
        setShowDropdown(false);
    };

    const handleUpdateBalance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUser || !amount || !txnHash) {
            alert("Please fill all fields");
            return;
        }

        try {
            await dispatch(adminBalance({
                user_id: selectedUser,
                amount: parseFloat(amount),
                txn_hash: txnHash,
                type
            })).unwrap();
            alert("Balance updated successfully");
            setSelectedUser(null);
            setAmount("");
            setTxnHash("");
            setSearchQuery("");
            setType("deposit");
            setShowForm(false);
            dispatch(fetchUsers({ page: currentPage, per_page: itemsPerPage }) as any);
        } catch (error) {
            alert("Failed to update balance");
        }
    };

    const totalBalance = users.reduce((sum, user) => sum + (Number(user.balance) || 0), 0);

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

    if (usersLoading) {
        return <div className="p-6">Loading balances...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">User Balances</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
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
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        {showForm ? 'Cancel' : '+ Update Balance'}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Update User Balance</h2>
                    <form onSubmit={handleUpdateBalance} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select User
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => handleUserSearch(e.target.value)}
                                    onFocus={() => setShowDropdown(true)}
                                    placeholder="Search by email or name..."
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autoComplete="off"
                                />
                                {searching && (
                                    <div className="absolute right-3 top-3 text-gray-400">
                                        <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                            <circle cx="12" cy="12" r="10" strokeWidth="2" opacity="0.25" />
                                            <path d="M4 12a8 8 0 018-8" strokeWidth="2" strokeDasharray="12" />
                                        </svg>
                                    </div>
                                )}
                                {showDropdown && (filteredUsers.length > 0 || searchQuery.trim()) && (
                                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg z-10 max-h-60 overflow-y-auto">
                                        {filteredUsers.length === 0 ? (
                                            <div className="px-3 py-2 text-gray-500 text-sm">No users found</div>
                                        ) : (
                                            filteredUsers.map((user) => (
                                                <button
                                                    key={user.id}
                                                    type="button"
                                                    onClick={() => handleSelectUser(user.id)}
                                                    className="w-full text-left px-3 py-2 hover:bg-blue-50 border-b border-gray-100 last:border-b-0 transition"
                                                >
                                                    <div className="font-medium text-sm">{user.email}</div>
                                                    <div className="text-xs text-gray-500">
                                                        Balance: ${Number(user.balance || 0).toFixed(2)}
                                                        {user.name && ` • ${user.name}`}
                                                    </div>
                                                </button>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                            {selectedUser && (
                                <div className="mt-2 text-sm text-green-600">
                                    ✓ User selected
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transaction Type
                            </label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="deposit">Deposit</option>
                                <option value="withdraw">Withdraw</option>
                                <option value="adjustment">Adjustment</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Amount
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter amount"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Transaction Hash
                            </label>
                            <input
                                type="text"
                                value={txnHash}
                                onChange={(e) => setTxnHash(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter transaction hash"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={usersLoading}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {usersLoading ? 'Processing...' : 'Update Balance'}
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.id}</td>
                                    <td className="px-6 py-4 text-sm text-gray-900">{user.email}</td>
                                    <td className="px-6 py-4 text-sm text-gray-700">{user.name || 'N/A'}</td>
                                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                                        ${Number(user.balance || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === 'admin'
                                            ? 'bg-purple-100 text-purple-800'
                                            : 'bg-gray-100 text-gray-800'
                                            }`}>
                                            {user.role || 'user'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm">
                                        <button
                                            onClick={() => {
                                                setSelectedUser(user.id);
                                                setShowForm(true);
                                            }}
                                            className="text-blue-600 hover:text-blue-800 font-medium"
                                        >
                                            Update
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
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

            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">Summary</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Total Users</div>
                        <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Total Balance</div>
                        <div className="text-2xl font-bold text-green-600">${totalBalance.toFixed(2)}</div>
                    </div>
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Average Balance</div>
                        <div className="text-2xl font-bold text-gray-900">
                            ${users.length > 0 ? (totalBalance / users.length).toFixed(2) : '0.00'}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
