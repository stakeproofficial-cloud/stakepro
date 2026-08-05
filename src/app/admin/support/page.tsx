"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTickets } from "@/store/supportSlice";
import Link from "next/link";

export default function AdminSupportPage() {
    const dispatch = useAppDispatch();
    const { items: tickets, pagination, loadingList, error } = useAppSelector((s) => s.support);
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string>("all");

    useEffect(() => {
        const status = statusFilter === "all" ? undefined : (statusFilter as "open" | "pending" | "closed");
        dispatch(fetchTickets({ page: currentPage, size: 20, status, all: true }) as any);
    }, [dispatch, currentPage, statusFilter]);

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
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Support Tickets</h1>
                <p className="text-gray-600 text-sm mt-1">Manage all user support requests</p>
            </div>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

            <div className="flex gap-2 mb-6">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    All ({tickets.length})
                </button>
                <button
                    onClick={() => setStatusFilter("open")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "open" ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Open ({tickets.filter((t) => t.status === "open").length})
                </button>
                <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "pending" ? "bg-yellow-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Pending ({tickets.filter((t) => t.status === "pending").length})
                </button>
                <button
                    onClick={() => setStatusFilter("closed")}
                    className={`px-4 py-2 rounded transition ${statusFilter === "closed" ? "bg-red-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
                >
                    Closed ({tickets.filter((t) => t.status === "closed").length})
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
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Message</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 text-sm text-gray-900 font-medium">#{ticket.id}</td>
                                            <td className="px-6 py-4 text-sm text-gray-600">User #{ticket.user_id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-gray-900 max-w-xs truncate">{ticket.subject}</td>
                                            <td className="px-6 py-4 text-sm">{getPriorityBadge(ticket.priority)}</td>
                                            <td className="px-6 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm text-gray-500">
                                                {ticket.last_message_at
                                                    ? new Date(ticket.last_message_at).toLocaleDateString()
                                                    : "—"}
                                            </td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link href={`/admin/support/${ticket.id}`} className="text-blue-600 hover:text-blue-800 font-medium">
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

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Total Tickets</div>
                    <div className="text-2xl font-bold text-gray-900">{pagination.total}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Open Tickets</div>
                    <div className="text-2xl font-bold text-green-600">{tickets.filter((t) => t.status === "open").length}</div>
                </div>
                <div className="bg-white rounded-lg shadow p-4">
                    <div className="text-sm text-gray-600">Closed Tickets</div>
                    <div className="text-2xl font-bold text-red-600">{tickets.filter((t) => t.status === "closed").length}</div>
                </div>
            </div>
        </div>
    );
}
