"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch } from "@/store/hooks";
import { registerUser } from "@/store/authSlice";
import Link from "next/link";

export default function RegisterPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const dispatch = useAppDispatch();
    const [form, setForm] = useState({ name: "", email: "", password: "", ref: "" });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [submitting, setSubmitting] = useState(false);

    // Auto-fill referral code from URL
    useEffect(() => {
        const refCode = searchParams.get('ref');
        if (refCode) {
            setForm(prev => ({ ...prev, ref: refCode }));
        }
    }, [searchParams]);

    const validatePassword = (pw: string) => {
        // at least 8 chars, one letter and one number
        const re = /^(?=.*[A-Za-z])(?=.*\d).{8,}$/;
        return re.test(pw);
    };

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");

        if (!validatePassword(form.password)) {
            setMsg("Password must be at least 8 characters and include letters and numbers.");
            return;
        }

        if (form.password !== confirmPassword) {
            setMsg("Passwords do not match.");
            return;
        }

        try {
            setSubmitting(true);
            await dispatch(registerUser(form) as any).unwrap();
            setMsg("Registered successfully!");
            setTimeout(() => router.push("/login"), 1500);
        } catch (err: any) {
            setMsg(err?.message || err?.response?.data?.error || "Registration failed");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10 text-slate-100">
            <form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0d1a2e] p-8 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
                <h1 className="text-2xl font-semibold mb-6 text-white">Create your account</h1>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Name
                    <input
                        placeholder="Name"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                    <input
                        placeholder="Email"
                        type="email"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Password
                    <input
                        placeholder="Password"
                        type="password"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Confirm Password
                    <input
                        placeholder="Confirm Password"
                        type="password"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                    Referral Code
                    <input
                        placeholder="Referral Code"
                        type="text"
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        value={form.ref}
                        onChange={(e) => setForm({ ...form, ref: e.target.value })}
                    />
                </label>
                <button
                    className="w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={submitting}
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
                {msg && <p className="text-sm text-center mt-4 text-cyan-300">{msg}</p>}
                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>
                        Already have an account?{" "}
                        <Link href="/login" className="font-semibold text-violet-300 hover:text-violet-200">
                            Login here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
