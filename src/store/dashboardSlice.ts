import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type DashboardState = {
    investProfit: number;
    teamCommissions: number;
    progressPercent: number;
};

const initialState: DashboardState = {
    investProfit: 0,
    teamCommissions: 0,
    progressPercent: 50,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {
        addInvestProfit(state, action: PayloadAction<number>) {
            state.investProfit += action.payload;
        },
        addTeamCommissions(state, action: PayloadAction<number>) {
            state.teamCommissions += action.payload;
        },
        setProgress(state, action: PayloadAction<number>) {
            state.progressPercent = Math.max(0, Math.min(100, action.payload));
        },
    },
});

export const { addInvestProfit, addTeamCommissions, setProgress } = dashboardSlice.actions;
export default dashboardSlice.reducer;