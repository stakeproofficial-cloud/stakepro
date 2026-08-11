import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export type DetailedTransaction = {
    id: number;
    user_id?: number;
    email?: string;
    txn_number?: string;
    type: string;
    txn_type?: string;
    amount: number;
    description: string;
    balance_before?: number | null;
    balance_after?: number | null;
    created_at?: string;
};

export type PaginationInfo = {
    current_page: number;
    limit: number;
    total: number;
    total_pages: number;
    offset: number;
};

export type TransactionsState = {
    items: DetailedTransaction[];
    pagination: PaginationInfo | null;
    loading: boolean;
    error?: string | null;
};

const initialState: TransactionsState = {
    items: [],
    pagination: {
        current_page: 1,
        limit: 50,
        total: 52,
        total_pages: 2,
        offset: 0,
    },
    loading: false,
    error: null,
};

const normalizeTransaction = (item: any): DetailedTransaction => {
    const rawType = item.type || item.txn_type || "transaction";
    const rawDesc = item.description || "";
    // Clean double dollar signs if present
    const cleanDesc = rawDesc.replace(/\$\$/g, "$");
    return {
        id: Number(item.id),
        user_id: item.user_id ? Number(item.user_id) : undefined,
        email: item.email || item.user_email || item.user?.email || undefined,
        txn_number: item.txn_number || `TXN-${item.id}`,
        type: rawType,
        txn_type: rawType,
        amount: Number(item.amount || 0),
        description: cleanDesc,
        balance_before: item.balance_before !== undefined && item.balance_before !== null ? Number(item.balance_before) : null,
        balance_after: item.balance_after !== undefined && item.balance_after !== null ? Number(item.balance_after) : null,
        created_at: item.created_at || new Date().toISOString(),
    };
};

export const fetchTransactions = createAsyncThunk(
    "transactions/fetch",
    async (params: { page?: number; limit?: number; type?: string; search?: string } = {}, { rejectWithValue }) => {
        try {
            const query = new URLSearchParams();
            if (params?.page) query.append("page", String(params.page));
            if (params?.limit) query.append("limit", String(params.limit));
            if (params?.type && params.type !== "all") query.append("type", params.type);
            if (params?.search) query.append("search", params.search);

            const url = `/detailed${query.toString() ? `?${query.toString()}` : ""}`;
            const r = await api.get(url);
            return r.data;
        } catch (err: any) {
            // Return null or reject with value to retain initial/fallback data on API error
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchTransactions.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
            .addCase(fetchTransactions.fulfilled, (s, a) => {
                s.loading = false;
                const p = a.payload;
                if (p && Array.isArray(p.transactions)) {
                    s.items = p.transactions.map(normalizeTransaction);
                    if (p.pagination) s.pagination = p.pagination;
                } else if (p && Array.isArray(p.data)) {
                    s.items = p.data.map(normalizeTransaction);
                    if (p.pagination) s.pagination = p.pagination;
                } else if (Array.isArray(p)) {
                    s.items = p.map(normalizeTransaction);
                }
            })
            .addCase(fetchTransactions.rejected, (s, a: any) => {
                s.loading = false;
                // If API fails, keep current/initial items and set error message
                s.error = a.payload?.message || a.error?.message || "Failed to fetch remote transactions";
            });
    },
});

export default transactionsSlice.reducer;
