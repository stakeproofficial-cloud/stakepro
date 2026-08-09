'use client';
import { useEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import { useAppDispatch } from '@/store/hooks';
import { fetchWallets } from '@/store/walletSlice';
import { updateBalance } from '@/store/balanceSlice';
import { fetchProfile } from '@/store/authSlice';
import { useToast } from '@/components/ToastProvider';
import { ConnectButton } from '@/components/ConnectButton';
import { useAccount, useChainId, usePublicClient, useWriteContract } from 'wagmi';
import { parseUnits, type Hash } from 'viem';
import Link from 'next/link';
import { FaCopy, FaCheck, FaWallet, FaExclamationTriangle, FaArrowDown, FaHistory } from 'react-icons/fa';

const ERC20_ABI = [
    { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
    { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
] as const;

const USDT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
    56: '0x55d398326f99059ff775485246999027b3197955', // BSC mainnet
};

export default function DepositPage() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const { items: wallets, loading: walletsLoading } = useSelector((s: RootState) => s.wallets);
    const { profile } = useSelector((s: RootState) => s.auth);
    const { loading: balanceLoading } = useSelector((s: RootState) => s.balances);

    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [copied, setCopied] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    // wagmi
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    const usdtAddress = useMemo(() => USDT_ADDRESSES[chainId], [chainId]);

    useEffect(() => {
        dispatch(fetchWallets());
        dispatch(fetchProfile());
    }, [dispatch]);

    useEffect(() => {
        if (wallets.length > 0 && !selectedWallet) {
            const randomIndex = Math.floor(Math.random() * wallets.length);
            setSelectedWallet(wallets[randomIndex]);
        }
    }, [wallets, selectedWallet]);

    const copyToClipboard = () => {
        const addr = selectedWallet?.erc20address;
        if (addr) {
            navigator.clipboard.writeText(addr);
            setCopied(true);
            showToast('Deposit address copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWalletTransfer = async () => {
        setIsProcessing(true);
        try {
            if (!isConnected) {
                showToast('Please connect your web3 wallet first', 'error');
                return;
            }
            if (!selectedWallet?.erc20address) {
                showToast('Deposit address unavailable', 'error');
                return;
            }
            const depositAmount = parseFloat(amount);
            if (isNaN(depositAmount) || depositAmount <= 0) {
                showToast('Please enter a valid deposit amount', 'error');
                return;
            }
            if (!usdtAddress) {
                showToast('USDT contract not configured for this network', 'error');
                return;
            }
            if (!publicClient) {
                showToast('Network client not ready. Try again.', 'error');
                return;
            }

            const decimals = await publicClient.readContract({
                address: usdtAddress,
                abi: ERC20_ABI,
                functionName: 'decimals',
            });

            const value = parseUnits(amount, Number(decimals));

            const hash = await writeContractAsync({
                address: usdtAddress,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [selectedWallet.erc20address as `0x${string}`, value],
            }) as Hash;

            showToast('Transaction sent. Waiting for on-chain confirmation...', 'info');

            const receipt = await publicClient.waitForTransactionReceipt({ hash });

            if (receipt.status !== 'success') {
                showToast('Transaction failed or reverted on blockchain. Balance was not updated.', 'error');
                return;
            }

            showToast('USDT transfer confirmed on-chain ✔', 'success');

            if (profile?.user?.id) {
                await dispatch(updateBalance({
                    user_id: profile.user.id,
                    amount: depositAmount,
                    type: 'deposit',
                    txn_hash: hash,
                })).unwrap();

                showToast('Staking balance updated successfully 🎉', 'success');
                await dispatch(fetchProfile());
            }

            setAmount('');
        } catch (err: any) {
            const msg = err?.shortMessage || err?.message || 'Transfer failed';
            showToast(msg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (walletsLoading || !selectedWallet) {
        return (
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-8 text-center text-xs text-[#8B85A3]">
                Loading deposit address...
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">Deposit USDT</h1>
                    <p className="text-xs text-[#8B85A3]">Add funds to your StakePro wallet (BEP20 on BSC)</p>
                </div>
                <Link
                    href="/user/deposit-history"
                    className="flex items-center gap-1.5 rounded-xl border border-[#221E2F] bg-[#1A1626] px-3 py-2 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#7C5CF0]/20 hover:text-[#F4F2FB]"
                >
                    <FaHistory className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Deposit History</span>
                </Link>
            </div>

            {/* Current Balance Overview */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-5 shadow-xl space-y-4">
                <div>
                    <p className="text-xs text-[#8B85A3]">Current Staking Balance</p>
                    <p className="text-2xl font-bold text-[#F4F2FB]">
                        ${Number(profile?.user?.balance ?? 0).toFixed(2)} USDT
                    </p>
                </div>

                {/* Web3 Connect Button */}
                <div className="pt-2">
                    <ConnectButton />
                </div>

                {/* Deposit Address Box */}
                <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-4 space-y-2">
                    <p className="text-xs font-semibold text-[#8B85A3]">Official Deposit Address (BSC / BEP20)</p>
                    <div className="flex items-center justify-between gap-3">
                        <span className="font-mono text-xs font-semibold text-[#A78BFA] break-all">
                            {selectedWallet.erc20address}
                        </span>
                        <button
                            onClick={copyToClipboard}
                            className="flex items-center gap-1.5 rounded-xl bg-[#7C5CF0]/20 px-3 py-2 text-xs font-semibold text-[#A78BFA] transition hover:bg-[#7C5CF0]/30 flex-shrink-0"
                        >
                            {copied ? <FaCheck className="h-3 w-3 text-[#22C55E]" /> : <FaCopy className="h-3 w-3" />}
                            <span>{copied ? 'Copied' : 'Copy'}</span>
                        </button>
                    </div>
                </div>

                {/* Warning Alert */}
                <div className="flex items-start gap-2.5 rounded-2xl border border-[#E24B4A]/30 bg-[#E24B4A]/10 p-3.5 text-xs text-[#E24B4A]">
                    <FaExclamationTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
                    <span>
                        Only transfer USDT via <strong>BEP20 (Binance Smart Chain)</strong> network to this address.
                    </span>
                </div>

                {/* Amount Form */}
                <div className="space-y-3 pt-2">
                    <label className="text-xs font-semibold text-[#F4F2FB]">Deposit Amount (USDT)</label>
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="Enter USDT amount"
                        className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 px-4 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                    />

                    <button
                        onClick={handleWalletTransfer}
                        disabled={!isConnected || !amount || parseFloat(amount) <= 0 || !usdtAddress || isProcessing}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CF0] py-4 text-sm font-semibold text-[#F4F2FB] shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50"
                    >
                        <FaArrowDown className="h-4 w-4" />
                        <span>{isProcessing ? 'Processing Deposit...' : 'Deposit from Connected Wallet'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}