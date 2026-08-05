// ...existing code...
import { configureStore } from '@reduxjs/toolkit';
import dashboardReducer from './dashboardSlice';
import authReducer from './authSlice';
import adminReducer from './adminSlice';
import balancesReducer from './balanceSlice';
import profitsReducer from './profitSlice';
import referralReducer from './referralSlice';
import supportReducer from './supportSlice';
import transactionsReducer from './transactionSlice';
import walletsReducer from './walletSlice';
import withdrawRequestsReducer from './withdrawRequestsSlice';
import bannersReducer from './bannersSlice';
import penaltyReducer from './penaltySlice';
import milestonesReducer from './milestonesSlice';
import usdtStakingReducer from './usdtStakingSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        admin: adminReducer,
        dashboard: dashboardReducer,
        balances: balancesReducer,
        profits: profitsReducer,
        referral: referralReducer,
        support: supportReducer,
        transactions: transactionsReducer,
        wallets: walletsReducer,
        withdrawRequests: withdrawRequestsReducer,
        banners: bannersReducer,
        penalty: penaltyReducer,
        milestones: milestonesReducer,
        usdtStaking: usdtStakingReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;