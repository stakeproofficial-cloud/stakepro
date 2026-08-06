import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

export interface Product {
    image_url: string;
    id?: number;
    name: string;
    image?: string;
    min_price: number;
    max_price: number;
    min_profit: number;
    max_profit: number;
    state?: string;
}

interface ProductState {
    items: Product[];
    loading: boolean;
    error?: string;
}

const initialState: ProductState = {
    items: [],
    loading: false,
};

export const fetchProducts = createAsyncThunk(
    "products/fetch",
    async (params?: { limit?: number }) => {
        const query = params?.limit ? `?limit=${params.limit}` : "";
        var res = await api.get(`products${query}`);
        return res.data;
    }
);

export const createProduct = createAsyncThunk(
    "products/create",
    async (payload: { formData: FormData; }) => {
        return await api.post("products/store", payload.formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
);

export const updateProduct = createAsyncThunk(
    "products/update",
    async (payload: { id: number; formData: FormData; token: string }) => {
        return await api.put("products/update", payload.formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    }
);

export const deleteProduct = createAsyncThunk(
    "products/delete",
    async (payload: { id: number; token: string }) => {
        return await api.delete(`products/delete?id=${payload.id}`);
    }
);

const productSlice = createSlice({
    name: "products",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (s) => { s.loading = true; })
            .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.items = a.payload; })
            .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.error.message; });
    },
});

export default productSlice.reducer;
