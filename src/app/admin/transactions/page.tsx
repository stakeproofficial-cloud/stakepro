"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchTransactions, DetailedTransaction } from "@/store/transactionSlice";
import { fetchUsers } from "@/store/adminSlice";
import {
    FaSearch,
    FaFilter,
    FaSync,
    FaArrowDown,
    FaArrowUp,
    FaCoins,
    FaExchangeAlt,
    FaUsers,
    FaWallet,
    FaUndo,
    FaCopy,
    FaCheck,
    FaTimes,
    FaInfoCircle,
    FaChevronLeft,
    FaChevronRight,
    FaCalendarAlt,
    FaFileAlt
} from "react-icons/fa";

export default function AdminTransactionsPage() {
    const dispatch = useAppDispatch();
    const { items: rawTransactions, pagination, loading, error } = useAppSelector((s) => s.transactions);
    const { users } = useAppSelector((s) => s.admin);

    const [typeFilter, setTypeFilter] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [selectedTxn, setSelectedTxn] = useState<DetailedTransaction | null>(null);
    const [copiedId, setCopiedId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [itemsPerPage] = useState<number>(50);

    useEffect(() => {
        dispatch(fetchTransactions({ page: currentPage, limit: itemsPerPage }));
        dispatch(fetchUsers() as any);
    }, [dispatch, currentPage, itemsPerPage]);

    const handleRefresh = () => {
        dispatch(fetchTransactions({ page: currentPage, limit: itemsPerPage }));
    };

    const handleCopy = (text: string, id: number) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const getUserEmail = (txn: DetailedTransaction) => {
        if (txn.email) return txn.email;
        if (!txn.user_id) return null;
        const user = users.find((u) => u.id === txn.user_id);
        return user ? user.email : `User #${txn.user_id}`;
    };

    const stats = useMemo(() => {
        let profitEarnedTotal = 0;
        let stakedTotal = 0;
        let commissionTotal = 0;
        let depositTotal = 0;
        let withdrawReqTotal = 0;

        rawTransactions.forEach((t) => {
            const amt = Number(t.amount || 0);
            const type = (t.type || t.txn_type || "").toLowerCase();
            if (type === "profit_earned") profitEarnedTotal += amt;
            else if (type === "stake") stakedTotal += amt;
            else if (type === "commission") commissionTotal += amt;
            else if (type === "deposit" || type === "staking_deposit") depositTotal += amt;
            else if (type === "withdraw_request") withdrawReqTotal += amt;
        });

        return {
            totalCount: pagination?.total || rawTransactions.length,
            profitEarnedTotal,
            stakedTotal,
            commissionTotal,
            depositTotal,
            withdrawReqTotal,
        };
    }, [rawTransactions, pagination]);

    const filteredTransactions = useMemo(() => {
        let list = [...rawTransactions];

        if (typeFilter !== "all") {
            list = list.filter((t) => {
                const type = (t.type || t.txn_type || "").toLowerCase();
                return type === typeFilter;
            });
        }

        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase().trim();
            list = list.filter((t) => {
                const idStr = String(t.id);
                const desc = (t.description || "").toLowerCase();
                const amt = String(t.amount);
                const type = (t.type || t.txn_type || "").toLowerCase();
                const dateStr = (t.created_at || "").toLowerCase();
                const emailStr = (t.email || getUserEmail(t) || "").toLowerCase();
                return idStr.includes(q) || desc.includes(q) || amt.includes(q) || type.includes(q) || dateStr.includes(q) || emailStr.includes(q);
            });
        }

        list.sort((a, b) => {
            if (sortBy === "oldest") {
                return new Date(a.created_at || 0).getTime() - new Date(b.created_at || 0).getTime();
            } else if (sortBy === "amount_high") {
                return Number(b.amount) - Number(a.amount);
            } else if (sortBy === "amount_low") {
                return Number(a.amount) - Number(b.amount);
            } else {
                return new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime();
            }
        });

        return list;
    }, [rawTransactions, typeFilter, searchQuery, sortBy, users]);

    const getTypeInfo = (typeStr: string) => {
        const t = (typeStr || "").toLowerCase();
        switch (t) {
            case "profit_earned":
                return {
                    label: "Profit Earned",
                    bgColor: "bg-emerald-500/15 border-emerald-500/30 text-emerald-400",
                    badgeColor: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
                    icon: FaCoins,
                    sign: "+",
                };
            case "stake":
                return {
                    label: "Staking Created",
                    bgColor: "bg-purple-500/15 border-purple-500/30 text-purple-400",
                    badgeColor: "bg-purple-500/20 text-purple-300 border-purple-500/40",
                    icon: FaExchangeAlt,
                    sign: "-",
                };
            case "commission":
                return {
                    label: "Referral Commission",
                    bgColor: "bg-cyan-500/15 border-cyan-500/30 text-cyan-400",
                    badgeColor: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
                    icon: FaUsers,
                    sign: "+",
                };
            case "deposit":
                return {
                    label: "Admin Deposit",
                    bgColor: "bg-blue-500/15 border-blue-500/30 text-blue-400",
                    badgeColor: "bg-blue-500/20 text-blue-300 border-blue-500/40",
                    icon: FaArrowDown,
                    sign: "+",
                };
            case "staking_deposit":
                return {
                    label: "Staking Topup",
                    bgColor: "bg-indigo-500/15 border-indigo-500/30 text-indigo-400",
                    badgeColor: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
                    icon: FaWallet,
                    sign: "+",
                };
            case "withdraw_request":
                return {
                    label: "Withdraw Request",
                    bgColor: "bg-amber-500/15 border-amber-500/30 text-amber-400",
                    badgeColor: "bg-amber-500/20 text-amber-300 border-amber-500/40",
                    icon: FaArrowUp,
                    sign: "-",
                };
            case "withdraw_refund":
                return {
                    label: "Withdraw Refunded",
                    bgColor: "bg-rose-500/15 border-rose-500/30 text-rose-400",
                    badgeColor: "bg-rose-500/20 text-rose-300 border-rose-500/40",
                    icon: FaUndo,
                    sign: "+",
                };
            default:
                return {
                    label: typeStr ? typeStr.replace(/_/g, " ").toUpperCase() : "Transaction",
                    bgColor: "bg-gray-500/15 border-gray-500/30 text-gray-400",
                    badgeColor: "bg-gray-500/20 text-gray-300 border-gray-500/40",
                    icon: FaFileAlt,
                    sign: "",
                };
        }
    };

    return (
        <div className="space-y-6 pb-12">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#14111D] p-6 rounded-[24px] border border-[#221E2F] shadow-xl">
                <div>
                    <div className="flex items-center gap-3">
                        <h1 className="text-2xl font-bold text-[#F4F2FB] tracking-tight">System Transactions Log</h1>
                        <span className="px-3 py-1 text-xs font-mono font-semibold rounded-full bg-[#7C5CF0]/20 text-[#A78BFA] border border-[#7C5CF0]/40">
                            /detailed endpoint
                        </span>
                    </div>
                    <p className="text-xs text-[#8B85A3] mt-1">
                        Comprehensive ledger of user profits, stakes, commissions, deposits, and withdrawal activities.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleRefresh}
                        className="inline-flex items-center gap-2 bg-[#1A1626] hover:bg-[#221E2F] text-[#F4F2FB] border border-[#221E2F] px-4 py-2.5 rounded-xl text-xs font-semibold transition active:scale-95 shadow-md"
                    >
                        <FaSync className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                        <span>Refresh API Data</span>
                    </button>
                </div>
            </div>

            {error && (
                <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <FaInfoCircle className="h-4 w-4 text-rose-400" />
                        <span>{error} (Displaying cached/offline dataset)</span>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-[#A78BFA]">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#7C5CF0]/15">
                            <FaFileAlt className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Total Records</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">{stats.totalCount}</p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-emerald-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-500/15">
                            <FaCoins className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Profits Earned</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.profitEarnedTotal.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-purple-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-500/15">
                            <FaExchangeAlt className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Staked Volume</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.stakedTotal.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-cyan-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-500/15">
                            <FaUsers className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Commissions</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.commissionTotal.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-blue-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-blue-500/15">
                            <FaArrowDown className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Admin Deposits</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.depositTotal.toFixed(2)}
                    </p>
                </div>

                <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-4 shadow-xl">
                    <div className="flex items-center gap-2 text-amber-400">
                        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/15">
                            <FaArrowUp className="h-4 w-4" />
                        </div>
                        <span className="text-[11px] font-medium text-[#8B85A3]">Withdraw Requests</span>
                    </div>
                    <p className="mt-3 text-lg font-bold text-[#F4F2FB]">
                        ${stats.withdrawReqTotal.toFixed(2)}
                    </p>
                </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-[#221E2F] bg-[#14111D] p-2 shadow-lg">
                {[
                    { id: "all", label: "All Types", count: rawTransactions.length },
                    { id: "profit_earned", label: "Profit Earned", count: rawTransactions.filter(t => (t.type || t.txn_type) === "profit_earned").length },
                    { id: "stake", label: "Stakings", count: rawTransactions.filter(t => (t.type || t.txn_type) === "stake").length },
                    { id: "commission", label: "Commissions", count: rawTransactions.filter(t => (t.type || t.txn_type) === "commission").length },
                    { id: "withdraw_request", label: "Withdraw Requests", count: rawTransactions.filter(t => (t.type || t.txn_type) === "withdraw_request").length },
                    { id: "withdraw_refund", label: "Withdraw Refunds", count: rawTransactions.filter(t => (t.type || t.txn_type) === "withdraw_refund").length },
                    { id: "deposit", label: "Admin Deposits", count: rawTransactions.filter(t => (t.type || t.txn_type) === "deposit").length },
                    { id: "staking_deposit", label: "Staking Topups", count: rawTransactions.filter(t => (t.type || t.txn_type) === "staking_deposit").length },
                ].map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setTypeFilter(item.id)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                            typeFilter === item.id
                                ? "bg-[#7C5CF0] text-[#F4F2FB] shadow-md shadow-[#7C5CF0]/30"
                                : "text-[#8B85A3] hover:text-[#F4F2FB] hover:bg-[#1A1626]"
                        }`}
                    >
                        {item.label} ({item.count})
                    </button>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#6F6A83]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by Transaction ID, email, description, amount, or date..."
                        className="w-full rounded-2xl border border-[#221E2F] bg-[#14111D] py-3 pl-10 pr-4 text-xs text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none shadow-md"
                    />
                </div>

                <div className="relative flex items-center">
                    <FaFilter className="absolute left-3.5 h-3 w-3 text-[#6F6A83] pointer-events-none" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full sm:w-auto appearance-none rounded-2xl border border-[#221E2F] bg-[#14111D] py-3 pl-9 pr-8 text-xs font-semibold text-[#F4F2FB] focus:border-[#7C5CF0] focus:outline-none cursor-pointer shadow-md"
                    >
                        <option value="newest">Sort: Newest First</option>
                        <option value="oldest">Sort: Oldest First</option>
                        <option value="amount_high">Sort: Highest Amount</option>
                        <option value="amount_low">Sort: Lowest Amount</option>
                    </select>
                </div>
            </div>

            <div className="rounded-[24px] border border-[#221E2F] bg-[#14111D] overflow-hidden shadow-xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b border-[#221E2F] bg-[#1A1626]/80 text-[11px] font-semibold uppercase tracking-wider text-[#8B85A3]">
                                <th className="py-4 px-6">Txn ID</th>
                                <th className="py-4 px-6">User / Email</th>
                                <th className="py-4 px-6">Type</th>
                                <th className="py-4 px-6">Description</th>
                                <th className="py-4 px-6">Balance Movement</th>
                                <th className="py-4 px-6 text-right">Amount</th>
                                <th className="py-4 px-6">Timestamp</th>
                                <th className="py-4 px-6 text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#221E2F]/60 text-xs">
                            {loading && filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[#8B85A3]">
                                        <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-[#7C5CF0] border-t-transparent mb-2" />
                                        <p>Fetching transactions from endpoint...</p>
                                    </td>
                                </tr>
                            ) : filteredTransactions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="py-12 text-center text-[#8B85A3]">
                                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#1A1626] text-[#8B85A3] mb-3">
                                            <FaFileAlt className="h-5 w-5" />
                                        </div>
                                        <p className="text-sm font-semibold text-[#F4F2FB]">No matching transactions found</p>
                                        <p className="text-xs text-[#8B85A3] mt-1">Try adjusting your search criteria or type filter.</p>
                                    </td>
                                </tr>
                            ) : (
                                filteredTransactions.map((txn) => {
                                    const typeInfo = getTypeInfo(txn.type || txn.txn_type || "");
                                    const TypeIcon = typeInfo.icon;
                                    const userEmail = getUserEmail(txn);
                                    const hasBalanceInfo = txn.balance_before !== null && txn.balance_before !== undefined;

                                    return (
                                        <tr
                                            key={txn.id}
                                            className="hover:bg-[#1A1626]/50 transition-colors group cursor-pointer"
                                            onClick={() => setSelectedTxn(txn)}
                                        >
                                            <td className="py-4 px-6 font-mono font-bold text-[#F4F2FB]">
                                                <div className="flex items-center gap-2">
                                                    <span>#{txn.id}</span>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleCopy(String(txn.id), txn.id);
                                                        }}
                                                        className="text-[#6F6A83] hover:text-[#A78BFA] p-1 transition"
                                                        title="Copy ID"
                                                    >
                                                        {copiedId === txn.id ? (
                                                            <FaCheck className="h-3 w-3 text-emerald-400" />
                                                        ) : (
                                                            <FaCopy className="h-3 w-3" />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 font-sans text-xs text-[#F4F2FB]">
                                                {userEmail ? (
                                                    <span className="font-semibold text-[#A78BFA]">{userEmail}</span>
                                                ) : (
                                                    <span className="text-[#6F6A83] italic">System</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-semibold ${typeInfo.badgeColor}`}>
                                                    <TypeIcon className="h-3 w-3" />
                                                    <span>{typeInfo.label}</span>
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 max-w-xs">
                                                <p className="text-[#F4F2FB] font-medium leading-relaxed truncate" title={txn.description}>
                                                    {txn.description}
                                                </p>
                                            </td>

                                            <td className="py-4 px-6 font-mono text-[11px]">
                                                {hasBalanceInfo ? (
                                                    <div className="flex items-center gap-1.5 text-[#8B85A3]">
                                                        <span className="text-gray-400">${Number(txn.balance_before).toFixed(2)}</span>
                                                        <span className="text-[#7C5CF0] font-bold">➔</span>
                                                        <span className="text-[#F4F2FB] font-semibold">${Number(txn.balance_after).toFixed(2)}</span>
                                                    </div>
                                                ) : (
                                                    <span className="text-[#6F6A83] italic">N/A (Admin/Direct)</span>
                                                )}
                                            </td>

                                            <td className="py-4 px-6 text-right font-bold text-sm">
                                                <span className={
                                                    typeInfo.sign === "+"
                                                        ? "text-emerald-400"
                                                        : typeInfo.sign === "-"
                                                        ? "text-[#F4F2FB]"
                                                        : "text-[#F4F2FB]"
                                                }>
                                                    {typeInfo.sign}${Number(txn.amount).toFixed(2)} USDT
                                                </span>
                                            </td>

                                            <td className="py-4 px-6 text-[#8B85A3] text-[11px] font-mono whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <FaCalendarAlt className="h-3 w-3 text-[#6F6A83]" />
                                                    <span>{txn.created_at || "N/A"}</span>
                                                </div>
                                            </td>

                                            <td className="py-4 px-6 text-center">
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        setSelectedTxn(txn);
                                                    }}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#221E2F] bg-[#1A1626] text-[#A78BFA] hover:text-[#F4F2FB] hover:border-[#7C5CF0]/50 transition text-[11px] font-semibold"
                                                >
                                                    <FaInfoCircle className="h-3 w-3" />
                                                    <span>Details</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {pagination && (
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-[#221E2F] bg-[#1A1626]/40 text-xs text-[#8B85A3]">
                        <div>
                            Showing page <span className="font-bold text-[#F4F2FB]">{pagination.current_page}</span> of{" "}
                            <span className="font-bold text-[#F4F2FB]">{pagination.total_pages}</span> (Total{" "}
                            <span className="font-bold text-[#F4F2FB]">{pagination.total}</span> items)
                        </div>
                        <div className="flex items-center gap-2">
                            <button
                                disabled={pagination.current_page <= 1}
                                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#221E2F] bg-[#14111D] text-[#F4F2FB] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#221E2F] transition font-semibold"
                            >
                                <FaChevronLeft className="h-3 w-3" />
                                <span>Previous</span>
                            </button>
                            <button
                                disabled={pagination.current_page >= pagination.total_pages}
                                onClick={() => setCurrentPage((prev) => prev + 1)}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-[#221E2F] bg-[#14111D] text-[#F4F2FB] disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#221E2F] transition font-semibold"
                            >
                                <span>Next</span>
                                <FaChevronRight className="h-3 w-3" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {selectedTxn && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-[#050409]/80 backdrop-blur-sm p-4"
                    onClick={() => setSelectedTxn(null)}
                >
                    <div
                        className="relative w-full max-w-lg rounded-[28px] border border-[#221E2F] bg-[#14111D] p-6 shadow-2xl space-y-6 animate-in zoom-in-95 duration-150"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-[#221E2F] pb-4">
                            <div>
                                <h3 className="text-lg font-bold text-[#F4F2FB]">Transaction Summary</h3>
                                <p className="text-xs font-mono text-[#8B85A3]">ID #{selectedTxn.id}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTxn(null)}
                                className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-2 text-[#8B85A3] transition hover:text-[#F4F2FB]"
                            >
                                <FaTimes className="h-4 w-4" />
                            </button>
                        </div>

                        <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-5 text-center space-y-2">
                            <p className="text-xs text-[#8B85A3] uppercase font-semibold tracking-wider">Transaction Amount</p>
                            <p className="text-3xl font-bold text-[#F4F2FB]">
                                ${Number(selectedTxn.amount || 0).toFixed(2)} USDT
                            </p>
                            <div className="pt-1 flex justify-center">
                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${getTypeInfo(selectedTxn.type || selectedTxn.txn_type || "").badgeColor}`}>
                                    {getTypeInfo(selectedTxn.type || selectedTxn.txn_type || "").label}
                                </span>
                            </div>
                        </div>

                        <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 space-y-3">
                            <p className="text-xs font-semibold text-[#8B85A3]">Balance Audit State</p>
                            <div className="grid grid-cols-2 gap-3 text-center text-xs font-mono">
                                <div className="p-3 rounded-xl bg-[#14111D] border border-[#221E2F]">
                                    <p className="text-[10px] text-[#8B85A3] uppercase">Balance Before</p>
                                    <p className="text-sm font-bold text-gray-300 mt-1">
                                        {selectedTxn.balance_before !== null && selectedTxn.balance_before !== undefined
                                            ? `$${Number(selectedTxn.balance_before).toFixed(2)}`
                                            : "N/A"}
                                    </p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#14111D] border border-[#221E2F]">
                                    <p className="text-[10px] text-[#8B85A3] uppercase">Balance After</p>
                                    <p className="text-sm font-bold text-emerald-400 mt-1">
                                        {selectedTxn.balance_after !== null && selectedTxn.balance_after !== undefined
                                            ? `$${Number(selectedTxn.balance_after).toFixed(2)}`
                                            : "N/A"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3 text-xs">
                            {getUserEmail(selectedTxn) && (
                                <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                    <span className="text-[#8B85A3]">User Email</span>
                                    <span className="font-semibold text-[#A78BFA]">{getUserEmail(selectedTxn)}</span>
                                </div>
                            )}

                            <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                <span className="text-[#8B85A3]">Transaction Type</span>
                                <span className="font-mono font-semibold text-[#F4F2FB]">
                                    {selectedTxn.type || selectedTxn.txn_type}
                                </span>
                            </div>

                            <div className="flex justify-between border-b border-[#221E2F] pb-2">
                                <span className="text-[#8B85A3]">Created At</span>
                                <span className="font-mono text-[#F4F2FB]">{selectedTxn.created_at}</span>
                            </div>

                            <div className="space-y-1 pt-1">
                                <span className="text-[#8B85A3]">Description</span>
                                <div className="rounded-xl border border-[#221E2F] bg-[#1A1626] p-3 text-[#F4F2FB] leading-relaxed">
                                    {selectedTxn.description}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => setSelectedTxn(null)}
                            className="w-full rounded-2xl bg-[#7C5CF0] py-3.5 text-xs font-semibold text-[#F4F2FB] transition hover:bg-[#6A49E0] shadow-lg shadow-[#7C5CF0]/30"
                        >
                            Close Details
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
