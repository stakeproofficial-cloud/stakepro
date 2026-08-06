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
import Image from 'next/image';

const ERC20_ABI = [
    { name: 'decimals', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ name: '', type: 'uint8' }] },
    { name: 'transfer', type: 'function', stateMutability: 'nonpayable', inputs: [{ name: 'to', type: 'address' }, { name: 'amount', type: 'uint256' }], outputs: [{ name: '', type: 'bool' }] },
] as const;

// Known USDT addresses (BSC mainnet). Set testnet via env if needed.
const USDT_ADDRESSES: Record<number, `0x${string}` | undefined> = {
    56: '0x55d398326f99059fF775485246999027B3197955', // BSC mainnet};
};

export default function DepositPage() {
    const dispatch = useAppDispatch();
    const { showToast } = useToast();
    const { items: wallets, loading: walletsLoading } = useSelector((s: RootState) => s.wallets);
    const { profile } = useSelector((s: RootState) => s.auth);
    const { loading: balanceLoading } = useSelector((s: RootState) => s.balances);

    const [selectedWallet, setSelectedWallet] = useState<any>(null);
    const [amount, setAmount] = useState('');
    const [txHash, setTxHash] = useState('');
    const [copied, setCopied] = useState(false);
    const [step, setStep] = useState<'transfer' | 'confirm'>('transfer');
    const [isProcessing, setIsProcessing] = useState(false);

    // wagmi
    const { isConnected } = useAccount();
    const chainId = useChainId();
    const publicClient = usePublicClient();
    const { writeContractAsync } = useWriteContract();

    // Resolve USDT contract for current chain
    const usdtAddress = useMemo(() => USDT_ADDRESSES[chainId], [chainId]);

    useEffect(() => {
        dispatch(fetchWallets());
        dispatch(fetchProfile());
        console.log(profile);
    }, [dispatch]);

    // Randomly pick a wallet when wallets are loaded
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
            showToast('Address copied to clipboard!', 'success');
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleWalletTransfer = async () => {
        setIsProcessing(true);
        try {
            if (!isConnected) {
                showToast('Please connect your wallet first', 'error');
                return;
            }
            if (!selectedWallet?.erc20address) {
                showToast('Deposit address unavailable', 'error');
                return;
            }
            const depositAmount = parseFloat(amount);
            if (isNaN(depositAmount) || depositAmount <= 0) {
                showToast('Please enter a valid amount', 'error');
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

            // Read token decimals
            const decimals = await publicClient.readContract({
                address: usdtAddress,
                abi: ERC20_ABI,
                functionName: 'decimals',
            });

            const value = parseUnits(amount, Number(decimals));

            // Execute ERC20 transfer to your deposit address
            const hash = await writeContractAsync({
                address: usdtAddress,
                abi: ERC20_ABI,
                functionName: 'transfer',
                args: [selectedWallet.erc20address as `0x${string}`, value],
            }) as Hash;

            showToast('Transaction sent. Waiting for confirmation...', 'info');

            // Wait for confirmation
            await publicClient.waitForTransactionReceipt({ hash });

            showToast('USDT transfer confirmed on-chain ✔', 'success');

            // Update backend balance after success
            if (profile?.user?.id) {
                await dispatch(updateBalance({
                    user_id: profile.user.id,
                    amount: depositAmount,
                    type: 'deposit',
                    txn_hash: hash,
                })).unwrap();

                showToast('Balance updated successfully 🎉', 'success');
                await dispatch(fetchProfile());
            }

            // Reset UI
            setStep('transfer');
            setAmount('');
            setTxHash('');

        } catch (err: any) {
            const msg = err?.shortMessage || err?.message || 'Transfer failed';
            showToast(msg, 'error');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleConfirmTransfer = async () => {
        if (!txHash || !amount || !profile?.user?.id) {
            showToast('Please fill all fields', 'error');
            return;
        }

        const depositAmount = parseFloat(amount);
        if (isNaN(depositAmount) || depositAmount <= 0) {
            showToast('Please enter a valid amount', 'error');
            return;
        }

        try {
            // await dispatch(updateBalance({
            //     user_id: profile.user.id,
            //     balance: depositAmount,
            // })).unwrap();

            showToast('Deposit confirmed! Balance updated successfully 🎉', 'success');

            await dispatch(fetchProfile());

            setStep('transfer');
            setAmount('');
            setTxHash('');

            const randomIndex = Math.floor(Math.random() * wallets.length);
            setSelectedWallet(wallets[randomIndex]);
        } catch (err: any) {
            showToast(err?.message || 'Failed to update balance', 'error');
        }
    };

    if (walletsLoading || !selectedWallet) {
        return (
            <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-10 px-4">
                <div className="card-premium p-8 rounded-lg">
                    <p className="text-pm-gold-500">Loading wallet address...</p>
                </div>
            </main>
        );
    }

    if (wallets.length === 0) {
        return (
            <main className="flex min-h-screen w-full max-w-4xl flex-col items-center justify-center py-10 px-4">
                <div className="card-premium p-8 rounded-lg">
                    <p className="text-pm-gold-500">No wallets available. Please contact support.</p>
                </div>
            </main>
        );
    }

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            {/* Processing Overlay */}
            {isProcessing && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center">
                    <div className="card-premium p-8 rounded-lg text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-pm-gold-500 mx-auto mb-4"></div>
                        <p className="text-pm-gold-500 text-xl font-semibold">Processing Transaction...</p>
                        <p className="text-pm-muted text-sm mt-2">Please do not close or navigate away</p>
                    </div>
                </div>
            )}

            <div className="w-full max-w-2xl card-premium rounded-lg shadow-lg p-6">
                <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Deposit USDT</h1>

                {/* Current Balance */}
                <div className="mb-6 p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                    <p className="text-sm text-pm-muted mb-1">Current Balance</p>
                    <p className="text-2xl font-bold text-pm-gold-500">
                        ${Number(profile?.user?.balance ?? 0).toFixed(2)}
                    </p>
                </div>

                {/* Step Indicator */}
                <div className="mb-8 flex justify-between items-center">
                    <div className={`flex items-center ${step === 'transfer' ? 'text-pm-gold-500' : 'text-pm-muted'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'transfer' ? 'bg-pm-gold-500 text-pm-black' : 'bg-pm-brown-700'}`}>
                            1
                        </div>
                        <span className="ml-2">Transfer USDT</span>
                    </div>
                    <div className={`h-1 flex-1 mx-4 ${step === 'confirm' ? 'bg-pm-gold-500' : 'bg-pm-brown-700'}`}></div>
                    <div className={`flex items-center ${step === 'confirm' ? 'text-pm-gold-500' : 'text-pm-muted'}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'confirm' ? 'bg-pm-gold-500 text-pm-black' : 'bg-pm-brown-700'}`}>
                            2
                        </div>
                        <span className="ml-2">Confirm</span>
                    </div>
                </div>

                {/* Step 1: Transfer USDT */}
                {step === 'transfer' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-pm-gold-500">Transfer USDT</h2>

                        <div className="mb-4">
                            <ConnectButton />
                        </div>

                        <div className="mb-6 p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                            <p className="text-sm text-pm-muted mb-2">Deposit Address</p>
                            <div className="flex items-center gap-2">
                                <p className="flex-1 font-mono text-pm-gold-500 break-all">{selectedWallet.erc20address}</p>
                                <button
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 bg-pm-gold-900 text-pm-gold-500 rounded hover:bg-pm-gold-500 hover:text-pm-black transition"
                                >
                                    {copied ? '✓' : 'Copy'}
                                </button>
                            </div>
                        </div>

                        <div className="mb-6 p-4 bg-yellow-900/20 border border-yellow-600/50 rounded-lg">
                            <p className="text-yellow-400 text-sm">
                                ⚠️ Only send USDT (BEP20 on BSC) to this address. Sending other tokens may result in loss.
                            </p>
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                Amount (USDT)
                            </label>
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                placeholder="Enter amount"
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent placeholder-pm-muted"
                                step="0.01"
                                min="0"
                            />
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleWalletTransfer}
                                disabled={!isConnected || !amount || parseFloat(amount) <= 0 || !usdtAddress || isProcessing}
                                className="flex-1 btn-gold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isProcessing ? 'Processing...' : 'Send from connected wallet'}
                            </button>
                            {/* <button
                                onClick={() => setStep('confirm')}
                                disabled={!amount || parseFloat(amount) <= 0}
                                className="flex-1 bg-pm-brown-700 text-pm-gold-500 px-6 py-3 rounded-lg hover:bg-pm-brown-500 transition border border-pm-gold-900/30 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                I’ve sent USDT (enter hash)
                            </button> */}
                        </div>
                    </div>
                )}

                {/* Step 2: Confirm Transaction (manual flow) */}
                {step === 'confirm' && (
                    <div>
                        <h2 className="text-xl font-semibold mb-4 text-pm-gold-500">Confirm Transaction</h2>

                        <div className="mb-6 p-4 bg-pm-brown-900/50 rounded-lg border border-pm-gold-900/30">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-pm-muted">Amount</p>
                                    <p className="text-lg font-semibold text-pm-gold-500">${amount} USDT</p>
                                </div>
                                <div>
                                    <p className="text-sm text-pm-muted">Wallet</p>
                                    <p className="text-lg font-semibold text-pm-gold-500 font-mono">
                                        {String(selectedWallet.erc20address).substring(0, 8)}...
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <label className="block text-sm font-medium text-pm-gold-500 mb-2">
                                Transaction Hash
                            </label>
                            <input
                                type="text"
                                value={txHash}
                                onChange={(e) => setTxHash(e.target.value)}
                                placeholder="Enter transaction hash"
                                className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent placeholder-pm-muted font-mono"
                            />
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => setStep('transfer')}
                                className="flex-1 bg-pm-brown-700 text-pm-gold-500 px-6 py-3 rounded-lg hover:bg-pm-brown-500 transition border border-pm-gold-900/30"
                            >
                                Back
                            </button>
                            <button
                                onClick={handleConfirmTransfer}
                                disabled={balanceLoading}
                                className="flex-1 btn-gold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {balanceLoading ? 'Processing...' : 'Confirm Deposit'}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}