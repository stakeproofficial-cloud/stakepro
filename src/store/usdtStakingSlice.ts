'use client';

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import {
    Staking,
    StakingBalance,
    WithdrawRequest,
    StakingTransaction,
    AdminDashboard,
    AdminWithdrawal,
} from '@/types/usdtStakingTypes';

// Thunks
export const createStaking = createAsyncThunk(
    'usdtStaking/create',
    async (payload: { amount: number; }, { rejectWithValue }) => {
        try {
            const r = await api.post('/usdt-staking', payload);
            console.log(r.data);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchStakings = createAsyncThunk(
    'usdtStaking/list',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/usdt-staking');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchBalance = createAsyncThunk(
    'usdtStaking/balance',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/balance');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const topupBalance = createAsyncThunk(
    'usdtStaking/topup',
    async (payload: { amount: number }, { rejectWithValue }) => {
        try {
            const r = await api.post('/usdt-staking/balance', payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const withdrawBalance = createAsyncThunk(
    'usdtStaking/withdraw',
    async (payload: { amount: number }, { rejectWithValue }) => {
        try {
            const r = await api.put('/usdt-staking/balance', payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const requestWithdrawal = createAsyncThunk(
    'usdtStaking/requestWithdraw',
    async (
        payload: { amount: number; wallet_address: string },
        { rejectWithValue }
    ) => {
        try {
            const r = await api.post('/usdt-staking/withdraw-request', payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchWithdrawRequests = createAsyncThunk(
    'usdtStaking/withdrawRequests',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/usdt-staking/withdraw-requests');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchTransactions = createAsyncThunk(
    'usdtStaking/transactions',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/usdt-staking/transactions');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchAdminDashboard = createAsyncThunk(
    'usdtStaking/adminDashboard',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/admin/usdt-staking/dashboard');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const fetchAdminWithdrawals = createAsyncThunk(
    'usdtStaking/adminWithdrawals',
    async (_, { rejectWithValue }) => {
        try {
            const r = await api.get('/admin/usdt-staking/withdraw-requests');
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const approveRejectWithdrawal = createAsyncThunk(
    'usdtStaking/approveRejectWithdrawal',
    async (
        payload: { withdraw_id: number; action: 'approve' | 'reject'; reason?: string },
        { rejectWithValue }
    ) => {
        try {
            const r = await api.post('/admin/usdt-staking/withdraw-requests', payload);
            return r.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

// Types
type Staking_Type = Staking[];
type StakingBalance_Type = StakingBalance | null;
type WithdrawRequest_Type = WithdrawRequest[];
type StakingTransaction_Type = StakingTransaction[];
type AdminDashboard_Type = AdminDashboard | null;
type AdminWithdrawal_Type = AdminWithdrawal[];

interface UsdtStakingState {
    stakings: any[];
    balance: StakingBalance_Type;
    withdrawRequests: WithdrawRequest_Type;
    transactions: StakingTransaction_Type;
    adminDashboard: AdminDashboard_Type;
    adminWithdrawals: AdminWithdrawal_Type;
    loading: boolean;
    error: string | null;
}

const initialState: UsdtStakingState = {
    stakings: [],
    balance: null,
    withdrawRequests: [],
    transactions: [],
    adminDashboard: null,
    adminWithdrawals: [],
    loading: false,
    error: null,
};

const usdtStakingSlice = createSlice({
    name: 'usdtStaking',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Create Staking
        builder
            .addCase(createStaking.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createStaking.fulfilled, (state, action) => {
                state.loading = false;
                state.stakings.push(action.payload.staking);
            })
            .addCase(createStaking.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.error || action.error?.error || 'Failed to create staking';
            });

        // Fetch Stakings
        builder
            .addCase(fetchStakings.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchStakings.fulfilled, (state, action) => {
                state.loading = false;
                state.stakings = action.payload.stakings;
            })
            .addCase(fetchStakings.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch stakings';
            });

        // Fetch Balance
        builder
            .addCase(fetchBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
            })
            .addCase(fetchBalance.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch balance';
            });

        // Topup Balance
        builder
            .addCase(topupBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(topupBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
            })
            .addCase(topupBalance.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to topup balance';
            });

        // Withdraw Balance
        builder
            .addCase(withdrawBalance.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(withdrawBalance.fulfilled, (state, action) => {
                state.loading = false;
                state.balance = action.payload;
            })
            .addCase(withdrawBalance.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to withdraw balance';
            });

        // Request Withdrawal
        builder
            .addCase(requestWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(requestWithdrawal.fulfilled, (state, action) => {
                state.loading = false;
                //  state.withdrawRequests.push(action.payload);
            })
            .addCase(requestWithdrawal.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to request withdrawal';
            });

        // Fetch Withdraw Requests
        builder
            .addCase(fetchWithdrawRequests.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchWithdrawRequests.fulfilled, (state, action) => {
                state.loading = false;
                const p = action.payload;
                state.withdrawRequests = Array.isArray(p)
                    ? p
                    : Array.isArray(p?.withdraw_requests)
                        ? p.withdraw_requests
                        : Array.isArray(p?.data)
                            ? p.data
                            : [];
            })
            .addCase(fetchWithdrawRequests.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch withdrawal requests';
            });

        // Fetch Transactions
        builder
            .addCase(fetchTransactions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchTransactions.fulfilled, (state, action) => {
                state.loading = false;
                const payload = action.payload;
                if (Array.isArray(payload)) {
                    state.transactions = payload;
                } else if (Array.isArray(payload?.data)) {
                    state.transactions = payload.data;
                } else if (Array.isArray(payload?.transactions)) {
                    state.transactions = payload.transactions;
                } else {
                    state.transactions = [];
                }
            })
            .addCase(fetchTransactions.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch transactions';
            });

        // Fetch Admin Dashboard
        builder
            .addCase(fetchAdminDashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminDashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.adminDashboard = action.payload.overview;
            })
            .addCase(fetchAdminDashboard.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch dashboard';
            });

        // Fetch Admin Withdrawals
        builder
            .addCase(fetchAdminWithdrawals.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAdminWithdrawals.fulfilled, (state, action) => {
                state.loading = false;
                const p = action.payload;
                state.adminWithdrawals = Array.isArray(p)
                    ? p
                    : Array.isArray(p?.withdraw_requests)
                        ? p.withdraw_requests
                        : Array.isArray(p?.data)
                            ? p.data
                            : [];
            })
            .addCase(fetchAdminWithdrawals.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to fetch withdrawals';
            });

        // Approve/Reject Withdrawal
        builder
            .addCase(approveRejectWithdrawal.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(approveRejectWithdrawal.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(approveRejectWithdrawal.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload?.message || action.error?.message || 'Failed to process withdrawal';
            });
    },
});

export const { clearError, } = usdtStakingSlice.actions;
export default usdtStakingSlice.reducer;
