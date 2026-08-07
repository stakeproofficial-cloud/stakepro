"use client";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { useAppDispatch } from "@/store/hooks";
import { changePassword } from "@/store/authSlice";
import { FaLock, FaEye, FaEyeSlash, FaShieldAlt, FaCheckCircle, FaExclamationCircle } from "react-icons/fa";

export default function ChangePasswordPage() {
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [submitting, setSubmitting] = useState(false);

    // Password visibility states
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNext, setShowNext] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const isLengthValid = form.next.length >= 8;
    const isMatchValid = form.next.length > 0 && form.next === form.confirm;

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (form.next !== form.confirm) {
            showToast("New passwords do not match", "error");
            return;
        }
        if (form.next.length < 8) {
            showToast("Password must be at least 8 characters", "error");
            return;
        }
        setSubmitting(true);
        try {
            await dispatch(changePassword({ current: form.current, next: form.next, confirm: form.confirm })).unwrap();
            showToast("Password updated successfully 🎉", "success");
            setForm({ current: "", next: "", confirm: "" });
        } catch (err: any) {
            showToast(err?.message || "Failed to change password", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="space-y-6 pb-8">
            {/* Header Banner */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-xl font-bold text-[#F4F2FB] tracking-tight">Security & Password</h1>
                    <p className="text-xs text-[#8B85A3]">Update your account password to ensure maximum security</p>
                </div>
            </div>

            {/* Security Notice Card */}
            <div className="flex items-start gap-3 rounded-[20px] border border-[#7C5CF0]/30 bg-[#7C5CF0]/10 p-4 text-xs text-[#B9A4F7]">
                <FaShieldAlt className="h-5 w-5 text-[#7C5CF0] flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                    <p className="font-semibold text-[#F4F2FB]">Security Recommendation</p>
                    <p className="text-[#8B85A3]">
                        Use a strong password that is at least 8 characters long, combining uppercase letters, numbers, and symbols.
                    </p>
                </div>
            </div>

            {/* Password Change Form Card */}
            <div className="rounded-[20px] border border-[#221E2F] bg-[#14111D] p-6 shadow-xl space-y-5">
                <form onSubmit={submit} className="space-y-4">
                    {/* Current Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Current Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6A83]">
                                <FaLock className="h-4 w-4" />
                            </div>
                            <input
                                type={showCurrent ? "text" : "password"}
                                value={form.current}
                                onChange={e => setForm({ ...form, current: e.target.value })}
                                placeholder="Enter current password"
                                className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 pl-11 pr-11 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowCurrent(!showCurrent)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F6A83] hover:text-[#A78BFA] transition"
                            >
                                {showCurrent ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* New Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6A83]">
                                <FaLock className="h-4 w-4" />
                            </div>
                            <input
                                type={showNext ? "text" : "password"}
                                value={form.next}
                                onChange={e => setForm({ ...form, next: e.target.value })}
                                placeholder="Enter new password"
                                className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 pl-11 pr-11 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowNext(!showNext)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F6A83] hover:text-[#A78BFA] transition"
                            >
                                {showNext ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Confirm New Password */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-[#F4F2FB]">Confirm New Password</label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6F6A83]">
                                <FaLock className="h-4 w-4" />
                            </div>
                            <input
                                type={showConfirm ? "text" : "password"}
                                value={form.confirm}
                                onChange={e => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Confirm new password"
                                className="w-full rounded-2xl border border-[#221E2F] bg-[#1A1626] py-3.5 pl-11 pr-11 text-sm font-semibold text-[#F4F2FB] placeholder-[#6F6A83] focus:border-[#7C5CF0] focus:outline-none"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirm(!showConfirm)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6F6A83] hover:text-[#A78BFA] transition"
                            >
                                {showConfirm ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
                            </button>
                        </div>
                    </div>

                    {/* Validation Hints */}
                    {form.next && (
                        <div className="rounded-2xl border border-[#221E2F] bg-[#1A1626] p-3.5 space-y-2 text-xs">
                            <div className="flex items-center gap-2">
                                {isLengthValid ? (
                                    <FaCheckCircle className="h-3.5 w-3.5 text-[#22C55E]" />
                                ) : (
                                    <FaExclamationCircle className="h-3.5 w-3.5 text-[#8B85A3]" />
                                )}
                                <span className={isLengthValid ? "text-[#22C55E]" : "text-[#8B85A3]"}>
                                    At least 8 characters long
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                {isMatchValid ? (
                                    <FaCheckCircle className="h-3.5 w-3.5 text-[#22C55E]" />
                                ) : (
                                    <FaExclamationCircle className="h-3.5 w-3.5 text-[#8B85A3]" />
                                )}
                                <span className={isMatchValid ? "text-[#22C55E]" : "text-[#8B85A3]"}>
                                    Passwords match
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        disabled={submitting || !form.current || !form.next || !form.confirm || !isLengthValid || !isMatchValid}
                        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#7C5CF0] py-4 text-sm font-semibold text-[#F4F2FB] shadow-lg shadow-[#7C5CF0]/30 transition hover:bg-[#6A49E0] active:scale-[0.99] disabled:opacity-50 mt-2"
                    >
                        <FaLock className="h-4 w-4" />
                        <span>{submitting ? "Updating Password..." : "Update Password"}</span>
                    </button>
                </form>
            </div>
        </div>
    );
}
