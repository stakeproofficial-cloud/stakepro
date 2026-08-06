import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Penalty {
    id: string | number;
    penalty_amount: string | number;
    amount_deducted: string | number;
    status: string;
    created_at?: string;
}

export interface PenaltyResponse {
    success: boolean;
    penalties: Penalty[];
    total_active_penalties: number;
    total_pending_amount: number;
    total_deducted: number;
}

export interface AdminPenalty {
    id?: number;
    user_id: number;
    amount: number;
    reason: string;
    created_at?: string;
    user?: {
        id: number;
        email: string;
        name: string;
    };
}

interface PenaltyState {
    penalties: AdminPenalty[];
    userPenalties: Penalty[];
    loading: boolean;
    userPenaltiesLoading: boolean;
    error?: string | null;
    totalPenalties: number;
    totalActivePenalties: number;
    totalPendingAmount: number;
    totalDeducted: number;
    currentPage: number;
    perPage: number;
}

const initialState: PenaltyState = {
    penalties: [],
    userPenalties: [],
    loading: false,
    userPenaltiesLoading: false,
    error: null,
    totalPenalties: 0,
    totalActivePenalties: 0,
    totalPendingAmount: 0,
    totalDeducted: 0,
    currentPage: 1,
    perPage: 10,
};

export const fetchPenalties = createAsyncThunk(
    "penalty/fetchPenalties",
    async (params?: { page?: number; per_page?: number }) => {
        const page = params?.page || 1;
        const per_page = params?.per_page || 10;
        const r = await api.get(`admin/penalties?page=${page}&per_page=${per_page}`);
        return r.data;
    }
);

export const fetchUserPenalties = createAsyncThunk(
    "penalty/fetchUserPenalties",
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get("/penalties");
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const createPenalty = createAsyncThunk(
    "penalty/createPenalty",
    async (
        payload: { user_id: number; amount: number; reason: string },
        { rejectWithValue }
    ) => {
        try {
            const r = await api.post("admin/penalties", payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const deletePenalty = createAsyncThunk(
    "penalty/deletePenalty",
    async (id: number, { rejectWithValue }) => {
        try {
            await api.delete(`admin/penalties/${id}`);
            return id;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const penaltySlice = createSlice({
    name: "penalty",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchPenalties.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(fetchPenalties.fulfilled, (s, a) => {
                s.loading = false;
                s.penalties = a.payload.penalties || a.payload.data || a.payload;
                s.totalPenalties =
                    a.payload.total ||
                    a.payload.penalties?.length ||
                    a.payload.data?.length ||
                    a.payload.length ||
                    0;
                s.currentPage = a.payload.current_page || a.payload.page || 1;
                s.perPage = a.payload.per_page || 10;
            })
            .addCase(fetchPenalties.rejected, (s, a: any) => {
                s.loading = false;
                s.error = a.error?.message ?? a.payload?.message;
            })

            .addCase(createPenalty.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(createPenalty.fulfilled, (s, a) => {
                s.loading = false;
                s.penalties.unshift(a.payload);
                s.totalPenalties += 1;
            })
            .addCase(createPenalty.rejected, (s, a: any) => {
                s.loading = false;
                s.error = a.error?.message ?? a.payload?.message;
            })

            .addCase(deletePenalty.pending, (s) => {
                s.loading = true;
                s.error = null;
            })
            .addCase(deletePenalty.fulfilled, (s, a) => {
                s.loading = false;
                s.penalties = s.penalties.filter((p) => p.id !== a.payload);
                s.totalPenalties -= 1;
            })
            .addCase(deletePenalty.rejected, (s, a: any) => {
                s.loading = false;
                s.error = a.error?.message ?? a.payload?.message;
            })

            .addCase(fetchUserPenalties.pending, (s) => {
                s.userPenaltiesLoading = true;
                s.error = null;
            })
            .addCase(fetchUserPenalties.fulfilled, (s, a: any) => {
                s.userPenaltiesLoading = false;
                s.userPenalties = a.payload.penalties || [];
                s.totalActivePenalties = a.payload.total_active_penalties || 0;
                s.totalPendingAmount = a.payload.total_pending_amount || 0;
                s.totalDeducted = a.payload.total_deducted || 0;
            })
            .addCase(fetchUserPenalties.rejected, (s, a: any) => {
                s.userPenaltiesLoading = false;
                s.error = a.error?.message ?? a.payload?.message;
            });
    },
});

export default penaltySlice.reducer;
