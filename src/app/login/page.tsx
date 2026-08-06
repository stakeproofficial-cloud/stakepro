"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { login } from "@/store/authSlice";

export default function LoginPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMsg("");
        setLoading(true);
        try {
            const result = await (dispatch(login({ email, password }) as any)).unwrap();
            const role = result?.user?.role;
            if (role === "admin") router.push("/admin");
            else router.push("/user");
        } catch (err: any) {
            setMsg(err?.message || err?.response?.data?.error || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 py-10 text-slate-100">
            <form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-white/10 bg-[#0d1a2e] p-8 shadow-[0_25px_80px_rgba(15,23,42,0.35)]">
                <h1 className="text-2xl font-semibold mb-6 text-white">Welcome back</h1>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                    Email
                    <input
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        type="email"
                    />
                </label>
                <label className="block text-sm font-medium text-slate-300 mb-4">
                    Password
                    <input
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-2 w-full rounded-2xl border border-white/10 bg-[#101d32] px-4 py-3 text-slate-100 outline-none transition focus:border-violet-400 focus:ring-2 focus:ring-violet-400/20"
                        type="password"
                    />
                </label>
                <button
                    className="w-full rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-5 py-3 text-base font-semibold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                {msg && <p className="text-sm text-center mt-4 text-rose-400">{msg}</p>}

                <div className="mt-6 text-center text-sm text-slate-400">
                    <p>
                        Don't have an account?{" "}
                        <Link href="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
                            Register here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
