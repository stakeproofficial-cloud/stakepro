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
        <main className="flex items-center justify-center min-h-screen">
            <form onSubmit={submit} className="w-80 bg-white p-6 rounded shadow">
                <h1 className="text-xl font-bold mb-4">Login</h1>
                <input
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border p-2 mb-2 w-full"
                    type="email"
                />
                <input
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="border p-2 mb-4 w-full"
                    type="password"
                />
                <button
                    className="bg-blue-600 text-white w-full py-2 rounded disabled:opacity-50"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
                {msg && <p className="text-sm text-center mt-2 text-red-600">{msg}</p>}
                
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                            Register here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
