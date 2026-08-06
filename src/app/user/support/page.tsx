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
            open: "border border-emerald-500/20 bg-emerald-500/10 text-emerald-200",
            pending: "border border-amber-500/20 bg-amber-500/10 text-amber-200",
            closed: "border border-rose-500/20 bg-rose-500/10 text-rose-200",
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[status] || "border border-slate-700 bg-slate-800 text-slate-200"}`}>{status}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: "border border-sky-500/20 bg-sky-500/10 text-sky-200",
            normal: "border border-slate-700 bg-slate-800 text-slate-200",
            high: "border border-orange-500/20 bg-orange-500/10 text-orange-200",
            urgent: "border border-rose-500/20 bg-rose-500/10 text-rose-200",
        };
        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${styles[priority] || "border border-slate-700 bg-slate-800 text-slate-200"}`}>{priority}</span>;
    };

    const totalPages = Math.ceil(pagination.total / pagination.size);

    return (
        <div className="py-8 space-y-6 text-slate-100">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Support Tickets</h1>
                    <p className="text-slate-400 text-sm mt-1">Manage your support requests</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-cyan-500 text-slate-950 px-4 py-2 rounded-full hover:bg-cyan-400 transition"
                >
                    {showForm ? "Cancel" : "+ New Ticket"}
                </button>
            </div>

            {error && <div className="mb-4 p-4 rounded-3xl bg-rose-500/10 text-rose-200 border border-rose-500/20">{error}</div>}

            {showForm && (
                <div className="bg-[#0f1a2b]/95 rounded-[2rem] border border-white/10 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4 text-white">Create New Ticket</h2>
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Subject</label>
                            <input
                                type="text"
                                value={formData.subject}
                                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                                placeholder="Brief description of your issue"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Message</label>
                            <textarea
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-32"
                                placeholder="Describe your issue in detail"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Attach Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                            {imageFile && (
                                <p className="text-sm text-slate-400 mt-1">Selected: {imageFile.name}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={creating}
                            className="w-full bg-cyan-500 text-slate-950 py-2 rounded-3xl hover:bg-cyan-400 transition disabled:bg-slate-700"
                        >
                            {creating ? "Creating..." : "Create Ticket"}
                        </button>
                    </form>
                </div>
            )}

            <div className="flex flex-wrap gap-2 mb-6">
                <button
                    onClick={() => setStatusFilter("all")}
                    className={`px-4 py-2 rounded-full transition ${statusFilter === "all" ? "bg-cyan-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                >
                    All
                </button>
                <button
                    onClick={() => setStatusFilter("open")}
                    className={`px-4 py-2 rounded-full transition ${statusFilter === "open" ? "bg-emerald-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                >
                    Open
                </button>
                <button
                    onClick={() => setStatusFilter("pending")}
                    className={`px-4 py-2 rounded-full transition ${statusFilter === "pending" ? "bg-amber-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                >
                    Pending
                </button>
                <button
                    onClick={() => setStatusFilter("closed")}
                    className={`px-4 py-2 rounded-full transition ${statusFilter === "closed" ? "bg-rose-500 text-slate-950" : "bg-white/10 text-slate-300 hover:bg-white/20"}`}
                >
                    Closed
                </button>
            </div>

            <div className="bg-[#0d1726]/95 rounded-[2rem] border border-white/10 shadow-[0_25px_50px_rgba(0,0,0,0.25)] overflow-hidden">
                {loadingList ? (
                    <div className="p-8 text-center text-slate-400">Loading tickets...</div>
                ) : tickets.length === 0 ? (
                    <div className="p-8 text-center text-slate-400">No tickets found</div>
                ) : (
                    <div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-white/10">
                                <thead className="bg-white/5">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Subject</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Priority</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Status</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Created</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-400 uppercase">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[#08101a] divide-y divide-white/10">
                                    {tickets.map((ticket) => (
                                        <tr key={ticket.id} className="hover:bg-white/5">
                                            <td className="px-6 py-4 text-sm text-slate-200">#{ticket.id}</td>
                                            <td className="px-6 py-4 text-sm font-medium text-white">{ticket.subject}</td>
                                            <td className="px-6 py-4 text-sm">{getPriorityBadge(ticket.priority)}</td>
                                            <td className="px-6 py-4 text-sm">{getStatusBadge(ticket.status)}</td>
                                            <td className="px-6 py-4 text-sm text-slate-400">{new Date(ticket.created_at).toLocaleDateString()}</td>
                                            <td className="px-6 py-4 text-sm">
                                                <Link href={`/user/support/${ticket.id}`} className="text-cyan-300 hover:text-cyan-200 font-medium">
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
                                <div className="text-sm text-slate-400">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition"
                                    >
                                        Previous
                                    </button>
                                    <button
                                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                        disabled={currentPage === totalPages}
                                        className="px-3 py-1 rounded-full border border-white/10 bg-white/5 text-slate-300 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed transition"
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
