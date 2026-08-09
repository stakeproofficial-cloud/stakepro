export interface Staking {
    user_id: any | null;
    id: any | string;
    amount: any;
    profit_percentage: any;
    max_return: any;
    total_earned: any;
    profit_earned: any;
    completion_percentage: any;
    state: 'active' | 'completed' | 'cancelled';
    created_at: string;
    completed_at: string | null;
}

export interface StakingBalance {
    balance: any
}

export interface WithdrawRequest {
    id: any;
    user_id: any;
    amount: any;
    wallet_address?: string;
    status: 'pending' | 'approved' | 'rejected' | 'completed';
    requested_at: string;
    processed_at?: string;
    reason?: string;
}

export interface StakingTransaction {
    txn_type: string;
    id: any;
    user_id: any;
    type: 'deposit' | 'withdrawal' | 'reward' | 'topup' | 'withdraw_refund'
    | 'profit_earned' | 'comission' | 'stake';
    amount: any;
    balance_before: any;
    balance_after: any;
    reference?: string;
    created_at: string;
}

export interface AdminDashboard {
    total_staking_balance: any;
    total_users_with_staking: any;
    pending_withdrawals: any;
    total_rewards_paid: any;
    average_apy: any;
    active_stakings: any;
}

export interface AdminWithdrawal {
    id: any;
    user_id: any;
    email?: string;
    amount: any;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    wallet_address_full: string;
}
