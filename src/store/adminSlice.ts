import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

interface AdminState {
    users: any[];
    usersSummary: any[];
    products: any[];
    loading: boolean;
    usersSummaryLoading: boolean;
    error?: string | null;
    usersSummaryError?: string | null;
    totalUsers: number;
    usersSummaryTotal: number;
    currentPage: number;
    usersSummaryPage: number;
    perPage: number;
    usersSummarySize: number;
    referralInvestments?: any;
    referralLoading?: boolean;
    referralSearchResult?: any;
    referralSearchLoading?: boolean;
    referralSearchError?: string | null;
}

const initialState: AdminState = {
    users: [],
    usersSummary: [],
    products: [],
    loading: false,
    usersSummaryLoading: false,
    error: null,
    usersSummaryError: null,
    totalUsers: 0,
    usersSummaryTotal: 0,
    currentPage: 1,
    perPage: 10,
    usersSummaryPage: 1,
    usersSummarySize: 25,
    referralInvestments: null,
    referralLoading: false,
    referralSearchResult: null,
    referralSearchLoading: false,
    referralSearchError: null
};

export const fetchUsers = createAsyncThunk(
    "admin/fetchUsers",
    async (params?: { page?: number; per_page?: number }) => {
        const page = params?.page || 1;
        const per_page = params?.per_page || 10;
        const r = await api.get(`admin/users?page=${page}&per_page=${per_page}`);
        return r.data;
    }
);

export const fetchUsersSummary = createAsyncThunk(
    "admin/fetchUsersSummary",
    async (params: { page?: number; size?: number } = {}, { rejectWithValue }) => {
        try {
            const page = params?.page || 1;
            const size = params?.size || 25;
            const r = await api.get(`admin/users/summary?page=${page}&size=${size}`);
            const payload = r.data || {};
            const users = Array.isArray(payload.users)
                ? payload.users.map((user: any) => ({
                    ...user,
                    id: Number(user?.id) || 0,
                    balance: Number(user?.balance) || 0,
                    active_investments_sum: Number(user?.active_investments_sum) || 0,
                    completed_investments_sum: Number(user?.completed_investments_sum) || 0,
                    active_investment_profit_sum: Number(user?.active_investment_profit_sum) || 0,
                    completed_investment_profit_sum: Number(user?.completed_investment_profit_sum) || 0,
                    total_investment_profit_sum: Number(user?.total_investment_profit_sum) || 0,
                    referral_investments_sum: Number(user?.referral_investments_sum) || 0,
                }))
                : [];

            return {
                page: Number(payload.page) || page,
                size: Number(payload.size) || size,
                total: Number(payload.total) || 0,
                users,
            };
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const searchUsers = createAsyncThunk(
    "admin/searchUsers",
    async (query: string) => {
        const r = await api.get(`admin/users?q=${encodeURIComponent(query)}`);
        return r.data;
    }
);

export const deleteUser = createAsyncThunk("admin/deleteUser", async (id: number) => {
    await api.get(`admin/users/delete?id=${id}`);
    return id;
});

export const fetchReferralInvestments = createAsyncThunk(
    "admin/fetchReferralInvestments",
    async (userId: number) => {
        const r = await api.get(`admin/referral_investments?user_id=${userId}`);
        return r.data;
    }
);

export const searchReferralInvestment = createAsyncThunk(
    "admin/searchReferralInvestment",
    async (query: string, { rejectWithValue }) => {
        try {
            const r = await api.get(`admin/referral_investments?q=${encodeURIComponent(query)}`);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const addProduct = createAsyncThunk("admin/addProduct", async (p: { name: string; min_price: number; max_price: number }) => {
    const r = await api.post("/products/store", p);
    return r.data;
});
export const adminBalance = createAsyncThunk(
    "admin/updateBalance",
    async (payload: { user_id: number; amount: number, txn_hash: any, type: string }, { rejectWithValue }) => {
        try {
            const r = await api.post("admin/balance/update", payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<any[]>) {
            state.users = action.payload;
        },
        setProducts(state, action: PayloadAction<any[]>) {
            state.products = action.payload;
        },
    },
    extraReducers: (b) => {
        b.addCase(fetchUsers.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchUsers.fulfilled, (s, a) => {
                s.loading = false;
                s.users = a.payload.users || a.payload.data || a.payload;
                s.totalUsers = a.payload.total || a.payload.users?.length || a.payload.data?.length || a.payload.length || 0;
                s.currentPage = a.payload.current_page || a.payload.page || 1;
                s.perPage = a.payload.per_page || 10;
            })
            .addCase(fetchUsers.rejected, (s, a: any) => { s.loading = false; s.error = a.error?.message ?? a.payload?.message; })

            .addCase(fetchUsersSummary.pending, (s) => {
                s.usersSummaryLoading = true;
                s.usersSummaryError = null;
            })
            .addCase(fetchUsersSummary.fulfilled, (s, a: any) => {
                s.usersSummaryLoading = false;
                s.usersSummary = a.payload?.users || [];
                s.usersSummaryTotal = a.payload?.total || 0;
                s.usersSummaryPage = a.payload?.page || 1;
                s.usersSummarySize = a.payload?.size || 25;
            })
            .addCase(fetchUsersSummary.rejected, (s, a: any) => {
                s.usersSummaryLoading = false;
                s.usersSummaryError = a.error?.message ?? a.payload?.message;
            })

            .addCase(fetchReferralInvestments.pending, (s) => { s.referralLoading = true; })
            .addCase(fetchReferralInvestments.fulfilled, (s, a) => {
                s.referralLoading = false;
                s.referralInvestments = a.payload;
            })
            .addCase(fetchReferralInvestments.rejected, (s, a: any) => { s.referralLoading = false; s.error = a.error?.message ?? a.payload?.message; })

            .addCase(searchReferralInvestment.pending, (s) => {
                s.referralSearchLoading = true;
                s.referralSearchError = null;
            })
            .addCase(searchReferralInvestment.fulfilled, (s, a) => {
                s.referralSearchLoading = false;
                s.referralSearchResult = a.payload;
            })
            .addCase(searchReferralInvestment.rejected, (s, a: any) => {
                s.referralSearchLoading = false;
                s.referralSearchError = a.error?.message ?? a.payload?.message;
            })

            .addCase(deleteUser.fulfilled, (s, a) => { s.users = s.users.filter(u => u.id !== a.payload); })

            .addCase(addProduct.fulfilled, (s, a) => { s.products.push(a.payload); });
    },
});

export const { setUsers, setProducts } = adminSlice.actions;
export default adminSlice.reducer;
