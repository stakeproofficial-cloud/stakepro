import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

type WithdrawRequest = {
    status: string; id: number; user_id: number; amount: string; state: string; created_at?: string; address?: string; email: string; user?: { name: string; },
    wallet_address_full: string, wallet_address: string
};

type WithdrawState = { adminList: WithdrawRequest[]; userList: WithdrawRequest[]; loading: boolean; error?: string | null };

const initialState: WithdrawState = { adminList: [], userList: [], loading: false, error: null };

export const fetchAdminWithdraws = createAsyncThunk("withdraws/admin", async () => {
    const r = await api.get("admin/usdt-staking/withdraw-requests");
    console.log(r.data);
    return r.data;
});

export const fetchUserWithdraws = createAsyncThunk("withdraws/user", async () => {
    const r = await api.get("usdt-staking/withdraw-requests");
    console.log(r.data);
    return r.data;
});

export const reqUserWithdraws = createAsyncThunk("withdraws/user", async (payload: { wallet_address: string; amount: number, }, { rejectWithValue }) => {
    const r = await api.post("usdt-staking/withdraw-request", payload);
    console.log(r.data)
    return r.data;
});

export const updateWithdrawStatus = createAsyncThunk(
    "withdraws/updateStatus",
    async (payload: { id: number; action: 'approve' | 'reject'; reason?: string }, { rejectWithValue }) => {
        try {
            const r = await api.post("admin/usdt-staking/withdraw-requests", {
                withdraw_id: payload.id,
                status: payload.action === 'approve' ? 'approve' : 'reject',
                reason: payload.reason,
            });
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const withdrawSlice = createSlice({
    name: "withdraws",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchAdminWithdraws.pending, (s) => { s.loading = true; })
            .addCase(fetchAdminWithdraws.fulfilled, (s, a) => {
                s.loading = false;
                const p = a.payload;
                s.adminList = Array.isArray(p) ? p : (Array.isArray(p?.withdraw_requests) ? p.withdraw_requests : (Array.isArray(p?.data) ? p.data : []));
            })
            .addCase(fetchAdminWithdraws.rejected, (s) => { s.loading = false; })
            .addCase(fetchUserWithdraws.fulfilled, (s, a) => {
                const p = a.payload;
                s.userList = Array.isArray(p) ? p : (Array.isArray(p?.withdraw_requests) ? p.withdraw_requests : (Array.isArray(p?.data) ? p.data : []));
            })
            .addCase(updateWithdrawStatus.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(updateWithdrawStatus.fulfilled, (s) => { s.loading = false; })
            .addCase(updateWithdrawStatus.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; });
    },
});

export default withdrawSlice.reducer;