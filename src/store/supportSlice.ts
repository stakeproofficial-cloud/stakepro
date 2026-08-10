import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import api from "@/lib/api";
import type { RootState } from './store';
import type {
    SupportTicket,
    SupportMessage,
    TicketListResponse,
    TicketWithMessagesResponse,
    TicketFilters,
    Pagination,
    TicketPriority,
} from '@/types/supportTypes';

// Thunk args
export interface FetchTicketsArgs extends TicketFilters {
    page?: number;
    size?: number;
    token?: string; // Bearer token
}

export interface FetchTicketArgs { ticketId: number; token?: string }
export interface CreateTicketArgs { subject: string; message: string; priority?: TicketPriority; token?: string; image?: File }
export interface ReplyArgs { ticketId: number; message: string; token?: string; image?: File }
export interface CloseArgs { ticketId: number; token?: string }

// State
export interface SupportState {
    items: SupportTicket[];
    byId: Record<number, SupportTicket>;
    messagesByTicketId: Record<number, SupportMessage[]>;
    pagination: Pagination;
    filters: TicketFilters;
    loadingList: boolean;
    loadingTicketId: number | null;
    creating: boolean;
    replyingTicketId: number | null;
    closingTicketId: number | null;
    error: string | null;
}

const initialState: SupportState = {
    items: [],
    byId: {},
    messagesByTicketId: {},
    pagination: { page: 1, size: 25, total: 0 },
    filters: {},
    loadingList: false,
    loadingTicketId: null,
    creating: false,
    replyingTicketId: null,
    closingTicketId: null,
    error: null,
};

// Async thunks
export const fetchTickets = createAsyncThunk(
    'support/fetchTickets',
    async (args: FetchTicketsArgs, { rejectWithValue }) => {
        try {
            const { page = 1, size = 25, status, q, all } = args;
            const params: any = { page, size };
            if (status) params.status = status;
            if (q) params.q = q;
            if (all) params.all = 1;
            const response = await api.get<TicketListResponse>('support/tickets', { params });
            return { data: response.data, params: { page, size, status, q, all } };
        } catch (e: any) {
            return rejectWithValue(e.message || 'Failed to fetch tickets');
        }
    }
);

export const fetchTicket = createAsyncThunk(
    'support/fetchTicket',
    async (args: FetchTicketArgs, { rejectWithValue }) => {
        try {
            const { ticketId } = args;
            const response = await api.get<TicketWithMessagesResponse>('support/tickets/show', {
                params: { ticket_id: ticketId },
            });
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e.message || 'Failed to fetch ticket');
        }
    }
);

export const createTicket = createAsyncThunk(
    'support/createTicket',
    async (args: CreateTicketArgs, { rejectWithValue }) => {
        try {
            const { subject, message, priority = 'normal', image } = args;

            if (image) {
                const formData = new FormData();
                formData.append('subject', subject);
                formData.append('message', message);
                formData.append('priority', priority);
                formData.append('image', image);

                const response = await api.post<{ message: string; ticket_id: number }>('support/tickets/store', formData);
                return response.data;
            }

            const response = await api.post<{ message: string; ticket_id: number }>('support/tickets/store', {
                subject,
                message,
                priority,
            });
            return response.data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Failed to create ticket');
        }
    }
);

export const replyToTicket = createAsyncThunk(
    'support/replyToTicket',
    async (args: ReplyArgs, { rejectWithValue }) => {
        try {
            const { ticketId, message, image } = args;

            if (image) {
                const formData = new FormData();
                formData.append('ticket_id', ticketId.toString());
                formData.append('message', message);
                formData.append('image', image);

                const response = await api.post<{ message: string }>('support/tickets/reply', formData);
                return { ticketId, ack: response.data.message };
            }

            const response = await api.post<{ message: string }>('support/tickets/reply', {
                ticket_id: ticketId,
                message,
            });
            return { ticketId, ack: response.data.message };
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.error || e?.response?.data?.message || e.message || 'Failed to reply');
        }
    }
);

export const closeTicket = createAsyncThunk(
    'support/closeTicket',
    async (args: CloseArgs, { rejectWithValue }) => {
        try {
            const { ticketId } = args;
            const response = await api.post<{ message: string }>('support/tickets/close', {
                ticket_id: ticketId,
            });
            return { ticketId, ack: response.data.message };
        } catch (e: any) {
            return rejectWithValue(e.message || 'Failed to close ticket');
        }
    }
);

const supportSlice = createSlice({
    name: 'support',
    initialState,
    reducers: {
        setFilters(state, action: PayloadAction<TicketFilters>) {
            state.filters = { ...state.filters, ...action.payload };
        },
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // fetchTickets
            .addCase(fetchTickets.pending, (state, action) => {
                state.loadingList = true;
                state.error = null;
            })
            .addCase(fetchTickets.fulfilled, (state, action) => {
                state.loadingList = false;
                const { data, params } = action.payload as { data: TicketListResponse; params: FetchTicketsArgs };
                state.items = data.items;
                state.pagination = { page: data.page, size: data.size, total: data.total };
                if (params) {
                    const { status, q, all } = params;
                    state.filters = { status, q, all };
                }
                // index into byId
                data.items.forEach((t) => {
                    state.byId[t.id] = t;
                });
            })
            .addCase(fetchTickets.rejected, (state, action) => {
                state.loadingList = false;
                state.error = (action.payload as string) || 'Failed to fetch tickets';
            })
            // fetchTicket
            .addCase(fetchTicket.pending, (state, action) => {
                state.loadingTicketId = (action.meta.arg as FetchTicketArgs).ticketId;
                state.error = null;
            })
            .addCase(fetchTicket.fulfilled, (state, action) => {
                state.loadingTicketId = null;
                const { ticket, messages } = action.payload as TicketWithMessagesResponse;
                state.byId[ticket.id] = ticket;
                // also update in items if present
                const idx = state.items.findIndex((i) => i.id === ticket.id);
                if (idx >= 0) state.items[idx] = ticket;
                state.messagesByTicketId[ticket.id] = messages;
            })
            .addCase(fetchTicket.rejected, (state, action) => {
                state.loadingTicketId = null;
                state.error = (action.payload as string) || 'Failed to fetch ticket';
            })
            // createTicket
            .addCase(createTicket.pending, (state) => {
                state.creating = true;
                state.error = null;
            })
            .addCase(createTicket.fulfilled, (state, action) => {
                state.creating = false;
                const { ticket_id } = action.payload as { ticket_id: number };
                // Optimistic placeholder; UI can dispatch fetchTicket(ticket_id) to hydrate
                if (!state.byId[ticket_id]) {
                    const placeholder: SupportTicket = {
                        id: ticket_id,
                        user_id: 0,
                        subject: '(new ticket)',
                        priority: 'normal',
                        status: 'open',
                        created_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        updated_at: new Date().toISOString().slice(0, 19).replace('T', ' '),
                        last_message_at: null,
                        last_message_by_role: null,
                    } as any;
                    state.byId[ticket_id] = placeholder;
                    state.items.unshift(placeholder);
                }
            })
            .addCase(createTicket.rejected, (state, action) => {
                state.creating = false;
                state.error = (action.payload as string) || 'Failed to create ticket';
            })
            // replyToTicket
            .addCase(replyToTicket.pending, (state, action) => {
                state.replyingTicketId = (action.meta.arg as ReplyArgs).ticketId;
                state.error = null;
            })
            .addCase(replyToTicket.fulfilled, (state, action) => {
                const { ticketId } = action.meta.arg as ReplyArgs;
                state.replyingTicketId = null;
                // We don't know the new message ID without refetch; mark need to refetch
                // Optionally set status to open/pending depending on sender, but unknown here
                const t = state.byId[ticketId];
                if (t) {
                    t.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                }
            })
            .addCase(replyToTicket.rejected, (state, action) => {
                state.replyingTicketId = null;
                state.error = (action.payload as string) || 'Failed to reply';
            })
            // closeTicket
            .addCase(closeTicket.pending, (state, action) => {
                state.closingTicketId = (action.meta.arg as CloseArgs).ticketId;
                state.error = null;
            })
            .addCase(closeTicket.fulfilled, (state, action) => {
                const { ticketId } = action.meta.arg as CloseArgs;
                state.closingTicketId = null;
                const t = state.byId[ticketId];
                if (t) {
                    t.status = 'closed';
                    t.updated_at = new Date().toISOString().slice(0, 19).replace('T', ' ');
                }
                const idx = state.items.findIndex((i) => i.id === ticketId);
                if (idx >= 0) state.items[idx] = { ...state.items[idx], status: 'closed' };
            })
            .addCase(closeTicket.rejected, (state, action) => {
                state.closingTicketId = null;
                state.error = (action.payload as string) || 'Failed to close ticket';
            });
    },
});

export const { setFilters, resetError } = supportSlice.actions;

// Selectors
export const selectSupportState = (s: RootState) => s.support;
export const selectTickets = (s: RootState) => s.support.items;
export const selectTicketById = (id: number) => (s: RootState) => s.support.byId[id];
export const selectMessagesFor = (id: number) => (s: RootState) => s.support.messagesByTicketId[id] || [];
export const selectListLoading = (s: RootState) => s.support.loadingList;
export const selectCreating = (s: RootState) => s.support.creating;
export const selectReplyingTicketId = (s: RootState) => s.support.replyingTicketId;
export const selectClosingTicketId = (s: RootState) => s.support.closingTicketId;
export const selectError = (s: RootState) => s.support.error;

export default supportSlice.reducer;
