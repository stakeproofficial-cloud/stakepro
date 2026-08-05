import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

type Transaction = { id: number; user_id: number; txn_number: string; amount: number; created_at?: string, txn_type: string };

type TransactionsState = { items: Transaction[]; loading: boolean; error?: string | null };

const initialState: TransactionsState = { items: [], loading: false, error: null };

export const fetchTransactions = createAsyncThunk("transactions/fetch", async () => {
    const r = await api.get("/detailed");
    console.log(r.data);
    return r.data;
});

const transactionsSlice = createSlice({
    name: "transactions",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchTransactions.fulfilled, (s, a) => { s.items = a.payload; });
    },
});

export default transactionsSlice.reducer;