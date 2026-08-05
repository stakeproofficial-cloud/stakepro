"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTickets, createTicket, setFilters } from "@/store/supportSlice";
import Link from "next/link";

export default function UserSupportPage() {
    const dispatch = useAppDispatch();
    const { items: tickets, pagination, loadingList, creating, error } = useAppSelector((s) => s.support);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ subject: "", message: "" });
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        const status = statusFilter === "all" ? undefined : (statusFilter as "open" | "pending" | "closed");
        dispatch(fetchTickets({ page: currentPage, size: 10, status }) as any);
    }, [dispatch, currentPage, statusFilter]);

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.subject.trim() || !formData.message.trim()) {
            alert("Please fill in all fields");
            return;
        }

        try {
            await dispatch(
                createTicket({
                    subject: formData.subject,
                    message: formData.message,
                    priority: "normal",
                    image: imageFile || undefined,
                }) as any
            ).unwrap();
            alert("Ticket created successfully");
            setFormData({ subject: "", message: "" });
            setImageFile(null);
            setShowForm(false);
            dispatch(fetchTickets({ page: 1, size: 10 }) as any);
        } catch (err) {
            alert("Failed to create ticket");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            open: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            closed: "bg-red-100 text-red-800",
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>{status}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: "bg-blue-100 text-blue-800",
            normal: "bg-gray-100 text-gray-800",
            high: "bg-orange-100 text-orange-800",
            urgent: "bg-red-100 text-red-800",
        };
        return <span className={`px-2 py-1 rounded text-xs font-medium ${styles[priority] || "bg-gray-100 text-gray-800"}`}>{priority}</span>;
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <div className="py-15">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-gray-600 text-sm mt-1">Manage your support requests</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {showForm ? "Cancel" : "+ New Ticket"}
                </button>
            </div>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Create New Ticket</h2>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Brief description of your issue"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                                placeholder="Describe your issue in detail"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {imageFile && (
                                <p className="text-sm text-gray-600 mt-1">Selected: {imageFile.name}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {creating ? "Creating..." : "Create Ticket"}
                        </button>
                    </form>
                </div>
            )}

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setStatusFilter("open")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "open" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Open
                </button>
                <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setStatusFilter("closed")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "closed" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Closed
                </button>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                {loadingList ? (
                    <div className="p-8 text-center text-gray-500">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">No tickets found</div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900">#{ticket.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900">{ticket.subject}</td>
                                            <td className="px-6 py-4 text-sm">{getPriorityBadge(ticket.priority)}</td>
                                            <td className="px-6 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link href={`/user/support/${ticket.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
                                                    View
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="flex items-center justify-between px-6 py-4 border-t">
                                <div className="text-sm text-gray-600">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
