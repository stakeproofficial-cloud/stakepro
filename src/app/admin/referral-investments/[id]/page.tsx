"use client";
import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchReferralInvestments } from "@/store/adminSlice";

export default function ReferralInvestmentsPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const params = useParams();
    const userId = Number(params.id);

    const { referralInvestments, referralLoading, error } = useAppSelector((s) => s.admin);

    useEffect(() => {
        if (userId) {
            dispatch(fetchReferralInvestments(userId) as any);
        }
    }, [dispatch, userId]);

    if (referralLoading) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold">Referral Investments</h1>
                </div>
                <p className="text-center text-gray-600">Loading...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <button
                        onClick={() => router.back()}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                    >
                        ← Back
                    </button>
                    <h1 className="text-2xl font-bold">Referral Investments</h1>
                </div>
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                    Error: {error}
                </div>
            </div>
        );
    }

    const user = referralInvestments?.user || {};
    const directReferrals = referralInvestments?.direct_referrals || [];

    return (
        <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={() => router.back()}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                >
                    ← Back
                </button>
                <h1 className="text-2xl font-bold">Referral Investments</h1>
            </div>

            {/* User Information Card */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h2 className="text-lg font-semibold mb-4">User Information</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">ID</p>
                        <p className="font-medium text-lg">{user.id}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Name</p>
                        <p className="font-medium text-lg">{user.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Email</p>
                        <p className="font-medium text-sm break-all">{user.email}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Referral Code</p>
                        <p className="font-medium text-lg">{user.referral_code}</p>
                    </div>
                    <div className="col-span-2 md:col-span-1">
                        <p className="text-sm text-gray-500">Total Investment</p>
                        <p className="font-medium text-lg text-green-600">${user.total_investment?.toFixed(2)}</p>
                    </div>
                </div>

                {/* User Investments */}
                {user.investments && user.investments.length > 0 && (
                    <div className="mt-6">
                        <h3 className="font-semibold mb-3">User's Investments</h3>
                        <div className="bg-gray-50 rounded overflow-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">ID</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Product</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Amount</th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                    {user.investments.map((inv: any) => (
                                        <tr key={inv.id} className="hover:bg-gray-100">
                                            <td className="px-4 py-2 text-sm text-gray-900">{inv.id}</td>
                                            <td className="px-4 py-2 text-sm text-gray-900">{inv.product_name || 'N/A'}</td>
                                            <td className="px-4 py-2 text-sm text-green-600 font-medium">${inv.amount?.toFixed(2)}</td>
                                            <td className="px-4 py-2 text-sm text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>

            {/* Direct Referrals Section */}
            <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-semibold mb-4">Direct Referrals ({directReferrals.length})</h2>
                {directReferrals.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No direct referrals</p>
                ) : (
                    <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Investment</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Investments</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {directReferrals.map((referral: any) => (
                                    <tr key={referral.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 text-sm text-gray-900">{referral.id}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900 font-medium">{referral.name}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500 break-all">{referral.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{new Date(referral.joined_at).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-sm text-green-600 font-medium">${referral.total_investment?.toFixed(2)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <details className="cursor-pointer">
                                                <summary className="text-blue-600 hover:text-blue-800 font-medium">
                                                    View ({referral.investments?.length || 0})
                                                </summary>
                                                {referral.investments && referral.investments.length > 0 ? (
                                                    <div className="mt-3 bg-gray-50 rounded p-3">
                                                        <table className="min-w-full text-sm">
                                                            <thead className="bg-gray-100">
                                                                <tr>
                                                                    <th className="px-2 py-1 text-left text-xs font-medium">ID</th>
                                                                    <th className="px-2 py-1 text-left text-xs font-medium">Product</th>
                                                                    <th className="px-2 py-1 text-left text-xs font-medium">Amount</th>
                                                                    <th className="px-2 py-1 text-left text-xs font-medium">Date</th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {referral.investments.map((inv: any) => (
                                                                    <tr key={inv.id} className="border-t">
                                                                        <td className="px-2 py-1">{inv.id}</td>
                                                                        <td className="px-2 py-1">{inv.product_name || 'N/A'}</td>
                                                                        <td className="px-2 py-1 text-green-600 font-medium">${inv.amount?.toFixed(2)}</td>
                                                                        <td className="px-2 py-1 text-gray-500">{new Date(inv.created_at).toLocaleDateString()}</td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                ) : (
                                                    <p className="mt-2 text-gray-500 text-xs">No investments</p>
                                                )}
                                            </details>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
