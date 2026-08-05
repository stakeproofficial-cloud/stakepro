// Types for the Support System

export type TicketPriority = 'low' | 'normal' | 'high';
export type TicketStatus = 'open' | 'pending' | 'closed';
export type SenderRole = 'user' | 'admin';

export interface SupportTicket {
    id: number;
    user_id: number;
    assigned_admin_id?: number | null;
    subject: string;
    priority: TicketPriority;
    status: TicketStatus;
    last_message_at?: string | null; // datetime string
    last_message_by_role?: SenderRole | null;
    created_at: string; // datetime
    updated_at: string; // datetime
    // Optional denormalized fields from index listing
    user_email?: string;
}

export interface SupportMessage {
    id: number;
    ticket_id: number;
    sender_id: number;
    sender_role: SenderRole;
    message: string;
    attachment_path?: string | null;
    attachment_url?: string | null;
    created_at: string; // datetime
}

export interface TicketListResponse {
    total: number;
    page: number;
    size: number;
    items: SupportTicket[];
}

export interface TicketWithMessagesResponse {
    ticket: SupportTicket;
    messages: SupportMessage[];
}

export interface Pagination {
    page: number;
    size: number;
    total: number;
}

export interface TicketFilters {
    status?: TicketStatus;
    q?: string;
    all?: boolean; // admin-only; ignored by backend for users
}
