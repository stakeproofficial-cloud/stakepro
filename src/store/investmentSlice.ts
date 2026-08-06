import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";

type Investment = { id: number; user_id: number; product_id: number; amount: number; created_at?: string, next_profit_at?: string };

type InvestmentsState = { items: Investment[]; loading: boolean; error?: string | null };

const initialState: InvestmentsState = { items: [], loading: false, error: null };

export const fetchInvestments = createAsyncThunk("investments/fetch", async () => {
    const r = await api.get("/investments");
    console.log(r.data);
    return r.data;
});

export const addInvestment = createAsyncThunk("investments/add", async (payload: { product_id: number; amount: number }) => {

    const r = await api.post("/investments/teststore", payload);
    return r.data;
});

const investmentsSlice = createSlice({
    name: "investments",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchInvestments.pending, (s) => { s.loading = true; })
            .addCase(fetchInvestments.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
            .addCase(fetchInvestments.rejected, (s, a: any) => { s.loading = false; s.error = a.error?.message ?? a.payload?.message; })

            .addCase(addInvestment.fulfilled, (s, a) => { s.items.push(a.payload); });
    },
});

export default investmentsSlice.reducer;