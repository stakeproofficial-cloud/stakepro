import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

export interface Banner {
    id: number
    title?: string
    image_path: string
    link_url?: string
    active?: boolean
}

interface BannersState {
    items: Banner[]
    loading: boolean
    error: string | null
}

const initialState: BannersState = {
    items: [],
    loading: false,
    error: null,
}

const BASE_URL = 'https://api.moneymartx.com/';

const normalizeBanner = (b: Banner): Banner => {
    const url = b.image_path || '';
    const full = url.startsWith('http') ? url : BASE_URL + url.replace(/^\/+/, '');
    return { ...b, image_path: full };
};

const normalizeList = (list: Banner[]): Banner[] => list.map(normalizeBanner);

export const fetchBanners = createAsyncThunk<Banner[], void, { rejectValue: string }>(
    'banners/fetchBanners',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('banners')
            const data = res.data.items ?? []
            return normalizeList(data)
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch banners'
            return rejectWithValue(message)
        }
    }
)

export const createBanner = createAsyncThunk<Banner, FormData, { rejectValue: string }>(
    'banners/createBanner',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('admin/banners/store', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const data = res.data?.data ?? res.data
            return normalizeBanner(data)
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to create banner'
            return rejectWithValue(message)
        }
    }
)

export const updateBanner = createAsyncThunk<Banner, FormData, { rejectValue: string }>(
    'banners/updateBanner',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('admin/banners/update', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const data = res.data?.data ?? res.data
            return normalizeBanner(data)
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to update banner'
            return rejectWithValue(message)
        }
    }
)

export const deleteBanner = createAsyncThunk<number, { id: number }, { rejectValue: string }>(
    'banners/deleteBanner',
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await api.post('admin/banners/delete', { id })
            // Assume API returns success; we return id to remove from state
            if (res.status >= 200 && res.status < 300) return id
            throw new Error('Delete failed')
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to delete banner'
            return rejectWithValue(message)
        }
    }
)

const bannersSlice = createSlice({
    name: 'banners',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchBanners.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchBanners.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload || []
            })
            .addCase(fetchBanners.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Error'
            })

            .addCase(createBanner.fulfilled, (state, action) => {
                const item = action.payload
                if (item) state.items.push(item)
            })
            .addCase(updateBanner.fulfilled, (state, action) => {
                const updated = action.payload
                if (!updated) return
                const idx = state.items.findIndex((b) => b.id === updated.id)
                if (idx !== -1) state.items[idx] = updated
            })
            .addCase(deleteBanner.fulfilled, (state, action) => {
                const id = action.payload
                state.items = state.items.filter((b) => b.id !== id)
            })
    },
})

export default bannersSlice.reducer
