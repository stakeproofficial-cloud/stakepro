"use client";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchWallets, addWallet } from "@/store/walletSlice";

export default function AdminWalletsPage() {
    const dispatch = useAppDispatch();
    const { items: wallets, loading } = useAppSelector((s) => s.wallets);
    const [showForm, setShowForm] = useState(false);
    const [address, setAddress] = useState("");
    const [copiedId, setCopiedId] = useState<number | null>(null);

    useEffect(() => {
        dispatch(fetchWallets());
    }, [dispatch]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!address) {
            alert("Please fill all fields");
            return;
        }

        try {
            await dispatch(addWallet({ erc20address: address })).unwrap();
            alert("Wallet added successfully");
            setAddress("");
            setShowForm(false);
        } catch (error) {
            alert("Failed to add wallet");
        }
    };

    const copyAddress = (address: string, id: number) => {
        navigator.clipboard.writeText(address);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return <div className="p-6">Loading wallets...</div>;
    }

    return (
        <div className="p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">System Wallets</h1>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    {showForm ? 'Cancel' : '+ Add Wallet'}
                </button>
            </div>

            {showForm && (
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                    <h2 className="text-lg font-semibold mb-4">Add New Wallet</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Wallet Address (ERC20)
                            </label>
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="0x..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                        >
                            Add Wallet
                        </button>
                    </form>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-auto">
                {wallets.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                        No wallets found. Add your first wallet to get started.
                    </div>
                ) : (
                    <div className="divide-y divide-gray-200">
                        {wallets.map((wallet) => (
                            <div key={wallet.id} className="p-6 hover:bg-gray-50 transition">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-gray-900">
                                                    Wallet #{wallet.id}
                                                </h3>
                                                <p className="text-sm text-gray-500">ERC20 Address</p>
                                            </div>
                                        </div>
                                        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                            <div className="flex items-center justify-between">
                                                <code className="text-sm font-mono text-gray-700 break-all">
                                                    {wallet.erc20address}
                                                </code>
                                                <button
                                                    onClick={() => copyAddress(wallet.erc20address, wallet.id)}
                                                    className="ml-4 px-3 py-1 bg-white border border-gray-300 rounded hover:bg-gray-100 transition text-sm flex items-center gap-2"
                                                    title="Copy address"
                                                >
                                                    {copiedId === wallet.id ? (
                                                        <>
                                                            <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                            <span className="text-green-600">Copied!</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                                            </svg>
                                                            Copy
                                                        </>
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="mt-6 bg-white rounded-lg shadow p-4">
                <h2 className="text-lg font-semibold mb-3">Information</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded p-4">
                        <div className="text-sm text-gray-600">Total Wallets</div>
                        <div className="text-2xl font-bold text-gray-900">{wallets.length}</div>
                    </div>
                    <div className="bg-blue-50 rounded p-4">
                        <div className="text-sm text-blue-600">Active Wallets</div>
                        <div className="text-2xl font-bold text-blue-900">{wallets.length}</div>
                    </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <div className="font-medium text-yellow-900">Important</div>
                            <p className="text-sm text-yellow-800 mt-1">
                                These wallet addresses are used for deposit and withdrawal operations.
                                Make sure they are secure and backed up. Never share private keys.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
