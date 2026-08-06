import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

type BalancesState = { loading: boolean; error?: string | null };

const initialState: BalancesState = { loading: false, error: null };

export const updateBalance = createAsyncThunk(
    "balances/update",
    async (payload: { user_id: number; amount: number, txn_hash: any, type: string }, { rejectWithValue }) => {
        try {
            const r = await api.post("/balance", payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const balancesSlice = createSlice({
    name: "balances",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(updateBalance.pending, (s) => {
            s.loading = true;
            s.error = null;
        })
            .addCase(updateBalance.fulfilled, (s) => {
                s.loading = false;
            })
            .addCase(updateBalance.rejected, (s, a: any) => {
                s.loading = false;
                s.error = a.payload?.message || a.error?.message;
            });
    },
});

export default balancesSlice.reducer; 