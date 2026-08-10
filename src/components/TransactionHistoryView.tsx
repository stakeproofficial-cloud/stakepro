'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchTransactions, fetchWithdrawRequests } from '@/store/usdtStakingSlice';
import { fetchUserWithdraws } from '@/store/withdrawRequestsSlice';
import { useToast } from '@/components/ToastProvider';
import {
    FaArrowDown,
    FaArrowUp,
    FaCoins,
    FaExchangeAlt,
    FaSearch,
    FaFilter,
    FaCopy,
    FaCheck,
    FaTimes,
    FaClock,
    FaInfoCircle,
    FaCheckCircle,
    FaExclamationCircle,
    FaRegCalendarAlt,
    FaWallet
} from 'react-icons/fa';

export type HistoryTab = 'all' | 'deposits' | 'withdrawals';

interface TransactionHistoryViewProps {
    initialTab?: HistoryTab;
    title?: string;
    subtitle?: string;
}

export default function TransactionHistoryView({
    initialTab = 'all',
    title = 'Transaction & Wallet History',
    subtitle = 'Track all your USDT deposits, withdrawal requests, and reward distributions'
}: TransactionHistoryViewProps) {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();

    const { transactions, withdrawRequests, loading: stakingLoading } = useSelector(
        (s: RootState) => s.usdtStaking
    );
    const { userList: withdrawUserList, loading: withdrawLoading } = useSelector(
        (s: RootState) => s.withdrawRequests
    );

    const [activeTab, setActiveTab] = useState<HistoryTab>(initialTab);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [selectedItem, setSelectedItem] = useState<any | null>(null);
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    useEffect(() => {
        dispatch(fetchTransactions());
        dispatch(fetchWithdrawRequests());
        dispatch(fetchUserWithdraws());
    }, [dispatch]);

    // Safely extract arrays from state regardless of wrapper objects
    const rawWithdrawRequests = useMemo(() => {
        if (Array.isArray(withdrawRequests)) return withdrawRequests;
        if (withdrawRequests && Array.isArray((withdrawRequests as any).withdraw_requests)) return (withdrawRequests as any).withdraw_requests;
        if (withdrawRequests && Array.isArray((withdrawRequests as any).data)) return (withdrawRequests as any).data;
        return [];
    }, [withdrawRequests]);

    const rawWithdrawUserList = useMemo(() => {
        if (Array.isArray(withdrawUserList)) return withdrawUserList;
        if (withdrawUserList && Array.isArray((withdrawUserList as any).withdraw_requests)) return (withdrawUserList as any).withdraw_requests;
        if (withdrawUserList && Array.isArray((withdrawUserList as any).data)) return (withdrawUserList as any).data;
        return [];
    }, [withdrawUserList]);

    const rawTransactions = useMemo(() => {
        if (Array.isArray(transactions)) return transactions;
        if (transactions && Array.isArray((transactions as any).transactions)) return (transactions as any).transactions;
        if (transactions && Array.isArray((transactions as any).data)) return (transactions as any).data;
        return [];
    }, [transactions]);

    // Combine withdrawal requests from both sources if available
    const combinedWithdrawRequests = useMemo(() => {
        const map = new Map<number | string, any>();

        rawWithdrawRequests.forEach((req: any) => {
            if (req && req.id) {
                map.set(req.id, {
                    ...req,
                    wallet_address: req.wallet_address_full || req.wallet_address || req.address,
                    status: req.status || req.state || 'pending',
                    created_at: req.created_at || req.requested_at,
                });
            }
        });

        rawWithdrawUserList.forEach((req: any) => {
            if (req && req.id) {
                const existing = map.get(req.id) || {};
                map.set(req.id, {
                    ...existing,
                    ...req,
                    wallet_address: req.wallet_address_full || req.wallet_address || req.address || existing.wallet_address,
                    status: req.status || req.state || existing.status || 'pending',
                    created_at: req.created_at || req.requested_at || existing.created_at,
                });
            }
        });

        return Array.from(map.values()).sort((a, b) => {
            const timeA = new Date(a.created_at || a.requested_at || 0).getTime();
            const timeB = new Date(b.created_at || b.requested_at || 0).getTime();
            return timeB - timeA;
        });
    }, [rawWithdrawRequests, rawWithdrawUserList]);

    // Format deposit items
    const depositTransactions = useMemo(() => {
        return rawTransactions.filter((t: any) => {
            const type = (t.type || t.txn_type || '').toLowerCase();
            return type === 'staking_deposit' || type === 'topup' || type === 'deposit';
        });
    }, [rawTransactions]);

    // Stats calculations
    const stats = useMemo(() => {
        const totalDeposited = depositTransactions.reduce(
            (sum: number, item: { amount: any; }) => sum + Number(item.amount || 0),
            0
        );

        const totalWithdrawn = combinedWithdrawRequests
            .filter((r) => {
                const st = (r.status || r.state || '').toLowerCase();
                return st === 'completed' || st === 'approved';
            })
            .reduce((sum, item) => sum + Number(item.amount || 0), 0);

        const pendingWithdrawals = combinedWithdrawRequests.filter(
            (r) => {
                const st = (r.status || r.state || 'pending').toLowerCase();
                return st === 'pending';
            }
        );
        const pendingAmount = pendingWithdrawals.reduce(
            (sum, item) => sum + Number(item.amount || 0),
            0
        );

        return {
            totalDeposited,
            totalWithdrawn,
            pendingCount: pendingWithdrawals.length,
            pendingAmount,
            totalTxns: rawTransactions.length > 0 ? rawTransactions.length : combinedWithdrawRequests.length,
        };
    }, [depositTransactions, combinedWithdrawRequests, rawTransactions]);

    // Filtered data list
    const filteredItems = useMemo(() => {
        let list: any[] = [];

        if (activeTab === 'deposits') {
            list = depositTransactions.map((item: { created_at: any; }) => ({
                ...item,
                itemType: 'deposit',
                displayStatus: 'completed',
                displayDate: item.created_at,
            }));
        } else if (activeTab === 'withdrawals') {
            list = combinedWithdrawRequests.map((item) => ({
                ...item,
                itemType: 'withdraw_request',
                displayStatus: item.status || item.state || 'pending',
                displayDate: item.created_at || item.requested_at,
            }));
        } else {
            // All activity tab with smart deduplication & status merging
            const matchedWithdrawReqIds = new Set<number | string>();

            const txnsFormatted = rawTransactions.map((item: any) => {
                const itemType = (item.type || item.txn_type || 'transaction').toLowerCase();

                if (itemType === 'withdraw_request' || itemType === 'withdrawal') {
                    // Find corresponding withdrawal request in combinedWithdrawRequests
                    const matchedReq = combinedWithdrawRequests.find((req) => {
                        if (matchedWithdrawReqIds.has(req.id)) return false;
                        const matchAmount = Math.abs(Number(req.amount) - Number(item.amount)) < 0.01;
                        const matchDate = req.created_at && item.created_at
                            ? Math.abs(new Date(req.created_at).getTime() - new Date(item.created_at).getTime()) < 60000
                            : true;
                        return matchAmount && matchDate;
                    }) || combinedWithdrawRequests.find(req => !matchedWithdrawReqIds.has(req.id) && Math.abs(Number(req.amount) - Number(item.amount)) < 0.01);

                    if (matchedReq) {
                        matchedWithdrawReqIds.add(matchedReq.id);
                        return {
                            ...item,
                            ...matchedReq,
                            itemType: 'withdraw_request',
                            displayStatus: matchedReq.status || matchedReq.state || 'pending',
                            displayDate: item.created_at || matchedReq.created_at,
                            wallet_address: matchedReq.wallet_address_full || matchedReq.wallet_address || item.wallet_address,
                            wallet_address_full: matchedReq.wallet_address_full || matchedReq.wallet_address,
                        };
                    }

                    return {
                        ...item,
                        itemType: 'withdraw_request',
                        displayStatus: 'pending',
                        displayDate: item.created_at,
                    };
                }

                return {
                    ...item,
                    itemType: itemType,
                    displayStatus: 'completed',
                    displayDate: item.created_at,
                };
            });

            // Add any withdrawal requests that were not represented in transactions array
            const unmatchedWithdraws = combinedWithdrawRequests
                .filter(req => !matchedWithdrawReqIds.has(req.id))
                .map(req => ({
                    ...req,
                    itemType: 'withdraw_request',
                    displayStatus: req.status || req.state || 'pending',
                    displayDate: req.created_at || req.requested_at,
                }));

            list = [...txnsFormatted, ...unmatchedWithdraws];
        }

        // Sort by date descending
        list.sort((a, b) => {
            const timeA = new Date(a.displayDate || 0).getTime();
            const timeB = new Date(b.displayDate || 0).getTime();
            return timeB - timeA;
        });

        // Apply Status Filter
        if (statusFilter !== 'all') {
            list = list.filter((item) => {
                const st = (item.displayStatus || '').toLowerCase();
                return st === statusFilter;
            });
        }

        // Apply Search Query
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            list = list.filter((item) => {
                const amt = String(item.amount || '');
                const ref = (item.reference || item.txn_number || item.id || '').toString().toLowerCase();
                const addr = (item.wallet_address || item.wallet_address_full || '').toLowerCase();
                const type = (item.itemType || '').toLowerCase();
                const desc = (item.description || '').toLowerCase();
                return amt.includes(q) || ref.includes(q) || addr.includes(q) || type.includes(q) || desc.includes(q);
            });
        }

        return list;
    }, [activeTab, depositTransactions, combinedWithdrawRequests, rawTransactions, statusFilter, searchQuery]);

    const handleCopy = (text: string, key: string) => {
        if (!text) return;
        navigator.clipboard.writeText(text);
        setCopiedKey(key);
        showToast('Copied to clipboard!', 'success');
        setTimeout(() => setCopiedKey(null), 2000);
    };

    const getTypeBadge = (type: string) => {
        const t = (type || '').toLowerCase();
        switch (t) {
            case 'staking_deposit':
            case 'topup':
            case 'deposit':
                return {
                    label: 'Deposit',
                    bgColor: 'bg-[#22C55E]/15 border-[#22C55E]/30 text-[#22C55E]',
                    icon: FaArrowDown,
                    sign: '+',
                };
            case 'withdraw_request':
            case 'withdrawal':
            case 'withdraw':
                return {
                    label: 'Withdrawal',
                    bgColor: 'bg-[#E24B4A]/15 border-[#E24B4A]/30 text-[#E24B4A]',
                    icon: FaArrowUp,
                    sign: '-',
                };
            case 'commission':
            case 'referral_commission':
                return {
                    label: 'Commission',
                    bgColor: 'bg-[#06B6D4]/15 border-[#06B6D4]/30 text-[#22D3EE]',
                    icon: FaCoins,
                    sign: '+',
                };
            case 'reward':
            case 'profit':
                return {
                    label: 'Profit Earned',
                    bgColor: 'bg-[#EAB308]/15 border-[#EAB308]/30 text-[#EAB308]',
                    icon: FaCoins,
                    sign: '+',
                };
            case 'stake':
                return {
                    label: 'Staked',
                    bgColor: 'bg-[#7C5CF0]/15 border-[#7C5CF0]/30 text-[#A78BFA]',
                    icon: FaExchangeAlt,
                    sign: '-',
                };
            default:
                return {
                    label: type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Transaction',
                    bgColor: 'bg-[#221E2F] border-[#221E2F] text-[#8B85A3]',
                    icon: FaExchangeAlt,
                    sign: '',
                };
        }
    };

    const getStatusBadge = (status: string) => {
        const st = (status || 'completed').toLowerCase();
        switch (st) {
            case 'completed':
            case 'approved':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#22C55E]/30 bg-[#22C55E]/10 px-2.5 py-1 text-[11px] font-semibold text-[#22C55E]">
                        <FaCheckCircle className="h-3 w-3" />
                        <span>Completed</span>
                    </span>
                );
            case 'pending':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#EAB308]/30 bg-[#EAB308]/10 px-2.5 py-1 text-[11px] font-semibold text-[#EAB308]">
                        <FaClock className="h-3 w-3 animate-spin" style={{ animationDuration: '3s' }} />
                        <span>Pending Review</span>
                    </span>
                );
            case 'rejected':
            case 'failed':
            case 'cancelled':
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E24B4A]/30 bg-[#E24B4A]/10 px-2.5 py-1 text-[11px] font-semibold text-[#E24B4A]">
                        <FaExclamationCircle className="h-3 w-3" />
                        <span>Rejected</span>
                    </span>
                );
            default:
                return (
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-[#221E2F] bg-[#1A1626] px-2.5 py-1 text-[11px] font-semibold text-[#8B85A3]">
                        <span>{status}</span>
                    </span>
                );
        }
    };

    const isLoading = stakingLoading || withdrawLoading;

    return (
        <div className="space-y-6 pb-8">
            {/* Header Banner */}
            <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">{title}</h1>
                    <p className="text-xs text-[#8B85A3]">{subtitle}</p>
                </div>
            </div>

            {/* Overview Stats Cards */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[#22C55E]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#22C55E]/15">
                            <FaArrowDown className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-[#8B85A3]">Total Deposited</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.totalDeposited.toFixed(2)} USDT
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[#E24B4A]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E24B4A]/15">
                            <FaArrowUp className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-[#8B85A3]">Total Withdrawn</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.totalWithdrawn.toFixed(2)} USDT
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[#EAB308]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#EAB308]/15">
                            <FaClock className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-medium text-[#8B85A3]">Pending Payouts</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#EAB308]">
                        ${stats.pendingAmount.toFixed(2)} USDT
                    </p>
                    <p className="text-[11px] text-[#8B85A3] mt-0.5">{stats.pendingCount} request(s)</p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[#A78BFA]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CF0]/15">
                            <FaExchangeAlt className="h-4 w-4 text-[#A78BFA]" />
                        </div>
                        <span className="text-xs font-medium text-[#8B85A3]">Total Records</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">{stats.totalTxns}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex rounded-2xl border border-[#221E2F] bg-[#14111D] p-1.5 shadow-lg">
                <button
                    onClick={() => setActiveTab('all')}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${activeTab === 'all'
                        ? 'bg-[#7C5CF0] text-[#F4F2FB] shadow-md shadow-[#7C5CF0]/30'
                        : 'text-[#8B85A3] hover:text-[#F4F2FB]'
                        }`}
                >
                    All History ({stats.totalTxns})
                </button>
                <button
                    onClick={() => setActiveTab('deposits')}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${activeTab === 'deposits'
                        ? 'bg-[#7C5CF0] text-[#F4F2FB] shadow-md shadow-[#7C5CF0]/30'
                        : 'text-[#8B85A3] hover:text-[#F4F2FB]'
                        }`}
                >
                    Deposits ({depositTransactions.length})
                </button>
                <button
                    onClick={() => setActiveTab('withdrawals')}
                    className={`flex-1 rounded-xl py-2.5 text-xs font-semibold transition-all ${activeTab === 'withdrawals'
                        ? 'bg-[#7C5CF0] text-[#F4F2FB] shadow-md shadow-[#7C5CF0]/30'
                        : 'text-[#8B85A3] hover:text-[#F4F2FB]'
                        }`}
                >
                    Withdrawals ({combinedWithdrawRequests.length})
                </button>
            </div>

            {/* Search & Filter Controls */}
            <div className="flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6F6A83]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by amount, TXN hash, or wallet address..."
                        className="w-full rounded-2xl border border-[#221E2F] bg-[#14111D] py-3 pl-10 pr-4 text-xs text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                    />
                </div>

                <div className="relative flex items-center">
                    <FaFilter className="absolute left-3.5 h-3 w-3 text-[#6F6A83] pointer-events-none" />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full sm:w-auto appearance-none rounded-2xl border border-[#221E2F] bg-[#14111D] py-3 pl-9 pr-8 text-xs font-semibold text-[#F4F2FB] focus:border-[#7C5CF0] focus:outline-none cursor-pointer"
                    >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed / Approved</option>
                        <option value="pending">Pending</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Transactions & Withdrawals List */}
            {isLoading ? (
                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-12 text-center text-xs text-[#8B85A3] space-y-3">
                    <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#7C5CF0] border-t-transparent" />
                    <p>Loading history records...</p>
                </div>
            ) : filteredItems.length === 0 ? (
                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-12 text-center space-y-3">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1626] text-[#8B85A3]">
                        <FaExchangeAlt className="h-5 w-5" />
                    </div>
                    <h3 className="text-sm font-semibold text-[#F4F2FB]">No records found</h3>
                    <p className="text-xs text-[#8B85A3] max-w-sm mx-auto">
                        {searchQuery || statusFilter !== 'all'
                            ? 'No transactions match your search or filter criteria.'
                            : activeTab === 'deposits'
                                ? 'You have not made any deposits yet.'
                                : activeTab === 'withdrawals'
                                    ? 'You have no withdrawal requests submitted.'
                                    : 'No transaction history available yet.'}
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filteredItems.map((item, idx) => {
                        const typeInfo = getTypeBadge(item.itemType || 'deposit');
                        const Icon = typeInfo.icon;
                        const statusBadge = getStatusBadge(item.displayStatus);
                        const rawAmount = Number(item.amount || 0);

                        // If withdrawal request: fee is 8%
                        const isWithdrawal = item.itemType === 'withdrawal';
                        const feeAmount = isWithdrawal ? (rawAmount * 0.08) : 0;
                        const netAmount = isWithdrawal ? (rawAmount - feeAmount) : rawAmount;

                        const dateStr = item.displayDate
                            ? new Date(item.displayDate).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })
                            : 'N/A';

                        return (
                            <div
                                key={item.id ? `${item.itemType}-${item.id}` : idx}
                                onClick={() => setSelectedItem(item)}
                                className="group relative rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 transition-all hover:border-[#7C5CF0]/50 hover:bg-[#1A1626] cursor-pointer shadow-md"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <div className="flex items-center gap-3.5 min-w-0">
                                        <div
                                            className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border ${typeInfo.bgColor}`}
                                        >
                                            <Icon className="h-5 w-5" />
                                        </div>

                                        <div className="min-w-0">
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm font-bold text-[#F4F2FB] truncate">
                                                    {typeInfo.label}
                                                </span>
                                                <span className="text-[11px] font-mono text-[#8B85A3]">
                                                    #{item.id || item.txn_number || item.reference || idx + 1}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 mt-0.5 text-xs text-[#8B85A3]">
                                                <span className="flex items-center gap-1">
                                                    <FaRegCalendarAlt className="h-3 w-3 text-[#6F6A83]" />
                                                    {dateStr}
                                                </span>
                                                {item.wallet_address && (
                                                    <span className="hidden sm:inline font-mono text-[11px] text-[#A78BFA] truncate max-w-[150px]">
                                                        • {item.wallet_address}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="text-right flex-shrink-0 space-y-1">
                                        <div className="text-base font-bold tracking-tight">
                                            <span
                                                className={
                                                    typeInfo.sign === '+'
                                                        ? 'text-[#22C55E]'
                                                        : typeInfo.sign === '-'
                                                            ? 'text-[#F4F2FB]'
                                                            : 'text-[#F4F2FB]'
                                                }
                                            >
                                                {typeInfo.sign}${rawAmount.toFixed(2)} USDT
                                            </span>
                                        </div>
                                        <div>{statusBadge}</div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Detail View Modal */}
            {selectedItem && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#050409]/75 backdrop-blur-sm p-4"
                    onClick={() => setSelectedItem(null)}
                >
                    <div
                        className="relative w-full max-w-md rounded-[24px] border border-[#221E2F] bg-[#14111D] p-6 shadow-2xl space-y-5 animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between border-b border-[#221E2F] pb-4">
                            <div>
                                <h3 className="text-base font-bold text-[#F4F2FB]">Transaction Details</h3>
                                <p className="text-xs text-[#8B85A3]">ID #{selectedItem.id || selectedItem.reference}</p>
                            </div>
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2 text-[#8B85A3] transition hover:text-[#F4F2FB]"
                            >
                                <FaTimes className="h-4 w-4" />
                            </button>
                        </div>

                        {/* Amount Banner */}
                        <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 text-center space-y-1">
                            <p className="text-xs text-[#8B85A3]">Amount</p>
                            <p className="text-2xl font-bold text-[#F4F2FB]">
                                ${Number(selectedItem.amount || 0).toFixed(2)} USDT
                            </p>
                            <div className="pt-1 flex justify-center">
                                {getStatusBadge(selectedItem.displayStatus)}
                            </div>
                        </div>

                        {/* Withdrawal Breakdown if applicable */}
                        {selectedItem.itemType === 'withdrawal' && (
                            <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 space-y-2 text-xs">
                                <div className="flex justify-between">
                                    <span className="text-[#8B85A3]">Requested Amount</span>
                                    <span className="font-semibold text-[#F4F2FB]">
                                        ${Number(selectedItem.amount || 0).toFixed(2)} USDT
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[#8B85A3]">Fee (8%)</span>
                                    <span className="font-semibold text-[#E24B4A]">
                                        -${(Number(selectedItem.amount || 0) * 0.08).toFixed(2)} USDT
                                    </span>
                                </div>
                                <div className="border-t border-[#221E2F] pt-2 flex justify-between font-bold">
                                    <span className="text-[#A78BFA]">Net Payout</span>
                                    <span className="text-[#22C55E]">
                                        ${(Number(selectedItem.amount || 0) * 0.92).toFixed(2)} USDT
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Detail Info Items */}
                        <div className="space-y-3 text-xs">
                            <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                <span className="text-[#8B85A3]">Type</span>
                                <span className="font-semibold text-[#F4F2FB] capitalize">
                                    {selectedItem.itemType}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                <span className="text-[#8B85A3]">Network</span>
                                <span className="font-semibold text-[#A78BFA]">
                                    BSC (BEP20)
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                <span className="text-[#8B85A3]">Timestamp</span>
                                <span className="font-mono text-[#F4F2FB]">
                                    {selectedItem.displayDate
                                        ? new Date(selectedItem.displayDate).toLocaleString()
                                        : 'N/A'}
                                </span>
                            </div>

                            {(selectedItem.wallet_address || selectedItem.wallet_address_full) && (
                                <div className="space-y-1 pt-1">
                                    <span className="text-[#8B85A3]">Wallet Address</span>
                                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                                        <span className="font-mono text-[11px] text-[#A78BFA] break-all">
                                            {selectedItem.wallet_address_full || selectedItem.wallet_address}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    selectedItem.wallet_address_full || selectedItem.wallet_address,
                                                    'modal_addr'
                                                )
                                            }
                                            className="flex-shrink-0 text-[#8B85A3] hover:text-[#F4F2FB] p-1"
                                        >
                                            {copiedKey === 'modal_addr' ? (
                                                <FaCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                                            ) : (
                                                <FaCopy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {(selectedItem.reference || selectedItem.txn_number) && (
                                <div className="space-y-1 pt-1">
                                    <span className="text-[#8B85A3]">Transaction Reference / Hash</span>
                                    <div className="flex items-center justify-between gap-2 rounded-xl border border-[#221E2F] bg-[#1A1626] p-2.5">
                                        <span className="font-mono text-[11px] text-[#F4F2FB] break-all">
                                            {selectedItem.reference || selectedItem.txn_number}
                                        </span>
                                        <button
                                            onClick={() =>
                                                handleCopy(
                                                    selectedItem.reference || selectedItem.txn_number,
                                                    'modal_ref'
                                                )
                                            }
                                            className="flex-shrink-0 text-[#8B85A3] hover:text-[#F4F2FB] p-1"
                                        >
                                            {copiedKey === 'modal_ref' ? (
                                                <FaCheck className="h-3.5 w-3.5 text-[#22C55E]" />
                                            ) : (
                                                <FaCopy className="h-3.5 w-3.5" />
                                            )}
                                        </button>
                                    </div>
                                </div>
                            )}

                            {selectedItem.reason && (
                                <div className="rounded-xl border border-[#E24B4A]/30 bg-[#E24B4A]/10 p-3 space-y-1">
                                    <span className="font-semibold text-[#E24B4A]">Rejection Reason</span>
                                    <p className="text-[#E24B4A]/90">{selectedItem.reason}</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={() => setSelectedItem(null)}
                            className="w-full rounded-2xl bg-[#7C5CF0] py-3.5 text-xs font-semibold text-[#F4F2FB] transition hover:bg-[#6A49E0]"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
