import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/api'

export interface Milestone {
    id: number
    name: string
    image?: string | null
    self_investment_min: number
    direct_investment_min: number
    reward: number
    is_active: number
    sort_order: number
    created_by?: string | null
    created_at?: string
    updated_at?: string
    achievement_type?: string
    image_path?: string
}

interface MilestonesState {
    items: Milestone[]
    loading: boolean
    error: string | null
}

const initialState: MilestonesState = {
    items: [],
    loading: false,
    error: null,
}

export const fetchMilestones = createAsyncThunk<Milestone[], void, { rejectValue: string }>(
    'milestones/fetchMilestones',
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get('referral/milestones')
            const maybe = res.data?.milestones ?? res.data?.data ?? res.data
            return Array.isArray(maybe) ? maybe : []
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to fetch milestones'
            return rejectWithValue(message)
        }
    }
)

export const createMilestone = createAsyncThunk<Milestone, FormData, { rejectValue: string }>(
    'milestones/createMilestone',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post('admin/achievement_milestones', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const data = res.data?.data ?? res.data?.milestones ?? res.data
            if (Array.isArray(data)) return data[0]
            return data
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to create milestone'
            return rejectWithValue(message)
        }
    }
)

export const updateMilestone = createAsyncThunk<Milestone, FormData, { rejectValue: string }>(
    'milestones/updateMilestone',
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.put('admin/achievement_milestones', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            })
            const data = res.data?.data ?? res.data?.milestones ?? res.data
            if (Array.isArray(data)) return data[0]
            return data
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to update milestone'
            return rejectWithValue(message)
        }
    }
)

export const deleteMilestone = createAsyncThunk<number, { id: number }, { rejectValue: string }>(
    'milestones/deleteMilestone',
    async ({ id }, { rejectWithValue }) => {
        try {
            const res = await api.delete('admin/achievement_milestones', { data: { id } })
            if (res.status >= 200 && res.status < 300) {
                return id
            }
            throw new Error('Delete failed')
        } catch (err: any) {
            const message = err?.response?.data?.message || err?.message || 'Failed to delete milestone'
            return rejectWithValue(message)
        }
    }
)

const milestonesSlice = createSlice({
    name: 'milestones',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchMilestones.pending, (state) => {
                state.loading = true
                state.error = null
            })
            .addCase(fetchMilestones.fulfilled, (state, action) => {
                state.loading = false
                state.items = action.payload || []
            })
            .addCase(fetchMilestones.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload || 'Error fetching milestones'
            })

            .addCase(createMilestone.fulfilled, (state, action) => {
                if (action.payload) state.items.push(action.payload)
            })
            .addCase(updateMilestone.fulfilled, (state, action) => {
                const updated = action.payload
                if (!updated) return
                const idx = state.items.findIndex((m) => m.id === updated.id)
                if (idx !== -1) state.items[idx] = updated
            })
            .addCase(deleteMilestone.fulfilled, (state, action) => {
                state.items = state.items.filter((m) => m.id !== action.payload)
            })
    },
})

export default milestonesSlice.reducer
