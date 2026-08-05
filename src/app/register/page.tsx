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
        <main className="flex flex-col items-center justify-center h-screen">
            <form onSubmit={submit} className="bg-white shadow-md p-6 rounded w-80">
                <h1 className="text-xl font-bold mb-4">Register</h1>
                <input
                    placeholder="Name"
                    className="border p-2 mb-2 w-full"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                <input
                    placeholder="Email"
                    type="email"
                    className="border p-2 mb-2 w-full"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    placeholder="Password"
                    type="password"
                    className="border p-2 mb-2 w-full"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
                <input
                    placeholder="Confirm Password"
                    type="password"
                    className="border p-2 mb-2 w-full"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <input
                    placeholder="Referral Code"
                    type="text"
                    className="border p-2 mb-2 w-full"
                    value={form.ref}
                    onChange={(e) => setForm({ ...form, ref: e.target.value })}
                />
                <button
                    className="bg-green-600 text-white w-full py-2 rounded disabled:opacity-50"
                    disabled={submitting}
                >
                    {submitting ? "Registering..." : "Register"}
                </button>
                {msg && <p className="text-sm text-center mt-2 text-blue-600">{msg}</p>}
                <div className="mt-4 text-center">
                    <p className="text-sm text-gray-600">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                            Login here
                        </Link>
                    </p>
                </div>
            </form>
        </main>
    );
}
