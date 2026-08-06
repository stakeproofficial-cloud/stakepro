"use client";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";
import { useAppDispatch } from "@/store/hooks";
import { changePassword } from "@/store/authSlice";

export default function ChangePasswordPage() {
    const { showToast } = useToast();
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({ current: "", next: "", confirm: "" });
    const [submitting, setSubmitting] = useState(false);

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
            showToast("Password updated successfully", "success");
            setForm({ current: "", next: "", confirm: "" });
        } catch (err: any) {
            showToast(err?.message || "Failed to change password", "error");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen w-full max-w-4xl flex-col items-center py-10 px-4">
            <form onSubmit={submit} className="card-premium rounded-lg shadow-lg p-6 w-full max-w-md">
                <h1 className="text-3xl font-bold mb-6 text-pm-gold-500">Change Password</h1>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-pm-gold-500 mb-2">Current Password</label>
                        <input type="password" value={form.current} onChange={e => setForm({ ...form, current: e.target.value })} className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pm-gold-500 mb-2">New Password</label>
                        <input type="password" value={form.next} onChange={e => setForm({ ...form, next: e.target.value })} className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-pm-gold-500 mb-2">Confirm New Password</label>
                        <input type="password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} className="w-full px-4 py-3 bg-pm-char border border-pm-gold-900 text-pm-gold-500 rounded-lg focus:ring-2 focus:ring-pm-gold-500 focus:border-transparent" required />
                    </div>
                    <button disabled={submitting} className="w-full btn-gold px-6 py-3 rounded-lg disabled:opacity-50">
                        {submitting ? "Submitting..." : "Update Password"}
                    </button>
                </div>
            </form>
        </main>
    );
}
