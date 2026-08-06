import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

type Wallet = { id: number; erc20address: string };

type WalletsState = { items: Wallet[]; loading: boolean; error?: string | null };

const initialState: WalletsState = { items: [], loading: false, error: null };

export const fetchWallets = createAsyncThunk("wallets/fetch", async () => {
    const r = await api.get("/api/getadminwallet.php");
    console.log(r.data);
    return r.data;
});

export const addWallet = createAsyncThunk("wallets/add", async (payload: { erc20address: string }) => {
    const r = await api.post("/wallets/store", payload);
    return r.data;
});

export const deleteWallet = createAsyncThunk('wallets/delete', async (payload: { id: any }) => {
    // axios.delete accepts config as the second argument; pass the payload as { data: payload }
    const r = await api.delete("/wallets/store", { data: payload });
    return r.data;
});

const walletsSlice = createSlice({
    name: "wallets",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchWallets.fulfilled, (s, a) => { s.items = a.payload; })
            .addCase(addWallet.fulfilled, (s, a) => { s.items.push(a.payload); })
            .addCase(deleteWallet.fulfilled, (s, a) => {
                // assume the API returns the deleted id or the deleted wallet; handle both shapes
                const deletedId = a.payload?.id ?? a.payload;
                if (deletedId !== undefined) {
                    s.items = s.items.filter(w => w.id !== deletedId);
                }
            });
    },
});

export default walletsSlice.reducer;