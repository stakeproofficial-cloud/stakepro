"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTicket, replyToTicket, selectMessagesFor, selectTicketById } from "@/store/supportSlice";
import type { SupportMessage } from "@/types/supportTypes";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

export default function UserTicketDetailPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const ticketId = parseInt(params.id as string);
    const ticket = useAppSelector((s) => selectTicketById(ticketId)(s));
    const messages = useAppSelector((s) => selectMessagesFor(ticketId)(s));
    const { loadingTicketId, replyingTicketId, error } = useAppSelector((s) => s.support);
    const [replyText, setReplyText] = useState("");
    const [replyImage, setReplyImage] = useState<File | null>(null);

    useEffect(() => {
        dispatch(fetchTicket({ ticketId }) as any);
    }, [dispatch, ticketId]);

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyText.trim()) {
            alert("Please enter a message");
            return;
        }

        try {
            await dispatch(
                replyToTicket({
                    ticketId,
                    message: replyText,
                    image: replyImage || undefined,
                }) as any
            ).unwrap();
            alert("Reply sent successfully");
            setReplyText("");
            setReplyImage(null);
            dispatch(fetchTicket({ ticketId }) as any);
        } catch (err) {
            alert("Failed to send reply");
        }
    };

    const getStatusBadge = (status: string) => {
        const styles: Record<string, string> = {
            open: "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20",
            pending: "bg-amber-500/15 text-amber-300 border border-amber-500/20",
            closed: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-slate-700 text-slate-200 border border-slate-700"}`}>{status.toUpperCase()}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: "bg-sky-500/15 text-sky-300 border border-sky-500/20",
            normal: "bg-slate-700 text-slate-200 border border-slate-700",
            high: "bg-orange-500/15 text-orange-300 border border-orange-500/20",
            urgent: "bg-rose-500/15 text-rose-300 border border-rose-500/20",
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-slate-700 text-slate-200 border border-slate-700"}`}>{priority.toUpperCase()}</span>;
    };

    if (loadingTicketId === ticketId) {
        return <div className="p-6 text-center text-slate-200">Loading ticket...</div>;
    }

    if (!ticket) {
        return (
            <div className="p-6 text-center text-slate-200">
                <p className="text-slate-400 mb-4">Ticket not found</p>
                <Link href="/user/support" className="text-cyan-400 hover:text-cyan-300">
                    Back to Support
                </Link>
            </div>
        );
    }

    return (
        <div>
            <div className="mb-6 flex items-center justify-between">
                <Link href="/user/support" className="text-blue-600 hover:text-blue-800 font-medium">
                    ← Back to Tickets
                </Link>
                <div className="flex gap-2">
                    {getStatusBadge(ticket.status)}
                    {getPriorityBadge(ticket.priority)}
                </div>
            </div>

            {error && <div className="mb-4 p-4 bg-red-100 text-red-800 rounded">{error}</div>}

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h1 className="text-2xl font-bold mb-2">{ticket.subject}</h1>
                <div className="text-sm text-gray-600 space-y-1">
                    <p>
                        <strong>Ticket ID:</strong> #{ticket.id}
                    </p>
                    <p>
                        <strong>Created:</strong> {new Date(ticket.created_at).toLocaleString()}
                    </p>
                    <p>
                        <strong>Updated:</strong> {new Date(ticket.updated_at).toLocaleString()}
                    </p>
                </div>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-[#0d1624]/95 shadow-[0_24px_60px_rgba(0,0,0,0.35)] p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4 text-white">Conversation</h2>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="text-center text-slate-400 py-8">No messages yet</div>
                    ) : (
                        messages.map((msg: SupportMessage) => (
                            <div key={msg.id} className={`p-4 rounded-3xl ${msg.sender_role === "admin" ? "bg-slate-900/70 border border-cyan-500/10" : "bg-slate-900/60 border border-white/10"}`}>
                                <div className="flex items-center justify-between mb-2 text-slate-200">
                                    <span className="font-medium">{msg.sender_role === "admin" ? "Support Staff" : "You"}</span>
                                    <span className="text-xs text-slate-400">{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                                <p className="whitespace-pre-line text-slate-200">{msg.message}</p>
                                {msg.attachment_url && (
                                    <div className="mt-3">
                                        <a
                                            href={msg.attachment_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="block"
                                        >
                                            <img
                                                src={msg.attachment_url}
                                                alt="Attachment"
                                                className="max-h-64 rounded border border-white/10 object-contain"
                                            />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {ticket.status !== "closed" && (
                    <form onSubmit={handleReply} className="space-y-3 pt-4 border-t border-white/10">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 h-24"
                            placeholder="Type your reply..."
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-slate-300 mb-2">Attach Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setReplyImage(e.target.files?.[0] || null)}
                                className="w-full rounded-3xl border border-white/10 bg-white/5 px-3 py-2 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400"
                            />
                            {replyImage && (
                                <p className="text-sm text-slate-400 mt-1">Selected: {replyImage.name}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={replyingTicketId === ticketId}
                            className="w-full rounded-3xl bg-cyan-500 py-2 text-slate-950 hover:bg-cyan-400 transition disabled:bg-slate-700"
                        >
                            {replyingTicketId === ticketId ? "Sending..." : "Send Reply"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
