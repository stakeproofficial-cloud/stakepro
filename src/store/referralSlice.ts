import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "@/lib/api";

type ReferralConfig = { id: number; level: number; reward: number };

type TeamMember = {
    id: string;
    name: string;
    email: string;
    referral_code: string;
    joined_at: string;
    balance: number;
    level: number;
    referral_count: number;
    total_investment: number;
    total_rewards: number;
    children: TeamMember[];
};

type TeamStats = {
    total_users: number;
    total_investment: number;
    total_rewards: number;
    by_level: Record<string, { users: number; total_investment: number; total_rewards: number }>;
};

type ReferralState = {
    config: ReferralConfig[];
    teamData: { referral_code: string; tree: TeamMember[]; stats: TeamStats } | null;
    refInv: any | null;
    ach: any | null;
    milestoneProgress: any[] | null;
    loading: boolean;
    error?: string | null;
};

const initialState: ReferralState = {
    config: [],
    teamData: null
    , refInv: null,
    ach: null, milestoneProgress: null, loading: false, error: null
};

export const fetchReferralConfig = createAsyncThunk("referral/config", async () => {
    const r = await api.get("/referral/config");
    return r.data;
});
export const fetchTeam = createAsyncThunk("team/fetchteam", async (_, { rejectWithValue }) => {
    try {
        const r = await api.get("/referral/tree");
        console.log(r.data);
        return r.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});
export const fetchTeamInv = createAsyncThunk("team/fetchteaminv", async (_, { rejectWithValue }) => {
    try {
        const r = await api.get("/referral/investments");
        console.log(r.data);
        return r.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});
export const fetchTeamach = createAsyncThunk("team/fetchteamach", async (_, { rejectWithValue }) => {
    try {
        const r = await api.get("/referral/achievements");
        console.log(r.data);
        return r.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});

export const claimAchievement = createAsyncThunk("team/claimAchievement", async (achievement_id: number, { rejectWithValue }) => {
    try {
        const r = await api.post("/referral/claim", { achievement_id });
        return r.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});

export const fetchMilestoneProgress = createAsyncThunk("referral/fetchMilestoneProgress", async (_, { rejectWithValue }) => {
    try {
        const r = await api.get("/referral/milestone_progress");
        return r.data.progress;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});
const referralSlice = createSlice({
    name: "referral",
    initialState,
    reducers: {},
    extraReducers: (b) => {
        b.addCase(fetchReferralConfig.fulfilled, (s, a) => { s.config = a.payload; })
            .addCase(fetchTeam.pending, (s) => { s.loading = true; s.error = null; })
            .addCase(fetchTeam.fulfilled, (s, a) => { s.loading = false; s.teamData = a.payload; })
            .addCase(fetchTeam.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })
            .addCase(fetchTeamInv.pending, (s: any) => { s.loading = true; s.error = null; })
            .addCase(fetchTeamInv.fulfilled, (s: any, a: any) => { s.loading = false; s.refInv = a.payload; })
            .addCase(fetchTeamInv.rejected, (s: any, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })
            .addCase(fetchTeamach.pending, (s: any) => { s.loading = true; s.error = null; })
            .addCase(fetchTeamach.fulfilled, (s: any, a: any) => { s.loading = false; s.ach = a.payload; })
            .addCase(fetchTeamach.rejected, (s: any, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })
            .addCase(claimAchievement.pending, (s: any) => { s.loading = true; s.error = null; })
            .addCase(claimAchievement.fulfilled, (s: any, a: any) => {
                s.loading = false;
                // If the response returns the updated achievement, try to update local state
                try {
                    const updated = a.payload;
                    if (s.ach && s.ach.achievements) {
                        const match = s.ach.achievements.find((x: any) => x.id === updated?.id || x.id === updated?.achievement_id);
                        if (match) {
                            match.status = 'claimed';
                        }
                    }
                } catch (e) {
                    // no-op
                }
            })
            .addCase(claimAchievement.rejected, (s: any, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })
            .addCase(fetchMilestoneProgress.pending, (s: any) => { s.loading = true; s.error = null; })
            .addCase(fetchMilestoneProgress.fulfilled, (s: any, a: any) => { s.loading = false; s.milestoneProgress = a.payload; })
            .addCase(fetchMilestoneProgress.rejected, (s: any, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; });

    },
});

export default referralSlice.reducer;