"use client";
import { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchPenalties, createPenalty, deletePenalty } from "@/store/penaltySlice";
import { fetchUsers, searchUsers } from "@/store/adminSlice";

function PenaltyContent() {
    const dispatch = useAppDispatch();
    const searchParams = useSearchParams();
    const targetUserId = searchParams.get("userId");

    const { penalties, loading, totalPenalties } = useAppSelector((s) => s.penalty);
    const { users } = useAppSelector((s) => s.admin);

    const [page, setPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [showForm, setShowForm] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
    const [formData, setFormData] = useState({
        amount: "",
        reason: "",
    });

    const [formError, setFormError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [searching, setSearching] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Initial Data Fetch
    useEffect(() => {
        dispatch(fetchPenalties({ page, per_page: itemsPerPage }) as any);
        dispatch(fetchUsers({ page: 1, per_page: 100 }) as any);
    }, [dispatch, page, itemsPerPage]);

    // FIX: Handle incoming userId from navigation and ensure state is set
    useEffect(() => {
        if (targetUserId && users.length > 0) {
            const userIdNum = Number(targetUserId);
            const user = users.find(u => u.id === userIdNum);
            setSelectedUserId(userIdNum);

        }
    }, [targetUserId]);

    const totalPages = Math.ceil(totalPenalties / itemsPerPage);

    const handleUserSearch = (query: string) => {
        setSearchQuery(query);
        setShowDropdown(true);
        setSelectedUserId(null); // Reset selection if they start typing again

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
        if (!query.trim()) {
            setFilteredUsers([]);
            return;
        }

        const localMatches = users.filter(u =>
            u.email.toLowerCase().includes(query.toLowerCase()) ||
            (u.name && u.name.toLowerCase().includes(query.toLowerCase()))
        );

        if (localMatches.length > 0) {
            setFilteredUsers(localMatches);
            return;
        }

        setSearching(true);
        searchTimeoutRef.current = setTimeout(() => {
            dispatch(searchUsers(query) as any)
                .then((result: any) => {
                    const searchResults = result.payload?.users || result.payload?.data || result.payload || [];
                    setFilteredUsers(Array.isArray(searchResults) ? searchResults : []);
                })
                .finally(() => setSearching(false));
        }, 300);
    };

    const handleSelectUser = (user: any) => {
        setSelectedUserId(user.id);
        setSearchQuery(`${user.email}${user.name ? ` (${user.name})` : ""}`);
        setShowDropdown(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError("");
        setSuccessMessage("");

        if (!targetUserId || !formData.amount || !formData.reason) {
            setFormError("Please select a user and fill all fields");
            return;
        }

        try {
            await dispatch(
                createPenalty({
                    user_id: targetUserId ? Number(targetUserId) : selectedUserId!,
                    amount: Number(formData.amount),
                    reason: formData.reason,
                }) as any
            ).unwrap(); // Use unwrap if using createAsyncThunk for better error catching

            setSuccessMessage("Penalty created successfully!");
            setFormData({ amount: "", reason: "" });
            setSelectedUserId(null);
            setSearchQuery("");
            setShowForm(false);
            setTimeout(() => setSuccessMessage(""), 3000);
            dispatch(fetchPenalties({ page: 1, per_page: itemsPerPage }) as any);
        } catch (error) {
            setFormError("Failed to create penalty. Please try again.");
        }
    };

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">User Penalties</h1>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className={`px-4 py-2 text-white rounded transition ${showForm ? "bg-gray-500" : "bg-blue-600 hover:bg-blue-700"}`}
                    >
                        {showForm ? "Cancel" : "Give Penalty"}
                    </button>
                </div>
            </div>

            {successMessage && (
                <div className="mb-4 p-4 bg-green-100 text-green-700 rounded-lg border border-green-300">
                    {successMessage}
                </div>
            )}

            {showForm && (
                <div className="mb-6 bg-white p-6 rounded-lg shadow border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4 text-gray-800">Assign Penalty</h2>
                    {formError && (
                        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded border border-red-200 text-sm">
                            {formError}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Hidden User ID Input */}
                        <input type="hidden" name="user_id" value={targetUserId || ""} />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Penalty Amount ($)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                                <input
                                    type="text"
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. Policy violation"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full md:w-auto px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition disabled:opacity-50 font-medium"
                        >
                            {loading ? "Processing..." : "Confirm Penalty"}
                        </button>
                    </form>
                </div>
            )}

            {/* Table UI logic remains same as your original provided code */}
            {/* ... table rendering ... */}
        </div>
    );
}

export default function AdminPenaltiesPage() {
    return (
        <Suspense fallback={<div className="p-6 text-gray-500 text-center">Loading Penalty Manager...</div>}>
            <PenaltyContent />
        </Suspense>
    );
}