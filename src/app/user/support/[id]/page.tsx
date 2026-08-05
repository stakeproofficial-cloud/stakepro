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
            open: "bg-green-100 text-green-800",
            pending: "bg-yellow-100 text-yellow-800",
            closed: "bg-red-100 text-red-800",
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}>{status.toUpperCase()}</span>;
    };

    const getPriorityBadge = (priority: string) => {
        const styles: Record<string, string> = {
            low: "bg-blue-100 text-blue-800",
            normal: "bg-gray-100 text-gray-800",
            high: "bg-orange-100 text-orange-800",
            urgent: "bg-red-100 text-red-800",
        };
        return <span className={`px-3 py-1 rounded-full text-xs font-medium ${styles[priority] || "bg-gray-100 text-gray-800"}`}>{priority.toUpperCase()}</span>;
    };

    if (loadingTicketId === ticketId) {
        return <div className="p-6 text-center">Loading ticket...</div>;
    }

    if (!ticket) {
        return (
            <div className="p-6">
                <div className="text-center">
                    <p className="text-gray-500 mb-4">Ticket not found</p>
                    <Link href="/user/support" className="text-blue-600 hover:text-blue-800">
                        Back to Support
                    </Link>
                </div>
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

            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">Conversation</h2>
                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                    {messages.length === 0 ? (
                        <div className="text-center text-gray-500 py-8">No messages yet</div>
                    ) : (
                        messages.map((msg: SupportMessage) => (
                            <div key={msg.id} className={`p-4 rounded-lg ${msg.sender_role === "admin" ? "bg-blue-50 border border-blue-200" : "bg-gray-50 border border-gray-200"}`}>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-medium">{msg.sender_role === "admin" ? "Support Staff" : "You"}</span>
                                    <span className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()}</span>
                                </div>
                                <p className="text-gray-800 whitespace-pre-line">{msg.message}</p>
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
                                                className="max-h-64 rounded border border-gray-200 object-contain"
                                            />
                                        </a>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {ticket.status !== "closed" && (
                    <form onSubmit={handleReply} className="space-y-3 pt-4 border-t">
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                            placeholder="Type your reply..."
                            required
                        />
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Attach Image (optional)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setReplyImage(e.target.files?.[0] || null)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {replyImage && (
                                <p className="text-sm text-gray-600 mt-1">Selected: {replyImage.name}</p>
                            )}
                        </div>
                        <button
                            type="submit"
                            disabled={replyingTicketId === ticketId}
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
                        >
                            {replyingTicketId === ticketId ? "Sending..." : "Send Reply"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
