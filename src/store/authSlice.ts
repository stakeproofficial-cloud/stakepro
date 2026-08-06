import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "@/lib/api";
import type { User } from "@/types/user";

interface AuthState {
    user: User | null;
    profile: any;
    access_token: string | null;
    loading: boolean;
    hydrating: boolean;
    error?: string;
}

const initialState: AuthState = {
    user: null,
    profile: null,
    access_token: null,
    loading: false,
    hydrating: true,
    error: undefined,
};

export const login = createAsyncThunk(
    "auth/login",
    async (data: { email: string; password: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/login", data);
            const token = res.data.access_token;
            const userRole = res.data.user?.role || 'user';
            if (typeof window !== "undefined") {
                localStorage.setItem("access_token", token);
                document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                document.cookie = `user_role=${encodeURIComponent(userRole)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const registerUser = createAsyncThunk(
    "auth/register",
    async (payload: { name: string; email: string; password: string; ref?: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/register", payload);
            const token = res.data.access_token;
            const userRole = res.data.user?.role || 'user';
            if (typeof window !== "undefined" && token) {
                localStorage.setItem("access_token", token);
                document.cookie = `access_token=${encodeURIComponent(token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
                document.cookie = `user_role=${encodeURIComponent(userRole)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            }
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const logout = createAsyncThunk("auth/logout", async () => {
    try {
        await api.get("/logout");
    } finally {
        if (typeof window !== "undefined") {
            localStorage.removeItem("access_token");
            document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax";
            document.cookie = "user_role=; path=/; max-age=0; SameSite=Lax";
        }
    }
});

// Safe client-side hydration from cookies (avoids SSR mismatches)
export const hydrateFromCookies = createAsyncThunk(
    "auth/hydrateFromCookies",
    async () => {
        if (typeof document === "undefined") return { access_token: null as string | null, role: null as User["role"] | null };
        const getCookie = (name: string) => {
            const match = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([.$?*|{}()\[\]\\\/\+^])/g, "\\$1") + "=([^;]*)"));
            return match ? decodeURIComponent(match[1]) : null;
        };
        const token = getCookie("access_token");
        const roleVal = getCookie("user_role");
        const role = roleVal === "admin" || roleVal === "user" ? roleVal : null;
        if (token && typeof window !== "undefined") {
            try { localStorage.setItem("access_token", token); } catch { }
        }
        return { access_token: token, role };
    }
);

export const refreshToken = createAsyncThunk("auth/refresh", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get("/refresh");
        if (res.data?.access_token && typeof window !== "undefined") {
            localStorage.setItem("access_token", res.data.access_token);
            const userRole = res.data.user?.role || 'user';
            document.cookie = `access_token=${encodeURIComponent(res.data.access_token)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
            document.cookie = `user_role=${encodeURIComponent(userRole)}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax`;
        }
        return res.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});

export const fetchProfile = createAsyncThunk("auth/fetchProfile", async (_, { rejectWithValue }) => {
    try {
        const r = await api.get("/me");
        console.log(r.data);
        return r.data;
    } catch (err: any) {
        return rejectWithValue(err?.response?.data || { message: err.message });
    }
});

export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (payload: { formData: FormData }, { rejectWithValue }) => {
        try {
            const res = await api.post("/update-profile", payload.formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

export const changePassword = createAsyncThunk(
    "auth/changePassword",
    async (payload: { current: string; next: string, confirm: string }, { rejectWithValue }) => {
        try {
            const res = await api.post("/change-password", {
                current_password: payload.current,
                new_password: payload.next,
                confirm_password: payload.confirm
            });
            return res.data;
        } catch (err: any) {
            return rejectWithValue(err?.response?.data || { message: err.message });
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAccessToken(state, action: PayloadAction<string | null>) {
            state.access_token = action.payload;
        },
        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(login.fulfilled, (s, a) => { s.loading = false; s.access_token = a.payload?.access_token ?? s.access_token; s.user = a.payload?.user ?? s.user; })
            .addCase(login.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })

            .addCase(registerUser.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(registerUser.fulfilled, (s, a) => { s.loading = false; s.access_token = a.payload?.access_token ?? s.access_token; s.user = a.payload?.user ?? s.user; })
            .addCase(registerUser.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })

            .addCase(logout.fulfilled, (s) => { s.user = null; s.access_token = null; })
            .addCase(hydrateFromCookies.pending, (s) => {
                s.hydrating = true;
            })
            .addCase(hydrateFromCookies.fulfilled, (s, a) => {
                s.hydrating = false;
                s.access_token = a.payload.access_token ?? s.access_token;
                if (a.payload.role && !s.user) {
                    s.user = { id: -1, email: "", role: a.payload.role } as User;
                }
            })
            .addCase(hydrateFromCookies.rejected, (s) => {
                s.hydrating = false;
            })
            .addCase(refreshToken.fulfilled, (s, a) => { s.access_token = a.payload?.access_token ?? s.access_token; })
            .addCase(fetchProfile.fulfilled, (s, a) => { s.profile = a.payload; })
            .addCase(updateProfile.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(updateProfile.fulfilled, (s, a) => { s.loading = false; s.profile = a.payload; })
            .addCase(updateProfile.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; })
            .addCase(changePassword.pending, (s) => { s.loading = true; s.error = undefined; })
            .addCase(changePassword.fulfilled, (s) => { s.loading = false; })
            .addCase(changePassword.rejected, (s, a: any) => { s.loading = false; s.error = a.payload?.message ?? a.error?.message; });
    },
});

export const { setAccessToken, setUser } = authSlice.actions;
export default authSlice.reducer;
