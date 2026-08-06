import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

type Profit = { id: number; investment_id: number; amount: number; created_at?: string };

type ProfitsState = { items: Profit[]; loading: boolean; error?: string | null };

const initialState: ProfitsState = { items: [], loading: false, error: null };

export const fetchUserProfits = createAsyncThunk("profits/fetchUser", async () => {
    const r = await api.get("/profit/user");
    return r.data;
});

const profitsSlice = createSlice({
    name: "profits",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchUserProfits.fulfilled, (s, a) => { s.items = a.payload; });
    },
});

export default profitsSlice.reducer;