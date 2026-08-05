"use client";
import { useState } from "react";
import { useToast } from "@/components/ToastProvider";

export default function PasswordChangePage() {
    const { showToast } = useToast();
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
            // Placeholder – integrate API thunk later
            await new Promise(r => setTimeout(r, 600));
            showToast("Password change requested (stub)", "success");
            setForm({ current: "", next: "", confirm: "" });
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
